import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const routeDbName = config.require("route_db_name");
const routeDbUsername = config.require("route_db_username");
const routeDbPassword = config.require("route_db_password");

// Step 1: Create an ECS Fargate cluster.
export const cluster = new awsx.ecs.Cluster("cluster");

export const vpc = awsx.ec2.Vpc.getDefault();

export const alb = new awsx.lb.ApplicationLoadBalancer("app-lb", {
    external: true,
    securityGroups: cluster.securityGroups,
});

export const atgApolloGateway = alb.createTargetGroup("app-tg-apollo-gateway", {
    port: 4000,
    protocol: "HTTP",
    deregistrationDelay: 0,
    healthCheck: { path: "/.well-known/apollo/server-health", port: "4000" },
});

export const apolloGatewayListener = atgApolloGateway.createListener(
    "app-tg-listener-apollo-gateway",
    { port: 80, external: true, protocol: "HTTP" },
);

export const nlb = new awsx.lb.NetworkLoadBalancer("net-lb", {
    subnets: vpc.publicSubnetIds,
});

export const ntgRouteServiceListener = nlb.createListener("net-lb-route", {
    port: 4001,
    protocol: "TCP",
});

export const ntgMlServiceListener = nlb.createListener("net-lb-ml", {
    port: 5000,
    protocol: "TCP",
});

// Step 4: Build and publish a Docker image to a private ECR registry.
export const routeServiceImage = awsx.ecs.Image.fromDockerBuild("route-service", {
    context: "../",
    dockerfile: "../backend/routes/Dockerfile",
});

export const mlServiceImage = awsx.ecs.Image.fromDockerBuild("ml-service", {
    context: "../backend/ml",
    dockerfile: "../backend/ml/Dockerfile",
});

export const apiGatewayImage = awsx.ecs.Image.fromDockerBuild("api-gateway", {
    context: "../",
    dockerfile: "../backend/api-gateway/Dockerfile",
});

// Create a new subnet group for the database.
export const subnetGroup = new aws.rds.SubnetGroup("dbsubnets", {
    subnetIds: vpc.publicSubnetIds,
});

// Step 3: Create databases
export const routeDb = new aws.rds.Instance("route-db", {
    engine: "postgres",
    instanceClass: aws.rds.InstanceTypes.T3_Micro,
    allocatedStorage: 5,
    dbSubnetGroupName: subnetGroup.id,
    vpcSecurityGroupIds: cluster.securityGroups.map((g) => g.id),
    name: routeDbName,
    username: routeDbUsername,
    password: routeDbPassword,
    skipFinalSnapshot: true,
});

// Assemble connection strings for the databases
export const routeDbConnectionString = pulumi.interpolate`postgres://${routeDbUsername}:${routeDbPassword}@${routeDb.endpoint}/routes?schema=public&sslmode=disable`;

// Step 5: Create a Fargate service task that can scale out.
export const fargateService = new awsx.ecs.FargateService("api", {
    cluster,
    taskDefinitionArgs: {
        containers: {
            routeService: {
                image: routeServiceImage,
                portMappings: [ntgRouteServiceListener],
                environment: [{ name: "DATABASE_URL", value: routeDbConnectionString }],
                healthCheck: {
                    command: [
                        "CMD-SHELL",
                        "curl --fail http://localhost:4001/.well-known/apollo/server-health/ || exit 1",
                    ],
                    startPeriod: 30,
                    retries: 10,
                },
            },
            mlService: {
                image: mlServiceImage,
                portMappings: [ntgMlServiceListener],
                environment: [{ name: "GOOGLE_API_KEY", value: "AIzaSyC2VHa0suGl7o0pG6-xpIZpbFv2fadBsEY" }],
                healthCheck: {
                    command: [
                        "CMD-SHELL",
                        "curl --fail http://localhost:5000/ || exit 1",
                    ],
                    startPeriod: 30,
                    retries: 10,
                },
            },
            apiGateway: {
                image: apiGatewayImage,
                portMappings: [apolloGatewayListener],
                dependsOn: [
                    {
                        containerName: "routeService",
                        condition: "HEALTHY",
                    },
                    {
                        containerName: "mlService",
                        condition: "HEALTHY",
                    }
                ],
                healthCheck: {
                    command: [
                        "CMD-SHELL",
                        "curl --fail http://localhost:4000/.well-known/apollo/server-health/ || exit 1",
                    ],
                    retries: 10,
                },
            },
        },
    },
    desiredCount: 1,
});

// Step 7: Export the Internet address for the service.
export const url = apolloGatewayListener.endpoint.hostname;
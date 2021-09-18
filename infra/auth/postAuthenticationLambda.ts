import * as aws from "@pulumi/aws";

import { PostAuthenticationTriggerEvent } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cup = new CognitoIdentityServiceProvider();

export const role = new aws.iam.Role("post-authentication-lambda", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "",
                Effect: "Allow",
                Principal: {
                    Service: "lambda.amazonaws.com"
                },
                Action: "sts:AssumeRole",
            }
        ]
    }),
})

export const attachAWSLambdaBasicExecutionRole = new aws.iam.RolePolicyAttachment("attach-basic-execution-role", {
    role: role.name,
    policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

const lambda = new aws.lambda.CallbackFunction<PostAuthenticationTriggerEvent, PostAuthenticationTriggerEvent>(`cognito-post-authentication`, {
    callback: async (event) => {
        if (event.request.userAttributes.email_verified !== 'true') {
            const params: CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest = {
                UserPoolId: event.userPoolId,
                UserAttributes: [{
                    Name: 'email_verified',
                    Value: 'true',
                }],
                Username: event.userName!,
            };
            await cup.adminUpdateUserAttributes(params).promise();
        }
        return event;
    },
    role: role,
})

export default lambda;
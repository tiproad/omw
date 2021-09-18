import * as aws from "@pulumi/aws";
import { PreSignUpTriggerEvent } from 'aws-lambda';

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

export const policy = new aws.iam.Policy("allow-sns", {
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Action: "sns:Publish",
                Effect: "Allow",
                Resource: "*",
            }
        ]
    }),
})


export const attachAWSLambdaBasicExecutionRole = new aws.iam.RolePolicyAttachment("attach-basic-execution-role", {
    role: role.name,
    policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

export const attachSNSPublishPolicy = new aws.iam.RolePolicyAttachment("attach-sns-publish-policy", {
    role: role.name,
    policyArn: policy.arn,
});

const lambda = new aws.lambda.CallbackFunction<PreSignUpTriggerEvent, PreSignUpTriggerEvent>(`cognito-pre-sign-up`, {
    callback: async (event) => {
        event.response.autoConfirmUser = true;
        return event;
    },
    role: role,
})

export const attachPolicy = new aws.iam.PolicyAttachment("attach-pre-sign-up", {
    policyArn: policy.arn,

})

export default lambda
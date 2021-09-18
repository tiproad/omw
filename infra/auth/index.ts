// Cognito passwordless auth inspired by https://github.com/aws-samples/amazon-cognito-passwordless-email-auth/blob/master/cognito/template.yaml

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import createAuthChallengeLambda from "./createAuthChallengeLambda"
import defineAuthChallengeLambda from "./defineAuthChallengeLambda"
// import preSignUpLambda from "./preSignUpLambda"
import verifyAuthChallengeResponseLambda from "./verifyAuthChallengeResponseLambda"
import postAuthenticationLambda, { role as postAuthenticationRole } from "./postAuthenticationLambda"

export const snsRole = new aws.iam.Role("cognito-sns-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "",
                Effect: "Allow",
                Principal: {
                    Service: "cognito-idp.amazonaws.com"
                },
                Action: "sts:AssumeRole",
                Condition: {
                    StringEquals: {
                        "sts:ExternalId": "htn2021/cognito"
                    }
                }
            }
        ]
    })
});

export const snsRolePolicy = new aws.iam.RolePolicy("cognito-sns-role-policy", {
    role: snsRole.id,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "sns:publish"
                ],
                Resource: [
                    "*"
                ]
            }
        ]
    })
})

export const userPool = new aws.cognito.UserPool("htn2021", {
    usernameAttributes: ["phone_number"],
    usernameConfiguration: {
        caseSensitive: true
    },
    schemas: ["family_name", "given_name", "phone_number"].map(x => ({
        attributeDataType: "String",
        name: x,
        required: true
    })),
    passwordPolicy: {
        minimumLength: 8,
        requireSymbols: false,
        requireNumbers: false,
        requireLowercase: false,
        requireUppercase: false,
    },
    adminCreateUserConfig: {
        allowAdminCreateUserOnly: false
    },
    mfaConfiguration: "OFF",
    autoVerifiedAttributes: ["phone_number"],
    smsVerificationMessage: "Your HTN 2021 verification code is {####}",
    smsConfiguration: {
        externalId: "htn2021/cognito",
        snsCallerArn: snsRole.arn
    },
    lambdaConfig: {
        createAuthChallenge: createAuthChallengeLambda.arn,
        defineAuthChallenge: defineAuthChallengeLambda.arn,
        // preSignUp: preSignUpLambda.arn,
        verifyAuthChallengeResponse: verifyAuthChallengeResponseLambda.arn,
        postAuthentication: postAuthenticationLambda.arn,
    }
});


export const userAttributesPolicy = new aws.iam.Policy("allow-set-user-attributes", {
    policy: userPool.arn.apply(arn => JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Action: "cognito-idp:AdminUpdateUserAttributes",
                Effect: "Allow",
                Resource: `${arn}`,
            }
        ]
    })),
})

export const attachUserAttributesPolicy = new aws.iam.RolePolicyAttachment("attach-user-attributes-policy", {
    role: postAuthenticationRole.name,
    policyArn: userAttributesPolicy.arn,
});

export const allowCreateAuthChallengeLambda = new aws.lambda.Permission("AllowCreateAuthChallengeLambda", {
    action: "lambda:InvokeFunction",
    function: createAuthChallengeLambda.name,
    principal: "cognito-idp.amazonaws.com",
    sourceArn: userPool.arn,
});

export const allowDefineAuthChallengeLambda = new aws.lambda.Permission("AllowDefineAuthChallengeLambda", {
    action: "lambda:InvokeFunction",
    function: defineAuthChallengeLambda.name,
    principal: "cognito-idp.amazonaws.com",
    sourceArn: userPool.arn,
});

// export const allowPreSignUpLambda = new aws.lambda.Permission("AllowPreSignUpLambda", {
//     action: "lambda:InvokeFunction",
//     function: preSignUpLambda.name,
//     principal: "cognito-idp.amazonaws.com",
//     sourceArn: userPool.arn,
// });

export const allowVerifyAuthChallengeResponseLambda = new aws.lambda.Permission("AllowVerifyAuthChallengeResponseLambda", {
    action: "lambda:InvokeFunction",
    function: verifyAuthChallengeResponseLambda.name,
    principal: "cognito-idp.amazonaws.com",
    sourceArn: userPool.arn,
});

export const allowPostAuthenticationLambda = new aws.lambda.Permission("AllowPostAuthenticationLambda", {
    action: "lambda:InvokeFunction",
    function: postAuthenticationLambda.name,
    principal: "cognito-idp.amazonaws.com",
    sourceArn: userPool.arn,
});

export const cognitoAppClient = new aws.cognito.UserPoolClient("htn2021-client", {
    userPoolId: userPool.id,
    explicitAuthFlows: ["CUSTOM_AUTH_FLOW_ONLY"],
    supportedIdentityProviders: ["COGNITO"],
    generateSecret: false,
});

export const cognitoDomain = new aws.cognito.UserPoolDomain("htn2021-domain", {
    domain: pulumi.interpolate`htn2021-${pulumi.getStack()}`,
    userPoolId: userPool.id
})
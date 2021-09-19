import * as aws from "@pulumi/aws";

import { VerifyAuthChallengeResponseTriggerEvent } from 'aws-lambda';

const lambda = new aws.lambda.CallbackFunction<VerifyAuthChallengeResponseTriggerEvent, VerifyAuthChallengeResponseTriggerEvent>(`cognito-verify-auth-challenge-response`, {
    callback: async (event) => {
        const expectedAnswer = event.request.privateChallengeParameters!.secretLoginCode;
        if (event.request.challengeAnswer === expectedAnswer) {
            event.response.answerCorrect = true;
        } else {
            event.response.answerCorrect = false;
        }
        return event;
    }
})

export default lambda
import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
// import EmailVerification from "supertokens-node/recipe/emailverification";
import { config } from "@configs";
import { UsersService } from "@services";
import { BadRequest } from "@tsed/exceptions";

const SUPERTOKENS_ENDPOINT: string = config.envs.SUPERTOKENS_ENDPOINT;
const BACKEND_ENDPOINT: string = config.envs.BACKEND_ENDPOINT;
const APP_ENDPOINT: string = config.envs.APP_ENDPOINT;
const UsersServiceInstance = new UsersService();

SuperTokens.init({
    framework: "express",
    supertokens: {
        // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
        connectionURI: SUPERTOKENS_ENDPOINT,
        apiKey: "d3v1n3ng1n33r"
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/session/appinfo
        appName: "ConcreteAI",
        apiDomain: BACKEND_ENDPOINT,
        websiteDomain: APP_ENDPOINT,
        apiBasePath: "/auth",
        websiteBasePath: "/auth"
    },
    recipeList: [
        EmailPassword.init({
            signUpFeature: {
                formFields: [
                    {
                        id: "firstname",
                        optional: true
                    },
                    {
                        id: "lastname",
                        optional: true
                    }
                ]
            },
            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signInPOST: async function (input) {
                            if (originalImplementation.signInPOST === undefined) {
                                throw Error("Should never come here");
                            }

                            // First we call the original implementation
                            const response = await originalImplementation.signInPOST(input);

                            // Then we check if it was successfully completed
                            if (response.status === "OK") {
                                const user = await UsersServiceInstance.getUserInfo(
                                    response.user.id
                                );
                                response.user = {
                                    ...response.user,
                                    ...{
                                        firstName: user.firstName,
                                        lastName: user.lastName
                                    }
                                };
                            }
                            return response;
                        },
                        passwordResetPOST: async function (input) {
                            if (originalImplementation.passwordResetPOST === undefined) {
                                throw Error("Should never come here");
                            }

                            // First we call the original implementation
                            const response = await originalImplementation.passwordResetPOST(input);

                            // Then we check if it was successfully completed
                            if (response.status === "OK") {
                                // TODO: post password reset logic
                            }
                            return response;
                        },
                        signUpPOST: async function (input) {
                            if (originalImplementation.signUpPOST === undefined) {
                                throw Error("Should never come here");
                            }

                            // These are the input form fields values that the user used while signing up
                            const formFields = input.formFields;
                            const firstName = formFields.find((v) => v.id === "firstname")?.value;
                            const lastName = formFields.find((v) => v.id === "lastname")?.value;

                            if (!firstName || !lastName) {
                                throw new BadRequest("Missing user's firstname or lastname !");
                            }

                            // First we call the original implementation of signUpPOST.
                            const response = await originalImplementation.signUpPOST(input);

                            // Post sign up response, we check if it was successful
                            if (response.status === "OK") {
                                await UsersServiceInstance.createUser(
                                    response.user.id,
                                    firstName,
                                    lastName,
                                    response.user.email
                                );
                            }
                            return response;
                        }
                    };
                }
            }
        }), // initializes signin / sign up features

        Session.init() // initializes session features
    ]
});

export const supertokens = SuperTokens;

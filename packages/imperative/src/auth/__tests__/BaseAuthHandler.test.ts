/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { IHandlerParameters } from "../../../../cmd";
import { Imperative } from "../../Imperative";
import { ImperativeConfig } from "../../../..";
import { FakeAuthHandler } from "./__data__/FakeAuthHandler";

describe("BaseAuthHandler", () => {
    beforeAll(() => {
        Object.defineProperty(Imperative, "api", {
            get: () => ({
                profileManager: (profType: string) => ({
                    save: jest.fn(),
                    update: jest.fn()
                })
            })
        });
        Object.defineProperty(ImperativeConfig, "instance", {
            get: () => ({
                config: { exists: false }
            })
        });
    });

    it("should process login successfully", async () => {
        const handler = new FakeAuthHandler();
        const params: IHandlerParameters = {
            response: {
                console: {
                    log: jest.fn()
                }
            },
            arguments: {
                user: "fakeUser",
                password: "fakePass"
            },
            positionals: ["auth", "login"],
            profiles: {
                getMeta: jest.fn(() => ({
                    name: "fakeName"
                }))
            }
        } as any;

        const doLoginSpy = jest.spyOn(handler as any, "doLogin");
        let caughtError;

        try {
            await handler.process(params);
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).toBeUndefined();
        expect(doLoginSpy).toBeCalledTimes(1);
    });

    it("should process logout successfully", async () => {
        const handler = new FakeAuthHandler();
        const params: IHandlerParameters = {
            response: {
                console: {
                    log: jest.fn()
                }
            },
            arguments: {
                host: "fakeHost",
                port: "fakePort",
                tokenType: handler.mDefaultTokenType,
                tokenValue: "fakeToken"
            },
            positionals: ["auth", "logout"],
            profiles: {
                getMeta: jest.fn(() => ({
                    name: "fakeName"
                }))
            }
        } as any;

        const doLogoutSpy = jest.spyOn(handler as any, "doLogout");
        let caughtError;

        try {
            await handler.process(params);
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).toBeUndefined();
        expect(doLogoutSpy).toBeCalledTimes(1);
    });

    it("should fail to process invalid action name", async () => {
        const handler = new FakeAuthHandler();
        const params: IHandlerParameters = {
            response: {
                console: {
                    log: jest.fn()
                }
            },
            arguments: {},
            positionals: ["auth", "invalid"],
            profiles: {
                getMeta: jest.fn(() => ({
                    name: "fakeName"
                }))
            }
        } as any;

        let caughtError;

        try {
            await handler.process(params);
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).toBeDefined();
        expect(caughtError.message).toContain(`The group name "invalid"`);
        expect(caughtError.message).toContain("is not valid");
    });

    it("should fail to login with invalid token value", async () => {
        const handler = new FakeAuthHandler();
        const params: IHandlerParameters = {
            response: {
                console: {
                    log: jest.fn()
                }
            },
            arguments: {
                user: "fakeUser",
                password: "fakePass"
            },
            positionals: ["auth", "login"],
            profiles: {
                getMeta: jest.fn(() => ({
                    name: "fakeName"
                }))
            }
        } as any;

        const doLoginSpy = jest.spyOn(handler as any, "doLogin").mockResolvedValue(null);
        let caughtError;

        try {
            await handler.process(params);
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).toBeDefined();
        expect(caughtError.message).toContain("token value");
        expect(doLoginSpy).toBeCalledTimes(1);
    });
});

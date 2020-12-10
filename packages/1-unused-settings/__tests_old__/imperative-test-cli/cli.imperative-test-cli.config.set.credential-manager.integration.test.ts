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

import { ITestEnvironment } from "../../../../__tests__/__src__/environment/doc/response/ITestEnvironment";
import { SetupTestEnvironment } from "../../../../__tests__/__src__/environment/SetupTestEnvironment";
import { runCliScript } from "../../../../__tests__/src/TestUtil";
import * as fs from "fs";

const TEST_CREDENTIAL_MANAGER: string = "@test/test-cm";
const IMP_SETTINGS_DIR = "/settings/";
const IMP_SETTINGS = IMP_SETTINGS_DIR + "imperative.json";

// Test Environment populated in the beforeAll();
let TEST_ENVIRONMENT: ITestEnvironment;

describe("imperative-test-cli config set credential-manager", () => {

    // Create the test environment
    beforeAll(async () => {
        TEST_ENVIRONMENT = await SetupTestEnvironment.createTestEnv({
            cliHomeEnvVar: "IMPERATIVE_TEST_CLI_CLI_HOME",
            testName: "imperative_test_cli_test_config_set_credential_manager_command"
        });
    });

    it("should override the default credential manager", () => {
        const response = runCliScript(__dirname + "/__scripts__/set_credential_manager.sh",
            TEST_ENVIRONMENT.workingDir, [TEST_CREDENTIAL_MANAGER]);
        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);

        const settings = fs.readFileSync(TEST_ENVIRONMENT.workingDir + IMP_SETTINGS).toString();
        expect(settings).toContain(`"CredentialManager": "${TEST_CREDENTIAL_MANAGER}"`);
    });
});

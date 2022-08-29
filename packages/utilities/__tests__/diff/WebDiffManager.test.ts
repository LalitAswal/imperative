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

import * as  fs from 'fs';
import * as path from 'path';

import { WebDiffManager } from "../../src/diff/WebDiffManager";
import * as diff2html from "diff2html";
import { ImperativeConfig } from "../../src/ImperativeConfig";
import WebDiffGenerator from "../../src/diff/WebDiffGenerator";
import { IImperativeConfig } from '../../../imperative';
import { Imperative } from '../../../imperative/src/Imperative';
import { ProcessUtils, GuiResult } from '../../src/ProcessUtils';

describe("WebDiffManager", () => {

    describe("openDiffs", () => {
        const fakePatchDiff = "test";
        const cliHome: string = "packages/__tests__/fakeCliHome";
        const webDiffDir: string = path.join(cliHome, 'web-diff');
        beforeAll(async () => {

            const configs: IImperativeConfig = {
                productDisplayName: "WebDiff Test",
                defaultHome: cliHome,
                rootCommandDescription: "Some Product CLI"

            };

            Object.defineProperty(process, "mainModule", {
                configurable: true,
                get: jest.fn(() => {
                    return {
                        filename: "fakeCliCmd"
                    };
                })
            });

            Object.defineProperty(ImperativeConfig.instance, "cliHome", {
                configurable: true,
                get: jest.fn(() => {
                    return cliHome;
                })
            });

            // imperative.init does all the setup for WebHelp to be run
            await Imperative.init(configs);
        });
        afterAll(()=>{
            // removing test dir generated by the test
            const rimraf = require('rimraf');
            rimraf.sync('packages/__tests__');
        });
        it("should open the diffs in browser when GUI is available", async () => {
            ProcessUtils.isGuiAvailable = jest.fn(() => GuiResult.GUI_AVAILABLE);
            const generator = new WebDiffGenerator(ImperativeConfig.instance, webDiffDir);
            generator.buildDiffDir = jest.fn();
            jest.spyOn(ProcessUtils, "openInDefaultApp").mockImplementation(jest.fn());
            const htmlSpy = jest.spyOn(diff2html, "html").mockImplementation(jest.fn(() => {
                return "test html string";
            }));
            await WebDiffManager.instance.openDiffs(fakePatchDiff);

            if (!fs.existsSync(webDiffDir)) {
                expect(generator.buildDiffDir).toHaveBeenCalledTimes(1);
            }
            expect(ProcessUtils.isGuiAvailable).toHaveBeenCalledTimes(1);
            expect(ProcessUtils.isGuiAvailable).toHaveReturnedWith(GuiResult.GUI_AVAILABLE);
            expect(htmlSpy).toHaveBeenCalledTimes(1);
            if (htmlSpy != null) {
                expect(ProcessUtils.openInDefaultApp).toHaveBeenCalledTimes(1);
            }
        });
    });

});

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

import { IDaemonRequest } from "./doc/IDaemonRequest";

/**
 * Class do handle building a daemon request
 * @export
 * @class DaemonRequest
 */
export class DaemonRequest {

    constructor(private request: IDaemonRequest) {
        this.request = request;
    }

    /**
     * Create daemon request from input options
     * @static
     * @param {IDaemonRequest} request
     * @returns {string}
     * @memberof DaemonRequest
     */
    public static create(request: IDaemonRequest): string {
        if (request.stdout && Buffer.isBuffer(request.stdout)) request.stdout = request.stdout.toString();
        if (request.stderr && Buffer.isBuffer(request.stderr)) request.stderr = request.stderr.toString();
        return new DaemonRequest(request).build();
    }


    /**
     * Stringify request and append form feed
     * @private
     * @returns {string}
     * @memberof DaemonRequest
     */
    private build(): string {
        return JSON.stringify(this.request) + "\f";
    }
}

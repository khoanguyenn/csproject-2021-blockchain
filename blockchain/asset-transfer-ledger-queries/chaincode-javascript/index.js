/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const CC = require('./lib/vaccine_chaincode_v2');

module.exports.CC = CC;
module.exports.contracts = [ CC ];

/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// const CC = require('./lib/asset_transfer_ledger_chaincode.js');
// const CC = require('./lib/provider_chaincode.js')
const CC = require('./lib/vaccine_chaincode.js')

module.exports.CC = CC;
module.exports.contracts = [ CC ];

// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: 'AccountId',
  LookupSource: 'AccountId',
  AppID: '[u8; 20]',
  Message: {
    payload: 'Vec<u8>',
    verification: 'VerificationInput'
  },
  VerificationInput: {
    _enum: {
      Basic: 'VerificationBasic',
      None: null
    }
  },
  VerificationBasic: {
    block_number: 'u64',
    event_index: 'u32'
  },
  TokenId: 'H160',
  AssetId: 'H160'
};

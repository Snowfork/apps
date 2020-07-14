# @app-polkadot-ethereum-bridge

A simple application that supports the deposit of Ethereum and ERC20 tokens to a Bank contract.

## Setup

### Start the local substrate chain
```bash
# In Snowfork/polkadot-ethereum-bridge/parachain
./target/release/artemis-node --dev
```

### Start a local Ethereum chain
```bash
# In Snowfork/polkadot-ethereum-bridge/ethereum
truffle develop

# From another terminal window in the same directory
truffle compile

truffle migrate
```

Note: the Bank's deployed smart contract address is currently hardcoded to `0xC4cE93a5699c68241fc2fB503Fb0f21724A624BB` and the TestToken's address is hardcoded to `0x0e8049380b9A686629f0Ae60E7248ba2252d7eB8`. The migration command should deploy them to the same addresses, but if not you'll need to update the two addresses located on lines 16-17 of substate-ui/packages/app-polkadot-ethereum-ridge/src/Bank.tsx.

### Start substrate-ui

```bash
# In Snowfork/substrate-ui
yarn run start
```

### Connect chains

Once substrate-ui has started, point the browser to substrate's local http endpoint using the user interface. 

Using the metamask browser extension add a new development chain pointed at ethereum's local http endpoint (this value is logged by the `truffle develop` command) called 'dev'.

### Load truffle account into metamask

The `truffle develop` command logs a list of accounts and private keys when it's initialized. Copy the private key of address 0 and use it to import a new account to metamask. You should see an account on the 'dev' chain loaded with ~100 ethereum.

Note: you must use the private key of address 0 on the linked local ethereum network.

### Deposit ETH/ERC20

You're now able to deposit Ethereum into the deployed Bank contract using the @app-polkadot-ethereum-bridge user interface.

Your account is pre-loaded with thousands of TEST tokens. Once you've approved some tokens to the Bank contract, reload the page and you'll be able to deposit ERC20 tokens into the deployed Bank contract.

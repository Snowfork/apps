import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Web3 from 'web3';

import { Box } from "@material-ui/core";

// Local imports
import {TEST_TOKEN_CONTRACT_ADDRESS, APP_ETHEREUM_CONTRACT_ADDRESS, APP_ERC20_CONTRACT_ADDRESS } from "./config";
import AppEthereum from "./AppEthereum";
import AppERC20 from "./AppERC20";

/* tslint:disable */
// import * as BankContract from "./contracts/Bank.json";
import * as EthereumApp from "./contracts/EthereumApp.json";
import * as ERC20App from "./contracts/ERC20App.json";
import * as TestToken from "./contracts/TestToken.json";
/* tslint:enable */


// ------------------------------------------
//                  Props
// ------------------------------------------
type Props = {
  web3: Web3
}

// ------------------------------------------
//               Bank component
// ------------------------------------------
function Bridge({ web3 }: Props): React.ReactElement<Props> {

  // State
  const initialContract: any = null
  const [appEthereumContract, setAppEthereumContract] = useState(initialContract);
  const [appERC20Contract, setAppERC20Contract] = useState(initialContract);
  const [tokenContract, setTokenContract] = useState(initialContract);
  const [defaultAccount, setDefaultAccount] = useState(String);

  // Effects
  useEffect(() => {
    const fetchAccounts = async () => {
      const accs = await web3.eth.getAccounts();
      let defaultAcc = accs[0];
      web3.eth.defaultAccount = defaultAcc
      setDefaultAccount(defaultAcc);
    };

    fetchAccounts();
  }, []);

  // Fetch contracts
  useEffect(() => {
    const fetchAppEthereumContract = async () => {
      const appEthereumContractInstance = new web3.eth.Contract(EthereumApp.abi, APP_ETHEREUM_CONTRACT_ADDRESS);
      setAppEthereumContract(appEthereumContractInstance);
    };

    const fetchAppERC20Contract = async () => {
      const appERC20ContractInstance = new web3.eth.Contract(ERC20App.abi, APP_ERC20_CONTRACT_ADDRESS);
      setAppERC20Contract(appERC20ContractInstance);
    };

    const fetchTokenContract = async () => {
      const tokenContractInstance = new web3.eth.Contract(TestToken.abi, TEST_TOKEN_CONTRACT_ADDRESS);
      setTokenContract(tokenContractInstance);
    };

    fetchAppEthereumContract();
    fetchAppERC20Contract();
    fetchTokenContract();
  }, [web3]);

  // Render
  return (
    <Box>
      <AppEthereum web3={web3} contract={appEthereumContract} defaultAccount={defaultAccount}/>
      <AppERC20 web3={web3} contract={appERC20Contract} tokenContract={tokenContract} defaultAccount={defaultAccount}/>
    </Box>
  );
}

// export default React.memo(styled(Bridge)`
export default styled(Bridge)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`;

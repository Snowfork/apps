import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Web3 from 'web3';

import { Box } from "@material-ui/core";

// Local imports
import DepositETH from "./DepositETH";
import DepositERC20 from "./DepositERC20";

/* tslint:disable */
import * as BankContract from "./contracts/Bank.json";
import * as TestToken from "./contracts/TestToken.json";
/* tslint:enable */

const BankContractAddress = "0xC4cE93a5699c68241fc2fB503Fb0f21724A624BB";
const TestTokenContractAddress = "0x0e8049380b9A686629f0Ae60E7248ba2252d7eB8";

// ------------------------------------------
//                  Props
// ------------------------------------------
type Props = {
  web3: Web3
}

// ------------------------------------------
//               Bank component
// ------------------------------------------
function Bank({ web3 }: Props): React.ReactElement<Props> {

  // State
  const initialContract: any = null
  const [bankContract, setBankContract] = useState(initialContract);
  const [tokenContract, setTokenContract] = useState(initialContract);
  const [defaultAccount, setDefaultAccount] = useState(String);

  // Effects
  useEffect(() => {
    const fetchAccounts = async (web3: Web3) => {
      const accs = await web3.eth.getAccounts();
      let defaultAcc = accs[0];
      web3.eth.defaultAccount = defaultAcc
      setDefaultAccount(defaultAcc);
    };

    fetchAccounts(web3);
  }, []);

  // Fetch contracts
  useEffect(() => {
    const fetchBankContract = async (web3: Web3) => {
      const bankContractInstance = new web3.eth.Contract(BankContract.abi, BankContractAddress);
      setBankContract(bankContractInstance);
    };

    const fetchTokenContract = async (web3: Web3) => {
      const tokenContractInstance = new web3.eth.Contract(TestToken.abi, TestTokenContractAddress);
      setTokenContract(tokenContractInstance);
    };
 
    fetchBankContract(web3);
    fetchTokenContract(web3);
  }, [web3]);
  
  // Render
  return (
    <Box>
      <DepositETH web3={web3} bankContract={bankContract} defaultAccount={defaultAccount}/>
      <DepositERC20 web3={web3} bankContract={bankContract} tokenContract={tokenContract} defaultAccount={defaultAccount}/>
    </Box>
  );
}

export default React.memo(styled(Bank)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`);

// General
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Web3 from 'web3';

// External
import { Box, Typography, TextField, Button, Divider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

// Local
import * as ERC20 from "./contracts/ERC20.json";
import {REFRESH_INTERVAL_MILLISECONDS } from "./config";

// ------------------------------------------
//                  Props
// ------------------------------------------
type Props = {
  web3: Web3,
  contract: any,
  defaultAccount: string
}

type LoadERC20TokenProps = {
  web3: Web3,
  onContractInstance: any,
}

type ApproveAndSendProps = {
  defaultAccount: string,
  contract: any,
  contractERC20: any,
}

// ------------------------------------------
//                  Styles
// ------------------------------------------
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// ------------------------------------------
//           LoadERC20Token component
// ------------------------------------------
function LoadERC20Token({ web3, onContractInstance }: LoadERC20TokenProps): React.ReactElement<Props> {

  const [tokenAddress, setTokenAddress] = useState(String);

  // Fetch ERC20 token contract
  useEffect(() => {
    const fetchTokenContract = async () => {
      const tokenContractInstance = new web3.eth.Contract(ERC20.abi, tokenAddress);
      console.log(tokenContractInstance)
      onContractInstance(tokenContractInstance);
    };

    console.log("token address:", tokenAddress);

    // All valid contract addresses have 42 characters ('0x' + address)
    if(tokenAddress.length == 42) {
      fetchTokenContract()
    }
  }, [web3, tokenAddress]);

  // Render
  return (
    <Box>
      <Typography gutterBottom>
        What's the ERC20 token's contract address?
      </Typography>
      <TextField
          id="erc-input-token-address"
          variant="outlined"
          fullWidth={true}
          style={{ margin: 5 }}
          placeholder="0xbeddb07..."
          margin="normal"
          onChange={e => setTokenAddress(e.target.value)}
          InputProps={{
              value: tokenAddress
          }}
      />
    </Box>
  )
}

// ------------------------------------------
//           ApproveAndSendERC20 component
// ------------------------------------------
function ApproveAndSendERC20({ defaultAccount, contract, contractERC20 }: ApproveAndSendProps): React.ReactElement<Props> {

  // Blockchain state from blockchain
  const [allowance, setAllowance] = useState(Number);
  const [balance, setBalance] = useState(Number);

  // User input state
  const [approvalAmount, setApprovalAmount] = useState(Number);
  const [polkadotRecipient, setPolkadotRecipient] = useState(String);
  const [depositAmount, setDepositAmount] = useState(String);

  const fetchChainData = async () => {
    let appAllowance = await contractERC20.methods.allowance(defaultAccount, contract._address).call();
    setAllowance(Number(appAllowance));

    const userBalance = await contractERC20.methods.balanceOf(defaultAccount).call();
    setBalance(userBalance);
  }

  useEffect(() => {
    fetchChainData();
    setInterval(() => { fetchChainData() }, REFRESH_INTERVAL_MILLISECONDS);
  }, [REFRESH_INTERVAL_MILLISECONDS])

  // Handlers
  const handleApproveERC20 = async () => {
    // Approve ERC20 token to bank contract
    await contractERC20.methods.approve(contract._address, approvalAmount).send({
      from: defaultAccount
    });
  };

  const handleSendERC20 = async () => {
    const polkadotRecipientBytes = Buffer.from(polkadotRecipient, "hex");

    // Send ERC20 token to bank contract
    await contract.methods.sendERC20(polkadotRecipientBytes, contractERC20._address, depositAmount).send({
      from: defaultAccount,
      gas: 500000,
      value: 0
    });
  };

  // Render
  return (
    <Box>
      <Box marginTop={`15px`}/>
      <Divider />
      <Box marginTop={`15px`}/>
      <Typography variant="h5" gutterBottom>
          1. Approve
      </Typography>
      <Typography gutterBottom>
        How many ERC20 tokens would you like to approve to the ERC20 App?
      </Typography>
      <TextField
          id="erc-input-approval"
          variant="outlined"
          style={{ margin: 5 }}
          placeholder="20"
          margin="normal"
          onChange={e => setApprovalAmount(Number(e.target.value))}
          InputProps={{
              value: approvalAmount
          }}
      />
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <Box>
          <Typography>
            Current ERC20 token balance: {balance} TEST
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" height="100px" width="300px" paddingTop={2} paddingBottom={1}>
          <Button
              color="primary"
              variant="outlined"
              fullWidth={true}
              onClick={() => handleApproveERC20()}>
                  <Typography variant="button">
                      Approve
                  </Typography>
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box marginTop={`15px`}>
        <Typography variant="h5" gutterBottom>
            2. Send
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column">
      <Box padding={1}/>
        <Typography gutterBottom>
            What account would you like to fund on Polkadot?
        </Typography>
        <TextField
            id="erc-input-recipient"
            variant="outlined"
            style={{ margin: 5 }}
            placeholder={"38j4dG5GzsL1bw..."}
            margin="normal"
            onChange={e => setPolkadotRecipient(e.target.value)}
            InputProps={{
                value: polkadotRecipient
            }}
        />
      <Box padding={1}/>
        <Typography gutterBottom>
            How many ERC20 tokens would you like to deposit
        </Typography>
        <TextField
            id="erc-input-amount"
            variant="outlined"
            style={{ margin: 5 }}
            placeholder="20"
            margin="normal"
            onChange={e => setDepositAmount(e.target.value)}
            InputProps={{
                value: depositAmount
            }}
        />
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <Box>
          <Typography>
            Current ERC20 App allowance: {allowance} TEST
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" height="100px" width="300px" paddingTop={2} paddingBottom={1}>
          <Button
            color="primary"
            variant="outlined"
            fullWidth={true}
            disabled={allowance === 0}
            onClick={() => handleSendERC20()}>
              <Typography variant="button">
                Send
              </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
    </Box>
  )
}

// ------------------------------------------
//               AppERC20 component
// ------------------------------------------
function AppERC20({ web3, contract, defaultAccount }: Props): React.ReactElement<Props> {
  const classes = useStyles();

  // ERC20 token contract instance
  const initialContract: any = null
  const [tokenContract, setTokenContract] = useState(initialContract);

  // Render
  return (
    <Box className={classes.paper}>
      <Box>
        <Typography variant="h5" gutterBottom align="center">
            ERC20 App
        </Typography>
        <LoadERC20Token web3={web3} onContractInstance={(e: any) => setTokenContract(e)}/>
        { tokenContract &&
          <ApproveAndSendERC20 defaultAccount={defaultAccount} contract={contract} contractERC20={tokenContract}/>
        }
      </Box>
    </Box>
  );
}

export default styled(AppERC20)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`;

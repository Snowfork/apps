import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Web3 from 'web3';

import { Box, Typography, TextField, Button, Divider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

// ------------------------------------------
//                  Props
// ------------------------------------------
type Props = {
  web3: Web3,
  contract: any,
  tokenContract: any,
  defaultAccount: string
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
//               AppERC20 component
// ------------------------------------------
function AppERC20({ web3, contract, tokenContract, defaultAccount }: Props): React.ReactElement<Props> {
  const classes = useStyles();

  // State
  const [allowance, setAllowance] = useState(Number);
  const [approvalSent, setApprovalSent] = useState(Boolean)

  const [fetchBalance, setFetchBalance] = useState(Boolean);
  const [balance, setBalance] = useState(Number);

  const [approvalAmount, setApprovalAmount] = useState(Number);
  const [polkadotRecipient, setPolkadotRecipient] = useState(String);
  const [depositAmount, setDepositAmount] = useState(String);

  // Effects
  useEffect(() => {
    const execute = async () => {
      let allowance = await tokenContract.methods.allowance(defaultAccount, contract._address).call();
      setAllowance(Number(allowance));
    };

    if(tokenContract && defaultAccount && defaultAccount.length > 0) {
      execute()
    }
  }, [tokenContract, defaultAccount, approvalSent]);

  // Handlers
  const handleApproveERC20 = () => {
    const execute = async (tokenApprovalAmount: number) => {
      // Approve ERC20 token to bank contract
      await tokenContract.methods.approve(contract._address, tokenApprovalAmount).send({
        from: defaultAccount
      });

      // Wait a couple seconds, then refetch allowances
      await sleep(5000);
      setApprovalSent(true);
    };

    execute(approvalAmount);
  };

  const handleSendERC20 = () => {
    const execute = async (rawRecipient: string, amount: string) => {
      const recipientBytes = Buffer.from(rawRecipient, "hex");

      // Send ERC20 token to bank contract
      await contract.methods.sendERC20(recipientBytes, tokenContract._address, amount).send({
        from: defaultAccount,
        gas: 500000,
        value: 0
      });

      // Wait a couple seconds, then refetch balances
      await sleep(5000);
      getBalance();
    };

    execute(polkadotRecipient, depositAmount);
  };

  const getBalance = () => {
    const execute = async () => {
      const currBalance = await tokenContract.methods.balanceOf(defaultAccount.toString()).call();
      setBalance(currBalance);
    };

    execute();
  };

  // Sleep is a wait function
  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // // On load
  // if(!fetchBalance) {
  //   getBalance();
  //   setFetchBalance(true);
  // }

  // Render
  return (
    <Box className={classes.paper}>
      <Box>
        <Typography variant="h5" gutterBottom align="center">
            ERC20 App
        </Typography>
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
              Current ERC20 App allowance: {allowance} TEST
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
              Current balance: {balance} TEST
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
  );
}

export default styled(AppERC20)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`;

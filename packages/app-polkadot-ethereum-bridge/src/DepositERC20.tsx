import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Web3 from 'web3';

import { Box, Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

// ------------------------------------------
//                  Props
// ------------------------------------------
type Props = {
  web3: Web3,
  bankContract: any,
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
//               DepositERC20 component
// ------------------------------------------
function DepositERC20({ web3, bankContract, tokenContract, defaultAccount }: Props): React.ReactElement<Props> {
  const classes = useStyles();

  // State
  const [allowance, setAllowance] = useState(Number);
  const [approvalAmount, setApprovalAmount] = useState(Number);
  const [targetAppID, setTargetAppID] = useState(String);
  const [polkadotRecipient, setPolkadotRecipient] = useState(String);
  const [depositAmount, setDepositAmount] = useState(String);

  // Effects
  useEffect(() => {
    const execute = async () => {
      let allowance = await tokenContract.methods.allowance(defaultAccount, bankContract._address).call();
      setAllowance(Number(allowance));
    };

    if(tokenContract && defaultAccount.length > 0) {
      execute()
    } 
  }, [tokenContract, defaultAccount]);

  // Handlers
  const handleApproveERC20 = () => {
    const execute = async (tokenApprovalAmount: number) => {
      // Approve ERC20 token to bank contract
      return await tokenContract.methods.approve(bankContract._address, tokenApprovalAmount).send({
        from: defaultAccount
      });
    };
    execute(approvalAmount);
  };

  const handleSendERC20 = () => {
    const execute = async (rawTargetAppID: string, rawRecipient: string, amount: string) => {
      const recipientBytes = web3.utils.utf8ToHex(rawRecipient);
      const targetAppIDBytes = web3.utils.utf8ToHex(rawTargetAppID);
      // Send ERC20 token to bank contract
      return await bankContract.methods.sendERC20(targetAppIDBytes, recipientBytes, tokenContract._address, amount).send({
        from: defaultAccount,
        gas: 500000,
        value: 0
      });
    };
    
    execute(targetAppID, polkadotRecipient, depositAmount);
  };

  // Render
  return (
    <Box>
      {allowance === 0 ? 
      (<Box className={classes.paper}>
        <Typography variant="h5" gutterBottom>
            Approve ERC20
          </Typography>
          <Typography gutterBottom>
            How many ERC20 tokens would you like to approve to the Bank?
          </Typography>
          <TextField
              id="erc-input-approval"
              variant="outlined"
              style={{ margin: 5 }}
              placeholder="20 TEST"
              margin="normal"
              onChange={e => setApprovalAmount(Number(e.target.value))}
              InputProps={{
                  value: approvalAmount
              }}
          />
         <Box display="flex" alignItems="center" height="100px" width="300px" paddingTop={2} paddingBottom={1}>
            <Button
                color="primary"
                variant="outlined"
                fullWidth={true}
                onClick={() => handleApproveERC20()}>
                    <Typography variant="button">
                        Approve ERC20
                    </Typography>
            </Button>
          </Box>
        </Box>)
        :
        (<Box display="flex" flexDirection="column" className={classes.paper}>
          <Typography variant="h5" gutterBottom>
              Deposit ERC20
          </Typography>
          <Typography gutterBottom>
              Which application on Polkadot would you like this data delivered to?
          </Typography>
          <TextField
              id="erc-input-target"
              variant="outlined"
              style={{ margin: 5 }}
              placeholder={"my-application-id"}
              margin="normal"
              onChange={e => setTargetAppID(e.target.value)}
              InputProps={{
                  value: targetAppID
              }}
          />
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
              placeholder="20 TEST"
              margin="normal"
              onChange={e => setDepositAmount(e.target.value)}
              InputProps={{
                  value: depositAmount
              }}
          />
          <Box display="flex" alignItems="center" height="100px" width="300px" paddingTop={2} paddingBottom={1}>
              <Button
                  color="primary"
                  variant="outlined"
                  fullWidth={true}
                  onClick={() => handleSendERC20()}>
                      <Typography variant="button">
                          Send ERC20
                      </Typography>
              </Button>
          </Box>
        </Box>)
      }
    </Box>
  );
}

export default React.memo(styled(DepositERC20)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`);

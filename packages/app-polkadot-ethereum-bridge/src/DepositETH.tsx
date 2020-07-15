import React, {useState} from 'react';
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
//               DepositETH component
// ------------------------------------------
function DepositETH({ web3, bankContract, defaultAccount }: Props): React.ReactElement<Props> {
  const classes = useStyles();

  // State
  const [targetAppID, setTargetAppID] = useState(String);
  const [polkadotRecipient, setPolkadotRecipient] = useState(String);
  const [depositAmount, setDepositAmount] = useState(String);

  // Handlers
  const handleSendETH = () => {
    const execute = async (web3: Web3, rawTargetAppId: string, rawRecipient: string, amount: string) => {
      const recipientBytes = web3.utils.utf8ToHex(rawRecipient);
      const targetAppIDBytes = web3.utils.utf8ToHex(rawTargetAppId);
      // Send Ethereum to bank contract
      return await bankContract.methods.sendETH(targetAppIDBytes, recipientBytes).send({
        from: defaultAccount,
        gas: 500000,
        value: web3.utils.toWei(amount, "ether")
      });
    };

    execute(web3, targetAppID, polkadotRecipient, depositAmount);
  };

  // Render
  return (
    <Box>
      <Box display="flex" flexDirection="column" className={classes.paper}>
        <Typography variant="h5" gutterBottom>
            Deposit ETH
        </Typography>
        <Typography gutterBottom>
            Which application on Polkadot would you like this data delivered to?
        </Typography>
        <TextField
            id="eth-input-target"
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
            id="eth-input-recipient"
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
            How much ETH would you like to deposit
        </Typography>
        <TextField
            id="eth-input-amount"
            variant="outlined"
            style={{ margin: 5 }}
            placeholder="0.00 ETH"
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
                onClick={() => handleSendETH()}>
                  <Typography variant="button">
                      Send ETH
                  </Typography>
            </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(styled(DepositETH)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`);

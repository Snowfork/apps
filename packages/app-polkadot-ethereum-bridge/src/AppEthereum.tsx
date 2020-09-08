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
  contract: any,
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
//               AppEthereum component
// ------------------------------------------
function AppEthereum({ web3, contract, defaultAccount }: Props): React.ReactElement<Props> {
  const classes = useStyles();

  // State
  const [balance, setBalance] = useState(String);
  const [fetchBalance, setFetchBalance] = useState(Boolean);

  const [polkadotRecipient, setPolkadotRecipient] = useState(String);
  const [depositAmount, setDepositAmount] = useState(String);

  // Handlers
  const handleSendETH = () => {
    const execute = async (rawRecipient: string, amount: string) => {
      const recipientBytes = Buffer.from(rawRecipient, "hex");

      // Send Ethereum to bank contract
      await contract.methods.sendETH(recipientBytes).send({
        from: defaultAccount,
        gas: 500000,
        value: web3.utils.toWei(amount, "ether")
      });

      await sleep(5000);
      getBalance();
    };

    execute(polkadotRecipient, depositAmount);
  };

  const getBalance = () => {
    const execute = async () => {
      const currBalance = await web3.eth.getBalance(defaultAccount.toString());
      setBalance(web3.utils.fromWei(currBalance, "ether"));
    };

    execute();
  };

  // Sleep is a wait function
  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // On load
  if(!fetchBalance) {
    getBalance();
    setFetchBalance(true);
  }

  getBalance();

  // Render
  return (
    <Box>
      <Box display="flex" flexDirection="column" className={classes.paper}>
        <Typography variant="h5" gutterBottom>
            Ethereum App
        </Typography>
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
        <Box display="flex" justifyContent="space-around" alignItems="center">
        <Box>
          <Typography>
            Current balance: {balance} ETH
          </Typography>
         </Box>
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
    </Box>
  );
}

export default React.memo(styled(AppEthereum)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`);

// global app props
import { AppProps as Props } from '@polkadot/react-components/types';

// external imports
import React from 'react';
import Web3 from 'web3';

// local imports and components
import Bank from './Bank';

type MyWindow = (typeof window) & {
  ethereum: any;
  web3: Web3;
}

// TODO: checkout 80782242512401bbfd4e5ee671f6410f4d1beefe
function TemplateApp ({ className }: Props): React.ReactElement<Props> {

  const ethEnabled = () => {
    let locWindow = (window as MyWindow);
    if (locWindow.ethereum) {
      locWindow.web3 = new Web3(locWindow.ethereum);
      locWindow.ethereum.enable();
      return true;
    }
    return false;
  }

  if (!ethEnabled()) {
    alert("Please install MetaMask to use this application!");
    return(<div><p>Please install MetaMask to use this application!</p></div>)
  }

  return (
      <main className={className}>
        <Bank web3={(window as MyWindow).web3}/>        
      </main>
  );
}

export default React.memo(TemplateApp);

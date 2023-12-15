import React, { useCallback, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
// TypeScript
import CoinbaseWalletSDK, { CoinbaseWalletProvider } from '@coinbase/wallet-sdk'
import Web3 from 'web3'

window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {

  const [web3, setWeb3] = useState<Web3>()
  const [coinbase, setCoinbase] = useState<CoinbaseWalletSDK>()
  const [coinbaseProvider, setCoinbaseProvider] = useState<CoinbaseWalletProvider>()
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState<boolean>(false)
  const [account, setAccount] = useState<string>()

  const APP_NAME = 'Moonwell'
  const APP_LOGO_URL = 'https://moonwell.fi/moonwell.png'
  const DEFAULT_ETH_JSONRPC_URL = 'https://base.llamarpc.com'
  const DEFAULT_CHAIN_ID = 8453

  useEffect(() => {

    // Initialize Coinbase Wallet SDK
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
      darkMode: false,
      overrideIsCoinbaseBrowser: true,
      overrideIsCoinbaseWallet: true,
      overrideIsMetaMask: true,
      enableMobileWalletLink: true
    })

    // Initialize a Web3 Provider object
    const ethereum = coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID)

    // Initialize a Web3 object
    const web3 = new Web3(ethereum as any)

    setWeb3(web3);
    setCoinbase(coinbaseWallet)
    setCoinbaseProvider(ethereum);

  }, [])


  useEffect(() => {
    if (coinbaseProvider && window.ethereum && window.CBWSubscribe) {
      window.CBWSubscribe.createSubscriptionUI({
        // Address user will be subscribing to.
        partnerAddress: '0x60A0164463f3dC6c27e0AF42D1F64ab8BF225578',
        partnerName: 'Moonwell',
        modalTitle: '',
        modalBody: '',
        onSubscriptionChange: setIsSubscribed,
        onLoading: setIsLoadingSubscription,
      });
    }
  }, [coinbaseProvider, window]);

  const handleSubscribe = useCallback(() => {
    if (coinbaseProvider) {
      window.CBWSubscribe.toggleSubscription();
    }
  }, [coinbaseProvider]);

  const getAccounts = useCallback(() => {

    if (coinbaseProvider && coinbase && web3) {
      coinbaseProvider.request({ method: 'eth_requestAccounts' }).then(response => {
        const accounts: string[] = response as string[];
        console.log(`User's address is ${accounts[0]}`)
        setAccount(accounts[0])

        // Optionally, have the default account set for web3.js
        web3.eth.defaultAccount = accounts[0]
      })
    }

  }, [coinbaseProvider, coinbase, web3])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        {account ?
          <button onClick={() => {
            coinbase?.disconnect();
          }}>Connected with account: {account}</button>
          :
          <button onClick={() => {
            getAccounts();
          }}>Connect</button>

        }

        <button onClick={() => {
          handleSubscribe();
        }}>Subscribe</button>

      </header>
    </div>
  );
}

export default App;

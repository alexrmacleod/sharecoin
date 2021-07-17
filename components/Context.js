import React, { useEffect, useState, createContext, useContext } from "react";
import web3 from "../ethereum/web3";
import MetaMaskOnboarding from "@metamask/onboarding";

export const Context = createContext();

export const Provider = (props) => {
  const [account, setAccount] = useState("");
  const [value, setValue] = useState(""); // metamask value
  const [installed, setInstalled] = useState(false); // metamask connected
  const [connected, setConnected] = useState(false); // metamask connected
  const [onboarding, setOnboarding] = useState("");

  // let onboarding;
  // try {
  //   onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  // } catch (error) {
  //   console.error(error);
  // }

  useEffect(async () => {
    const currentUrl = new URL(window.location.href);
    const forwarderOrigin =
      currentUrl.hostname === "localhost" ? "http://localhost:9010" : undefined;

    // create a new MetaMask onboarding object to use in our app
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    setOnboarding(onboarding);

    const isMetaMaskInstalled = () => {
      // check the ethereum binding on the window object to see if it's installed
      const { ethereum } = window;
      return Boolean(ethereum && ethereum.isMetaMask);
    };

    let accounts;
    const isMetaMaskConnected = () => accounts && accounts.length > 0;

    const updateButtons = () => {
      const accountButtonsDisabled =
        !isMetaMaskInstalled() || !isMetaMaskConnected();

      if (accountButtonsDisabled) {
        setConnected(true);
      } else {
        setConnected(false);
      }

      if (!isMetaMaskInstalled()) {
        setValue("Install MetaMask");
        setConnected(false);
        setInstalled(false);
      } else if (isMetaMaskConnected()) {
        setValue("Connected");
        setConnected(true);
        setInstalled(true);

        if (onboarding) {
          onboarding.stopOnboarding();
        }
      } else {
        setValue("Connect");
        setConnected(false);
        setInstalled(true);
      }
    };

    async function handleNewAccounts(newAccounts) {
      accounts = newAccounts;
      setAccount(accounts[0]);
      updateButtons();
    }

    function handleNewChain(chainId) {
      console.log("chainId", chainId);
    }

    function handleNewNetwork(networkId) {
      console.log("networkId", networkId);
    }

    async function getNetworkAndChainId() {
      try {
        const chainId = await ethereum.request({
          method: "eth_chainId",
        });
        handleNewChain(chainId);

        const networkId = await ethereum.request({
          method: "net_version",
        });
        handleNewNetwork(networkId);
      } catch (err) {
        console.error(err);
      }
    }

    updateButtons();

    if (isMetaMaskInstalled()) {
      ethereum.autoRefreshOnNetworkChange = false;
      getNetworkAndChainId();

      ethereum.on("chainChanged", handleNewChain);
      ethereum.on("networkChanged", handleNewNetwork);
      ethereum.on("accountsChanged", handleNewAccounts);

      try {
        const newAccounts = await ethereum.request({
          method: "eth_accounts",
        });
        handleNewAccounts(newAccounts);
      } catch (error) {
        console.error("Error on init when getting accounts", error);
      }
    }

    // window.addEventListener("DOMContentLoaded", initialize);

    // // at load
    // const getAccounts = async () => {
    //   // get accounts
    //   const accounts = await web3.eth.getAccounts();
    //   setAccount(accounts[0]);
    //   // get balance
    //   const balance = await web3.eth.getBalance(accounts[0]);
    //   // console.log("balance1", balance);
    //   setBalance(balance);
    // };

    // const accountsChanged = () => {
    //   // on metamask account change
    //   window.ethereum.on("accountsChanged", async () => {
    //     // get accounts
    //     const accounts = await web3.eth.getAccounts();
    //     setAccount(accounts[0]);
    //     // get balance
    //     const balance = await web3.eth.getBalance(accounts[0]);
    //     setBalance(balance);
    //   });
    // };

    // only run once after mount as the deps array is empty
    // getAccounts();
  }, []);

  return (
    <Context.Provider
      value={{
        account,
        setAccount,
        value,
        setValue,
        installed,
        setInstalled,
        connected,
        setConnected,
        onboarding,
        setOnboarding,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

import React, { useContext, useState, useEffect } from "react";
import { Context } from "./Context";
import { Menu, Container, Button } from "semantic-ui-react";
import { Link } from "../routes";
import { setWeb3 } from "../ethereum/web3";

const Header = () => {
  const {
    account,
    setAccount,
    value,
    setValue,
    installed,
    setInstalled,
    connected,
    setConnected,
    onboarding,
  } = useContext(Context);

  // start the onboarding proccess
  const onClickInstall = async () => {
    // onboardButton.innerText = "Onboarding in progress";
    setValue("Onboarding in progress");
    // onboardButton.disabled = true;
    setConnected(true);
    // startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      setValue("Connecting...");
      // open the MetaMask UI
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setValue("Connected");
      // handleNewAccounts(newAccounts);
    } catch (error) {
      setValue("Connect");
      console.error(error);
    }
  };

  const onClick = async (event) => {
    event.preventDefault();
    if (installed) {
      onClickConnect();
    } else {
      onClickInstall();
    }
  };

  return (
    <Menu style={{ marginTop: "35px" }}>
      <Link route="/">
        <a className="item">
          <h3>Sharecoin</h3>
        </a>
      </Link>
      <Menu.Menu position="right">
        <Menu.Item disabled={connected} onClick={onClick}>
          <h3>{value}</h3>
        </Menu.Item>

        {/* <Link route="/">
          <a disabled={installed} className="item">
            <h3>{value}</h3>
          </a>
        </Link> */}
        <Link route="/coins/new">
          <Menu.Item icon="add" disabled={!connected} />
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;

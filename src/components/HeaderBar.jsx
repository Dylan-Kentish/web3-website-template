import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export function HeaderBar({ data }) {  
  const [account, setAccount] = useState(null);
  
  const onAccountChanged = async (acc) => {
    setAccount(acc);
  }
  
  const connectWallet = async () => {
    if(data !== null)
    {
      setAccount(await data.wallet());
    }
    else
    {
      alert("Get MetaMask!");
    }
  }

  useEffect(() => {
    if(data) {
      const act = async () => {
        onAccountChanged(await data.account());
      };  
      act();
    }    
  })
  
  useEffect(() => {    
    if(data)
    {
      data.events.subscribe(data.eventNames.AccountChanged, onAccountChanged);
      
      return function cleanup() {
        data.events.unsubscribe(data.eventNames.AccountChanged, onAccountChanged);      
      }
    }    
  }, []);
  
  return (
    <div key="topbar" class="flex w-full place-content-center bg-gray-100 shadow-lg">
      <div key="navbar" class="flex grow max-w-7xl">
        <div key="logo" class="flex grow place-content-start">
          <img src={logo} className="w-auto h-16 "/>
        </div>
        <div key="account" class="flex">
          {account === null && (
            <button key="connectWallet" class="bg-transparent hover:bg-blue-700 text-blue-700 font-semibold hover:text-white py-2 px-4 m-2 border border-blue-700 hover:border-transparent rounded" onClick={connectWallet}>
              Connect Wallet    
            </button>
          )}
          {account !== null && (
          <div key="walletInfo" class="flex flex-col justify-center">
            <button class="bg-transparent hover:bg-blue-700 text-blue-700 font-semibold hover:text-white py-2 px-4 m-2 border border-blue-700 hover:border-transparent rounded">Account</button>
          </div>)}
        </div>
      </div>   
    </div>   
  )
}

import React, { useEffect, useState } from "react";
import { AccountModal } from "./AccountModal";
import react from "../assets/react.svg";
import vite from "../assets/vite.svg";

export function HeaderBar({ data }) {  
  const [account, setAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
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

  const openModal = () => {
      setShowModal(true);
    };

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
    <div key="topbar" className="flex w-full place-content-center bg-gray-100 shadow-lg">
      <div key="navbar" className="flex grow max-w-7xl">
        <div key="logo" className="flex grow place-content-start">
          <img src={react} className="w-auto h-16 "/>
          <img src={vite} className="w-auto h-16 "/>
        </div>
        <div key="account" className="flex">
          {account === null && (
            <button key="connectWallet" className="bg-transparent hover:bg-blue-700 text-blue-700 font-semibold hover:text-white py-2 px-4 m-2 border border-blue-700 hover:border-transparent rounded" onClick={connectWallet}>
              Connect Wallet    
            </button>
          )}
          {account !== null && (
          <div key="walletInfo" className="flex flex-col justify-center">
            <button className="bg-transparent hover:bg-blue-700 text-blue-700 font-semibold hover:text-white py-2 px-4 m-2 border border-blue-700 hover:border-transparent rounded" onClick={openModal}>Account</button>
            {showModal ? <AccountModal setShowModal={setShowModal} data={data}/> : null}
          </div>)}
        </div>
      </div>   
    </div>   
  )
}

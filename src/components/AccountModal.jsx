import React, { useRef, useEffect, useState } from "react";
import ReactDom from "react-dom";

export const AccountModal = ({ setShowModal, data }) => {
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  // close the modal when clicking outside the modal.
  const modalRef = useRef();

  const onAccountChanged = async (acc) => {
    setAccount(acc);
  }

  const onBalanceChanged = async (bal) => {
    setBalance(round(bal, 4));
  }

  const round = (number, decimalPlaces) => {
    let ratio = 10 ** decimalPlaces;
    return Math.round(number * ratio) / ratio;
  }

  const closeModal = async (e) => {
    setShowModal(false);
  };

  useEffect(() => {
    if (data) {
      const act = async () => {
        setAddress(await data.address());
        onBalanceChanged(await data.balance());
      }
      act();
    }
  }, [account])

  useEffect(() => {
    if (data) {
      const act = async () => {
        await onAccountChanged(await data.account());
      };

      act();
    }
  }, []);

  useEffect(() => {
    if (data) {
      data.events.subscribe(data.eventNames.AccountChanged, onAccountChanged);
      data.events.subscribe(data.eventNames.BalanceChanged, onBalanceChanged);

      return function cleanup() {
        data.events.unsubscribe(data.eventNames.AccountChanged, onAccountChanged);
        data.events.unsubscribe(data.eventNames.BalanceChanged, onBalanceChanged);
      }
    }
  }, []);

  //render the modal JSX in the portal div.
  return ReactDom.createPortal(
    <div className="fixed z-10 inset-0 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen text-center md:block md:px-2 lg:px-4">
        <div className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" aria-hidden="true"></div>

        <span className="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">&#8203;</span>

        <div className="flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
          <div className="w-full relative flex flex-col w-full items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
            <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8" onClick={closeModal}>
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-extrabold text-gray-900">Account</h2>

            <div className="flex-grow self-stretch">
              <p>
                Address: {address}
              </p>
              <p>
                Balance: {balance} ETH
              </p>
            </div>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-transparent rounded" onClick={closeModal}>Done</button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};
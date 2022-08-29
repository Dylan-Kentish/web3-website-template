import { ethers } from "ethers";
import Events from "./Events";

export class Data {
  _acc = null;

  events = new Events();
  eventNames = {
    AccountChanged: "AccountChanged",
    BalanceChanged: "BalanceChanged",
  };

  constructor(ethereum) {
    if (!ethereum) {
      throw "ethereum is null - connect metamask wallet.";
    }

    this.ethereum = ethereum;

    this.provider = new ethers.providers.Web3Provider(ethereum);
    this.signer = this.provider.getSigner();
  }

  async wallet() {
    let acc = await this.account();

    if (acc !== null) {
      return acc;
    }

    let accounts = await ethereum.request({ method: "eth_requestAccounts" });

    if (accounts.length == 0) {
      return null;
    }

    this._acc = await this.account();
    this.events.publish(this.eventNames.AccountChanged, this._acc);

    return this._acc;
  }

  async account() {
    if (this._acc !== null) {
      return this._acc;
    }

    let accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      this._acc = accounts[0];
      this.events.publish(this.eventNames.AccountChanged, this._acc);

      return this._acc;
    }

    return null;
  }

  async address() {
    let acc = await this.account();

    if (acc === null) {
      return null;
    }

    return this.addressToShorthand(acc);
  }

  async balance() {
    let acc = await this.account();
    let balance = await this.provider.getBalance(acc);
    balance = ethers.utils.formatEther(balance);

    this.events.publish(this.eventNames.BalanceChanged, balance);
    return balance;
  }

  addressToShorthand(address) {
    return address.slice(0, 6) + "..." + address.substring(address.length - 4);
  }
}
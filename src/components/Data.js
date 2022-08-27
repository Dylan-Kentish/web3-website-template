import { ethers } from "ethers";
import Events from "./Events";
import Web3Modal from "web3modal";

export class Data {
    _acc = null;
    provider = null;
    events = new Events();
    eventNames = {
        AccountChanged: "AccountChanged",
        BalanceChanged: "BalanceChanged",
    };

    web3Modal = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false
      });

    async wallet() {
        let acc = await this.account();

        if (acc == null) {
            return null;
        }

        this.events.publish(this.eventNames.AccountChanged, this._acc);
        return acc;
    }

    async web3Provider() {
        if (this.provider !== null) {
            return this.provider
        }

        const instance = await this.web3Modal.connect();
        this.provider = new ethers.providers.Web3Provider(instance);

        return this.provider;
    }

    async account() {
        let provider = await this.web3Provider();

        if (provider === null) {
            return null;
        }

        if (this._acc !== null) {
            return this._acc;
        }

        let accounts = []; //await provider.getAccounts()

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

        if (acc == null) {
            return null;
        }

        let balance = await this.provider.getBalance(acc);
        balance = ethers.utils.formatEther(balance);

        this.events.publish(this.eventNames.BalanceChanged, balance);
        return balance;
    }

    async mineTransaction(txn) {
        console.log("Mining...", txn.hash);
        await txn.wait();
        console.log("Mined -- ", txn.hash);
    }

    addressToShorthand(address) {
        return address.slice(0, 6) + "..." + address.substring(address.length - 4);
    }
}
import { useEffect, useState } from "react";
import getWeb3  from '../helpers/getWeb3.js';
import SimpleStorageContract from "../contracts/SimpleCrabGame.json";
import SCG20Token from "../contracts/SCG20Token.json";

export const useInitWeb3 = () => {
  const [state, setState] = useState({web3: null, accounts: null, tokenContract: null, gameContract: null, currentAccountInfo : null});

  useEffect(() => {
    //const currentYear = new Date().getFullYear();
    const initWeb3 = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();

        // Token contract
        const deployedTokenNetwork = SCG20Token.networks[networkId];
        const instanceToken = new web3.eth.Contract(
          SCG20Token.abi,
          deployedTokenNetwork && deployedTokenNetwork.address,
        );

        // Game contract
        const deployedGameNetwork = SimpleStorageContract.networks[networkId];
        const instanceGame = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedGameNetwork && deployedGameNetwork.address,
        );

        setState({web3 : web3, accounts : accounts, tokenContract : instanceToken, gameContract : instanceGame, currentAccountInfo : accounts[0]});

      } catch (error) {
        alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };

    initWeb3();

  }, []);

  return [state, setState];
};

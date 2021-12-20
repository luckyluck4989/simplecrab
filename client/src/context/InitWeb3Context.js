import { createContext, useEffect, useState, useReducer } from "react";
import { getWeb3 } from "../helpers/Utility.js";
import SimpleStorageContract from "../contracts/SimpleCrabGame.json";
import SCG20Token from "../contracts/SCG20Token.json";

const initWeb3 = {web3: null, accounts: null, tokenContract: null, gameContract: null, currentAccountInfo : null, token : "", reGetToken : false};

export const InitWeb3Context = createContext();
 
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_all':
          return { ...state, web3: action.web3.web3, accounts: action.web3.accounts, tokenContract: action.web3.tokenContract, gameContract: action.web3.gameContract, currentAccountInfo : action.web3.currentAccountInfo, token : action.web3.token }
        case 'SET_account':
          return { ...state, accounts: action.web3.accounts, currentAccountInfo : action.web3.currentAccountInfo};
        case 'SET_token':
            return { ...state, token: action.web3.token};
        case 'SET_regettoken':
                return { ...state, reGetToken: action.web3.reGetToken};
        default:
          throw new Error(`Unhandled action ${action.type} in web3Reducer`);
      }
}

export default function InitWeb3ContextProvider({ children }) {
    const [web3State, web3InfoDispatch] = useReducer(reducer, initWeb3)
 
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
                const instanceToken = new web3.eth.Contract (
                    SCG20Token.abi,
                    deployedTokenNetwork && deployedTokenNetwork.address,
                );

                // Game contract
                const deployedGameNetwork = SimpleStorageContract.networks[networkId];
                const instanceGame = new web3.eth.Contract(
                    SimpleStorageContract.abi,
                    deployedGameNetwork && deployedGameNetwork.address,
                );

                //setState({web3 : web3, accounts : accounts, tokenContract : instanceToken, gameContract : instanceGame, currentAccountInfo : accounts[0], token : ""});
                web3InfoDispatch({ type: 'SET_all', web3: {web3 : web3, accounts : accounts, tokenContract : instanceToken, gameContract : instanceGame, currentAccountInfo : accounts[0], token : ""}})
            } catch (error) {
                alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        };

        if (!web3State.web3) {
            initWeb3();
        }

    }, []);

    // Get account token balance
    const loadTokenBalance = async () => {
        const response = await web3State.tokenContract.methods.balanceOf(web3State.currentAccountInfo).call();
        web3InfoDispatch({ type: 'SET_token', web3: {token : response}})
    };

    useEffect(() => {
        if (web3State.tokenContract && web3State.currentAccountInfo) {
            loadTokenBalance();
        }
        return () => {
            web3InfoDispatch({ type: 'SET_regettoken', web3: {reGetToken : false}})
        }
    }, [web3State.tokenContract, web3State.currentAccountInfo, web3State.reGetToken]);

    // Metamask change account
    window.ethereum.on ('accountsChanged', function (accountInfo) {
        web3InfoDispatch({ type: 'SET_account', web3: {accounts : accountInfo, currentAccountInfo : accountInfo[0]}})
    });

    return (
        <InitWeb3Context.Provider value={{web3Info : web3State, web3InfoDispatch}}>
            {children}
        </InitWeb3Context.Provider>
            
    ); 
};
    
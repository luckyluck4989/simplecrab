import { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { Button } from 'react-bootstrap';
import getWeb3  from '../helpers/getWeb3.js';

import SimpleStorageContract from "../contracts/SimpleCrabGame.json";
import SCG20Token from "../contracts/SCG20Token.json";
//import ERC20BasicContract from "./contracts/ERC20Basic.json";
//import OddEvenGameP1Contract from "./contracts/OddEvenGameP1.json";

// styles
import styles from "./Home.module.css";

import CrabList from "../components/crabs/CrabList";
import Spinner from "../components/ui/Spinner";

const Home = () => {
  let stateObj = {web3: null, accounts: null, tokenContract: null, gameContract: null};
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState(stateObj);

  /*const {
    data: allGames,
    isPending,
    error,
  } = useFetch(`${process.env.REACT_APP_API_URL}/games`);*/

  const {
    data : allCrabs,
    isPending,
    error,
  } = { 
      data : [
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 1,
          "thumbnail": "https://www.freetogame.com/g/1/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
         "_id": "61ab5e64940bd853957a35eb",
         "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
         "kind": '9',
          "crabId": 2,
          "thumbnail": "https://www.freetogame.com/g/2/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
         "_id": "61ab5e64940bd853957a35eb",
         "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
         "kind": '9',
          "crabId": 3,
          "thumbnail": "https://www.freetogame.com/g/3/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
         "_id": "61ab5e64940bd853957a35eb",
         "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
         "kind": '9',
          "crabId": 4,
          "thumbnail": "https://www.freetogame.com/g/4/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 5,
          "thumbnail": "https://www.freetogame.com/g/5/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 6,
          "thumbnail": "https://www.freetogame.com/g/6/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 7,
          "thumbnail": "https://www.freetogame.com/g/7/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 8,
          "thumbnail": "https://www.freetogame.com/g/8/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 9,
          "thumbnail": "https://www.freetogame.com/g/9/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 10,
          "thumbnail": "https://www.freetogame.com/g/10/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 11,
          "thumbnail": "https://www.freetogame.com/g/11/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 12,
          "thumbnail": "https://www.freetogame.com/g/12/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 13,
          "thumbnail": "https://www.freetogame.com/g/13/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 14,
          "thumbnail": "https://www.freetogame.com/g/14/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 15,
          "thumbnail": "https://www.freetogame.com/g/15/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 16,
          "thumbnail": "https://www.freetogame.com/g/16/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 17,
          "thumbnail": "https://www.freetogame.com/g/17/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
          "_id": "61ab5e64940bd853957a35eb",
          "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
          "kind": '9',
          "crabId": 18,
          "thumbnail": "https://www.freetogame.com/g/18/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
         "_id": "61ab5e64940bd853957a35eb",
         "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
         "kind": '9',
          "crabId": 19,
          "thumbnail": "https://www.freetogame.com/g/19/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      },
      {
         "_id": "61ab5e64940bd853957a35eb",
         "owner": "0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd",
         "kind": '9',
          "crabId": 20,
          "thumbnail": "https://www.freetogame.com/g/20/thumbnail.jpg",
          "strength": "100",
          "type": "100",
          "winBattle": "60%",
          "loseBattle": "40%"
      }
  ],
  isPending : false,
  error : null
  };

  //const debouncedSearchTerm = useDebounce(searchTerm, 500);

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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      var newState = {...state};
      newState.web3 = web3;
      newState.accounts = accounts;
      newState.tokenContract = instanceToken;
      newState.gameContract = instanceGame;
      setState(newState);

      // Set current account information
      //setCurrentAccountInfo(accounts[0]);

      // Call function storageValue
      //runExample(newState);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }
  const loadBlockchainData = async () => {
  }

  useEffect(() => {
    /*if (debouncedSearchTerm && allGames) {
      setFilteredGames(
        allGames.filter((game) =>
          game.crabId.includes(debouncedSearchTerm.toLowerCase())
        )
      );
    }*/
    initWeb3();
  },[]);
  //}, [debouncedSearchTerm, allGames]);

  	// Host creat new game
	const mintCrab = (event) => {
		event.preventDefault();
		//loadingHandler(event.target.id, true);

		// Update game info state
		//var newGameListCreated = [...gameListCreated];
		//var newGameItem = {gameID : "0x00", nonce : getNonce()};

		// Solidity hash host selection
		//let txhash;
	//	let hashHostSelection = state.web3.utils.soliditySha3(gameInfo.hostInput, newGameItem.nonce);

		// Send transaction
		state.tokenContract.methods.approve(
			state.gameContract._address,
			1,
		).send({ from : state.accounts[0] })
		.then(function(result) {
			// Send transaction
			state.gameContract.methods.mintCrab().send({ from : state.accounts[0] })
			.then(function(result) {
				/*txhash = result.transactionHash;
				newGameItem.gameID = result.events.StartGame.returnValues._gameID;
				newGameListCreated.push(newGameItem);
				setGameListCreated(newGameListCreated);
				
				// Save nonce to local storage
				localStorage.setItem(newGameItem.gameID, newGameItem.nonce);

				// Wait for transaction confirm
				waitForReceipt(txhash, function () {
					// Hide waiting and load token
					loadingHandler(event.target.id, false);
					loadTokenBalance();
				});*/
        console.log(result);
			}).catch(function(err) {
				console.log(err.message);
			});

		}).catch(function(err) {
			console.log(err.message);
		});
	}

  return (
    <>
        <Button
          className={styles.button_battle}
          variant="info" type="submit"
          onClick={mintCrab}
        >
          {
           "Mint Crab"
          }
        </Button>
      <section className={styles.games_content}>
        {isPending && <Spinner />}
        {error && <p>{error}</p>}
        {allCrabs && (
          <CrabList items={allCrabs} />
        )}
      </section>
    </>
  );
};

export default Home;

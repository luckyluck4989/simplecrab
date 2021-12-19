import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillWindows, AiFillHeart } from "react-icons/ai";
import { GoBrowser } from "react-icons/go";
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPastafarianism } from '@fortawesome/free-solid-svg-icons'
// styles
import styles from "./CrabItem.module.css";

import { useInitWeb3 } from "../../hooks/useInitWeb3";


const CrabItem = ({ item: crab, pageUse, battleInfo }) => {
  	const [state, setState] = useInitWeb3();
	const [token, setToken] = useState("");

	// Create new battle
	const putCrabToBattle = (event) => {
		event.preventDefault();

		// Send transaction
		state.tokenContract.methods.approve(
			state.gameContract._address,
			state.web3.utils.toWei(state.web3.utils.toBN(token).toString()),
		).send({ from : state.accounts[0] })
		.then(function(result) {
			// startBattle(uint256 _p1CrabID, uint256 _battleAmount)
			state.gameContract.methods.startBattle(crab.crabID, token).send({ from : state.accounts[0] })
			.then(function(result) {
				console.log(result);
				//fetchData();
			}).catch(function(err) {
				console.log(err.message);
			});
		}).catch(function(err) {
				console.log(err.message);
		});
	};

	// accept battle
	const acceptBattle = (event) => {
		event.preventDefault();

		console.log(battleInfo.battleAmount);
		console.log(crab.crabID);
		console.log(battleInfo.battleID);
		console.log(state.accounts[0]);

		// Send transaction
		state.tokenContract.methods.approve(
			state.gameContract._address,
			state.web3.utils.toWei(state.web3.utils.toBN(battleInfo.battleAmount).toString()),
		).send({ from : state.accounts[0] })
		.then(function(result) {
			// acceptBattle(uint256 _p2CrabID, uint256 _battleID)
			state.gameContract.methods.acceptBattle(crab.crabID, battleInfo.battleID).send({ from : state.accounts[0] })
			.then(function(result) {
				console.log(result);
				//fetchData();
			}).catch(function(err) {
				console.log(err.message);
			});
		}).catch(function(err) {
				console.log(err.message);
		});
	};
	// Input token handler
	const tokenInputHandler = (event) => {
		// need check balance of token here
		setToken(event.target.value)
		//console.log(token);
	}

	return (
		<div className={styles.card}>
			<div className={styles.card_header}>
			<span><FontAwesomeIcon icon={faPastafarianism}/>{crab.crabID}</span>
			</div>
			<div className={styles.card_body}>
			<Link to={`/crabs/${crab.crabID}`}>
				<div className={styles.divthumbnail}>
				<img className={styles.thumbnail} src={`/crab/${crab.kind}.png`} alt="test" />
				</div>
			</Link>
			<div className={styles.card_info}>
				<span>Strength : {crab.strength} | Win : {crab.win} | Lose : {crab.lose}</span>
			</div>
			</div>
			<div className={styles.card_footer}>
				{pageUse != "battle" && (<Form.Control placeholder="SCG" className={styles.token} value={token} onChange={tokenInputHandler}/>)}
				{pageUse != "battle" && (<Button
					className={styles.button_battle}
					variant="info" type="submit"
					disabled={token == "" || crab.state == "1"}
					//onClick={() => addToFavorite(game)}
					onClick={putCrabToBattle}
				>
					Put Crab To Battle
				</Button>
				)}
				{pageUse == "battle" && (<Button
					className={styles.button_battle_detail}
					variant="info" type="submit"
					//onClick={() => addToFavorite(game)}
					onClick={acceptBattle}
				>
					Accept Battle
				</Button>
				)}
			</div>
		</div>
	);
};

export default CrabItem;

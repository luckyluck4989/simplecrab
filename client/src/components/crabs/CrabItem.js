import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPastafarianism } from '@fortawesome/free-solid-svg-icons'
import { InitWeb3Context }  from "../../context/InitWeb3Context"

// styles
import styles from "./CrabItem.module.css";

const CrabItem = ({ item: crab, pageUse, battleInfo, fetchData }) => {
	const { web3Info, web3InfoDispatch } = useContext(InitWeb3Context);
	const [token, setToken] = useState("");

	// Create new battle
	const putCrabToBattle = (event) => {
		event.preventDefault();

		// Send transaction
		web3Info.tokenContract.methods.approve(
			web3Info.gameContract._address,
			web3Info.web3.utils.toWei(web3Info.web3.utils.toBN(token).toString()),
		).send({ from : web3Info.accounts[0] })
		.then(function(result) {
			// startBattle(uint256 _p1CrabID, uint256 _battleAmount)
			web3Info.gameContract.methods.startBattle(crab.crabID, token).send({ from : web3Info.accounts[0] })
			.then(function(result) {
				console.log(result);
				web3InfoDispatch({ type: 'SET_regettoken', web3: {reGetToken : true}})
				fetchData();
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
		console.log(web3Info.accounts[0]);

		// Send transaction
		web3Info.tokenContract.methods.approve(
			web3Info.gameContract._address,
			web3Info.web3.utils.toWei(web3Info.web3.utils.toBN(battleInfo.battleAmount).toString()),
		).send({ from : web3Info.accounts[0] })
		.then(function(result) {
			// acceptBattle(uint256 _p2CrabID, uint256 _battleID)
			web3Info.gameContract.methods.acceptBattle(crab.crabID, battleInfo.battleID).send({ from : web3Info.accounts[0] })
			.then(function(result) {
				console.log(result);
				web3InfoDispatch({ type: 'SET_regettoken', web3: {reGetToken : true}})
				fetchData();
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
	}

  // get battle staus (mus move utility)
  function getBatleStatus(crabState) {
		if (crabState == "0") {
			return "";
		} else {
			return " | In Battle";
		}
    }

	return (
		<div className={styles.card}>
			<div className={styles.card_header}>
			<span><FontAwesomeIcon icon={faPastafarianism}/>{crab.crabID}<span className={styles.crab_inagem}>{getBatleStatus(crab.state)}</span></span>
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
				
				{pageUse != "battle" && crab.state == "0" && (<Form.Control placeholder="SCG" className={styles.token} value={token} onChange={tokenInputHandler}/>)}
				{pageUse != "battle" && crab.state == "0" && (<Button
					className={styles.button_battle}
					variant="info" type="submit"
					disabled={token == "" || crab.state == "1"}
					onClick={putCrabToBattle}
				>
					Put Crab To Battle
				</Button>
				)}
				{pageUse == "battle" && (<Button
					className={styles.button_battle_detail}
					variant="info" type="submit"
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

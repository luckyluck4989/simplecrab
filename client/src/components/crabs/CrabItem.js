import { useContext } from "react";
import { Link } from "react-router-dom";
import { AiFillWindows, AiFillHeart } from "react-icons/ai";
import { GoBrowser } from "react-icons/go";
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPastafarianism } from '@fortawesome/free-solid-svg-icons'
// styles
import styles from "./CrabItem.module.css";

import { useInitWeb3 } from "../../hooks/useInitWeb3";


const CrabItem = ({ item: crab }) => {
  	const [state, setState] = useInitWeb3();

	// Create new battle
	const putCrabToBattle = (event) => {
		event.preventDefault();
		// Send transaction
		state.tokenContract.methods.approve(
			state.gameContract._address,
			1,
		).send({ from : state.accounts[0] })
		.then(function(result) {
			// Send transaction
			state.gameContract.methods.mintCrab().send({ from : state.accounts[0] })
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
				<Form.Control placeholder="SCG" className={styles.token}/>
				<Button
					className={styles.button_battle}
					variant="info" type="submit"
					//onClick={() => addToFavorite(game)}
					onClick={putCrabToBattle}
				>
					Put Crab To Battle
				</Button>
			</div>
		</div>
	);
};

export default CrabItem;

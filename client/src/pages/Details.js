import { useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import crabApi from "../api/crabApi";
import {toTimeFormat} from "../helpers/Utility.js";
import { InitWeb3Context }  from "../context/InitWeb3Context"


// styles
import styles from "./Details.module.css";
import { Button, Table, Form } from 'react-bootstrap';

import Spinner from "../components/ui/Spinner";

const Details = () => {
  const { id } = useParams();
  const [crab, setCrab] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const { web3Info, web3InfoDispatch } = useContext(InitWeb3Context);

  const fetchData = async () => {
    try {
      setCrab(null);
      setIsPending(true);
      setError(null);

      const params = {crabID : id};
      const response = await crabApi.getCrabById(params);

      setCrab(response.data);
      setIsPending(false);
    } catch (err) {
      console.error(err);
      setError(err.message); 
    };
  };

  useEffect(() => {
    if (id) {
        fetchData();
    }
  }, [id]);

	// get battle staus (mus move utility)
	function getBatleStatus(battleStatus) {
		if (battleStatus === "0") {
			return "Waiting";
		} else if (battleStatus === "1") {
			return "Fighting";
		} else {
			return "Ended"
		}
	}

	// Input token handler
	const tokenInputHandler = (event) => {
		// need check balance of token here
		setToken(event.target.value)
	}

	// Create new battle
	const putCrabToBattle = (event) => {
		event.preventDefault();
    setIsPending(true);

		// Send transaction
		web3Info.tokenContract.methods.approve(
			web3Info.gameContract._address,
			web3Info.web3.utils.toWei(web3Info.web3.utils.toBN(token).toString()),
		).send({ from : web3Info.accounts[0] })
		.then(function(result) {
			// startBattle(uint256 _p1CrabID, uint256 _battleAmount)
			web3Info.gameContract.methods.startBattle(crab.crabInfo.crabID, token).send({ from : web3Info.accounts[0] })
			.then(function(result) {
				console.log(result);
				web3InfoDispatch({ type: 'SET_regettoken', web3: {reGetToken : true}})
				fetchData();
			}).catch(function(err) {
				console.log(err.message);
        setIsPending(false);
			});
		}).catch(function(err) {
				console.log(err.message);
        setIsPending(false);
		});
	};

  return (
    <>
    {isPending && <Spinner />}
    <section className={styles.crab_details}>
      {error && <p>{error}</p>}
      {crab && (
        <article className={styles.article}>
          <div>
          <img
            className={styles.thumbnail}
            src={`/crab/${crab.crabInfo.kind}.png`} 
          />
          <ul className={styles.info_list}>
            <li>
              <span className="text-muted">Crab ID : </span>
              <p> {crab.crabInfo.crabID}</p>
            </li>
            <li>
              <span className="text-muted">Strength : </span>
              <p> {crab.crabInfo.strength}</p>
            </li>
          </ul>
          </div>
          <div className={styles.action_battle}>
		  { crab.crabInfo.state === "0" && (
          <Form.Control placeholder="SCG" className={styles.token} value={token} onChange={tokenInputHandler}/>
		  )}
		  {crab.crabInfo.state === "0" && (
          <Button
            className={styles.button_battle}
            variant="info" type="submit"
			disabled={token === ""}
            onClick={putCrabToBattle}
          >
            New Battle
          </Button>
		  )}
          </div>
          {crab.battleHistory.length > 0 && (
            <span className={styles.title}>Battle History </span>
          )}
          {crab.battleHistory.length > 0 && (
            <Table  className={styles.table} responsive="md">
            <thead>
              <tr>
                <th>Battle ID</th>
                <th>Battle Amount</th>
                <th>P1CrabID</th>
                <th>P2CrabID</th>
                <th>Winer/Lose</th>
                <th>Battle Status</th>
                <th>Battle Start Time</th>
                <th>Battle End Time</th>
              </tr>
            </thead>
            <tbody>
            {crab.battleHistory.map(( value, index ) => {
              return (
                <tr key={index}>
                  <td>{value.battleID}</td>
                  <td>{value.battleAmount}</td>
                  <td>{value.p1CrabID}</td>
                  <td>{value.p2CrabID}</td>
                  <td>{value.battleStatus === '2' ? value.winerCrabID : ''}</td>
                  <td>{getBatleStatus(value.battleStatus)}</td>
                  <td>{toTimeFormat(value.battleStartTime)}</td>
                  <td>{value.battleStatus === '2' ? toTimeFormat(value.battleEndTime) : ''}</td>
                </tr>
              );
            })}
            </tbody>
          </Table>
          )}
        </article>
      )}
    </section>
    </>
  );
};
export default Details;

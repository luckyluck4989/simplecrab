import { useParams } from "react-router";
import { useState, useEffect, useContext } from "react";
import battleApi from "../api/battleApi";
import { toTimeFormat } from "../helpers/Utility.js";
import CrabList from "../components/crabs/CrabList";
import { InitWeb3Context }  from "../context/InitWeb3Context"


// styles
import styles from "./BattleDetails.module.css";
import { Table } from 'react-bootstrap';

import Spinner from "../components/ui/Spinner";

const BattleDetails = () => {
  const { id } = useParams();
  const [battle, setBattle] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { web3Info } = useContext(InitWeb3Context);

  const fetchData = async () => {
    try {
      setBattle(null);
      setIsPending(true);
      setError(null);

      const params = {battleID : id, owner : web3Info.currentAccountInfo};
      const response = await battleApi.getBattleById(params);

      setBattle(response.data);
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
  }, [web3Info.currentAccountInfo, id]);

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

  return (
    <>     {isPending && <Spinner />}
    <section className={styles.crab_details}>
      {error && <p>{error}</p>}
      {battle && (
        <article className={styles.article}>
          <div>
            <div className={styles.thumbnail}>
            <div className={styles.divthumbnail}>
              <span className={styles.spanthumbnail}><img className={styles.iconmoney} src={`/money.png`} alt="test" />{battle.battleInfo.battleAmount}</span>
           </div>
           </div>
          <ul className={styles.info_list}>
            <li>
              <span className="text-muted">Battle ID : </span>
              <p> {battle.p1CrabInfo && battle.battleInfo.battleID}</p>
            </li>
            <li>
              <span className="text-muted">Battle Status : </span>
              <p> {battle.p1CrabInfo && getBatleStatus(battle.battleInfo.battleStatus)}</p>
            </li>
            <li>
              <span className="text-muted">P1CrabID : </span>
              <p> {battle.p1CrabInfo && battle.battleInfo.p1CrabID}</p>
            </li>
            <li>
              <span className="text-muted">Strength : </span>
              <p> {battle.p1CrabInfo && battle.p1CrabInfo.strength}</p>
            </li>
            <li>
              <span className="text-muted">Win : </span>
              <p> {battle.p1CrabInfo && battle.p1CrabInfo.win}</p>
            </li>
            <li>
              <span className="text-muted">Lose : </span>
              <p> {battle.p1CrabInfo && battle.p1CrabInfo.lose}</p>
            </li>
          </ul>
          </div>
          {battle.myCrabInfo.length > 0 && (
            <span className={styles.title}>My Crab </span>
          )}
          {battle.myCrabInfo.length > 0 && (
          <CrabList items={battle.myCrabInfo} setIsPending={setIsPending} fetchData={fetchData} pageUse={'battle'} battleInfo={battle.battleInfo}/>
          )}
          {battle.p1BattleHistory.length > 0 && (
            <span className={styles.title}>Battle History </span>
          )}
          {battle.p1BattleHistory.length > 0 && (
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
            {battle.p1BattleHistory.map(( value, index ) => {
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
export default BattleDetails;

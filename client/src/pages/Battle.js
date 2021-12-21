import { useState, useEffect } from "react";

// styles
import styles from "./Battle.module.css";

import BattleList from "../components/battles/BattleList";
import Spinner from "../components/ui/Spinner";

import battleApi from "../api/battleApi";

const Battle = () => {

  const [battle, setBattle] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setBattle(null);
      setIsPending(true);
      setError(null);

      const response = await battleApi.getBattle();

      setBattle(response.data);
      setIsPending(false);
    } catch (err) {
      console.error(err);
      setError(err.message); 
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isPending && <Spinner />}
      <section className={styles.battle}>
        {error && <p>{error}</p>}
        {battle && <BattleList items={battle} />}
      </section>
    </>
  );
};

export default Battle;

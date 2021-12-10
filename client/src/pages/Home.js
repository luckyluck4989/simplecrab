import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import CrabList from "../components/crabs/CrabList";
import Spinner from "../components/ui/Spinner";
import { useInitWeb3 } from "../hooks/useInitWeb3";
import myCrabApi from "../api/mycrabApi";
import styles from "./Home.module.css";

const Home = () => {
  const [myCrab, setMyCrab] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useInitWeb3();

  const fetchData = async () => {
    try {
      setMyCrab(null);
      setIsPending(true);
      setError(null);

      const params = {owner : state.currentAccountInfo};
      const response = await myCrabApi.getMyCrab(params);

      setMyCrab(response.data);
      setIsPending(false);
    } catch (err) {
      console.error(err);
      setError(err.message); 
    };
  };

  useEffect(() => {
    if (state.currentAccountInfo) {
        fetchData();
    }
  }, [state.currentAccountInfo]);

  // Host creat new game
  const mintCrab = (event) => {
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
           fetchData();
        }).catch(function(err) {
            console.log(err.message);
        });
    }).catch(function(err) {
         console.log(err.message);
    });
  };

  // Metamask change account
  window.ethereum.on ('accountsChanged', function (accountInfo) {
    setState({...state, accounts : accountInfo, currentAccountInfo : accountInfo[0]});
  });

  return (
    <>
      <Button
        className={styles.button_battle}
        variant="info" type="submit"
        onClick={mintCrab}>
        {"Mint Crab"}
      </Button>
      <section className={styles.games_content}>
        {isPending && <Spinner />}
        {error && <p>{error}</p>}
        {myCrab && (
          <CrabList items={myCrab} />
        )}
      </section>
    </>
  );
};

export default Home;
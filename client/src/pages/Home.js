import { useState, useEffect, useContext } from "react";
import { Button } from 'react-bootstrap';
import CrabList from "../components/crabs/CrabList";
import Spinner from "../components/ui/Spinner";
import { InitWeb3Context }  from "../context/InitWeb3Context"
import crabApi from "../api/crabApi";
import styles from "./Home.module.css";

const Home = () => {
  const [myCrab, setMyCrab] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { web3Info,web3InfoDispatch } = useContext(InitWeb3Context);
  
  const fetchData = async () => {
    try {
      setMyCrab(null);
      setIsPending(true);
      setError(null);

      const params = {owner : web3Info.currentAccountInfo};
      const response = await crabApi.getMyCrab(params);

      setMyCrab(response.data);
      setIsPending(false);
    } catch (err) {
      console.error(err);
      setError(err.message); 
    };
  };

  useEffect(() => {
    if (web3Info.currentAccountInfo) {
        fetchData();
    }
  }, [web3Info.currentAccountInfo]);

  // Host creat new game
  const mintCrab = (event) => {
    event.preventDefault();
    // Send transaction
    web3Info.tokenContract.methods.approve(
      web3Info.gameContract._address,
      web3Info.web3.utils.toWei(web3Info.web3.utils.toBN(1).toString()),
    ).send({ from : web3Info.accounts[0] })
    .then(function(result) {
        // Send transaction
        web3Info.gameContract.methods.mintCrab().send({ from : web3Info.accounts[0] })
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
          <CrabList items={myCrab} pageUse={'crab'}/>
        )}
      </section>
    </>
  );
};

export default Home;
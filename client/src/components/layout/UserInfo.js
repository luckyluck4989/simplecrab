// styles
import styles from "./UserInfo.module.css";
import { useInitWeb3 } from "../../hooks/useInitWeb3";
import { useState, useEffect } from "react";

const UserInfo = () => {
  const activeStyle = {
    color: "#fff",
  };

  const [state, setState] = useInitWeb3();
  const [token, setToken] = useState("");

  	// Get account token balance
	const loadTokenBalance = async () => {
		const response = await state.tokenContract.methods.balanceOf(state.currentAccountInfo).call();
    setToken(response);
	};

  useEffect(() => {
    if (state.tokenContract && state.currentAccountInfo) {
      loadTokenBalance();
    }
  }, [state.tokenContract, state.currentAccountInfo]);

  // Metamask change account
  window.ethereum.on ('accountsChanged', function (accountInfo) {
    setState({...state, accounts : accountInfo, currentAccountInfo : accountInfo[0]});
  });

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <nav className={styles.navigation}>
      <div className={`${styles.container} container`}>
          <span> {numberWithCommas(token / 10 ** 18) } SCG </span>
          <span> {state.currentAccountInfo && (state.currentAccountInfo.slice(0,6) + '...' + state.currentAccountInfo.slice(-4))} </span>
      </div>
    </nav>
  );
};

export default UserInfo;

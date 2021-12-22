// styles
import styles from "./UserInfo.module.css";
import { InitWeb3Context }  from "../../context/InitWeb3Context"
import { addComma } from "../../helpers/Utility.js";
import { useContext } from "react";

const UserInfo = () => {
  const {web3Info} = useContext(InitWeb3Context);

  return (
    <nav className={styles.navigation}>
      <div className={`${styles.container} container`}>
          <span> {addComma(web3Info.token / 10 ** 18)} SCG </span>
          <span> {web3Info && web3Info.currentAccountInfo && (web3Info.currentAccountInfo.slice(0,6) + '...' + web3Info.currentAccountInfo.slice(-4))} </span>
      </div>
    </nav>
  );
};

export default UserInfo;

import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import {toTimeFormat} from "../../helpers/Utility.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBahai, faPastafarianism } from '@fortawesome/free-solid-svg-icons'

// styles
import styles from "./BattleItem.module.css";

const BattleItem = ({ item: battle }) => {

  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
     <span className={styles.battleID}><FontAwesomeIcon icon={faBahai}/>{battle.battleID}</span> 
     <span><FontAwesomeIcon icon={faPastafarianism}/>{battle.p1CrabID}</span> 
      </div>
      <div className={styles.card_body}>
        <Link to={`/battles/${battle.battleID}`}>
          <div className={styles.divthumbnail}>
            <span className={styles.spanthumbnail}><img className={styles.iconmoney} src={`/money.png`} alt="test" />{battle.battleAmount}</span>
          </div>
        </Link>
        <div className={styles.card_info}>
           <span>Strength : {battle.strength} | Win : {battle.winBattle} | Lose : {battle.loseBattle}</span>
           <span>Start Time : {toTimeFormat(battle.battleStartTime)}</span>
        </div>
      </div>
      <div className={styles.card_footer}>
        <Button
          className={styles.button_battle}
          variant="info" type="submit"
          //onClick={() => addToFavorite(game)}
        >
          Accept To Battle
        </Button>
        </div>
      </div>
  );
};

export default BattleItem;

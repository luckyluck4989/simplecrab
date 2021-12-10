import { useContext } from "react";
import { Link } from "react-router-dom";
import { AiFillWindows, AiFillHeart } from "react-icons/ai";
import { GoBrowser } from "react-icons/go";
import { Button } from 'react-bootstrap';
// styles
import styles from "./CrabItem.module.css";

import { FavoritesContext } from "../../context/FavoritesContext";

const CrabItem = ({ item: crab }) => {
  const { addToFavorite, gameIsFavorite } = useContext(FavoritesContext);

  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <span>#{crab.crabID}</span>
      </div>
      <div className={styles.card_body}>
        <Link to={`/crabs/${crab.crabID}`}>
          <div className={styles.divthumbnail}>
            <img className={styles.thumbnail} src={`/crab/${crab.kind}.png`} alt="test" />
          </div>
        </Link>
        <div className={styles.card_info}>
           <span>Strength : {crab.strength} | Win : {crab.winBattle} | Lose : {crab.loseBattle}</span>
        </div>
      </div>
      <div className={styles.card_footer}>
        <Button
          className={styles.button_battle}
          variant="info" type="submit"
          //onClick={() => addToFavorite(game)}
        >
          Put Crab To Battle
        </Button>
        </div>
      </div>
  );
};

export default CrabItem;

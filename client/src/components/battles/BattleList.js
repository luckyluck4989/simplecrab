// styles
import styles from "./BattleList.module.css";
import BattleItem from "./BattleItem";

const BattleList = ({ items }) => {
  return (
    <div className={styles.grid}>
      {items.map((battle) => (
        <BattleItem key={battle.battleID} item={battle} />
      ))}
    </div>
  );
};

export default BattleList;

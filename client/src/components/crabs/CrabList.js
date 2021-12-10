// styles
import styles from "./CrabList.module.css";
import CrabItem from "./CrabItem";

const CrabList = ({ items }) => {
  return (
    <div className={styles.grid}>
      {items.map((crab) => (
        <CrabItem key={crab.crabID} item={crab} />
      ))}
    </div>
  );
};

export default CrabList;

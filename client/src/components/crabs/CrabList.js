// styles
import styles from "./CrabList.module.css";
import CrabItem from "./CrabItem";

const CrabList = ({ items, pageuse }) => {
  return (
    <div className={styles.grid}>
      {items.map((crab) => (
        <CrabItem key={crab.crabID} item={crab} pageuse={pageuse} />
      ))}
    </div>
  );
};

export default CrabList;

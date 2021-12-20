// styles
import styles from "./CrabList.module.css";
import CrabItem from "./CrabItem";

const CrabList = ({ items, pageUse, battleInfo, fetchData={fetchData}  }) => {
  return (
    <div className={styles.grid}>
      {items.map((crab) => (
        <CrabItem key={crab.crabID} item={crab} fetchData={fetchData} pageUse={pageUse} battleInfo={battleInfo} />
      ))}
    </div>
  );
};

export default CrabList;

// styles
import styles from "./CrabList.module.css";
import CrabItem from "./CrabItem";

const CrabList = ({ items, pageUse, battleInfo, fetchData, setIsPending }) => {
  return (
    <div className={styles.grid}>
      {items.map((crab) => (
        <CrabItem key={crab.crabID} item={crab} setIsPending={setIsPending} fetchData={fetchData} pageUse={pageUse} battleInfo={battleInfo} />
      ))}
    </div>
  );
};

export default CrabList;

// styles
import styles from "./CrabList.module.css";
import CrabItem from "./CrabItem";
import CrabSale from "./CrabSale";

const CrabList = ({ items, pageUse, battleInfo, fetchData, setIsPending }) => {
  return (
    <div className={styles.grid}>
      {pageUse !== "MarketPlace" && items.map((crab) => (
        <CrabItem key={crab.crabID} item={crab} setIsPending={setIsPending} fetchData={fetchData} pageUse={pageUse} battleInfo={battleInfo} />
      ))}
      {pageUse === "MarketPlace" && items.map((crab) => (
        <CrabSale key={crab.crabID} item={crab} setIsPending={setIsPending} />
      ))}
    </div>
  );
};

export default CrabList;

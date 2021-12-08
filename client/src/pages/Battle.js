import { useState } from "react";
import { useFetch } from "../hooks/useFetch";

// styles
import styles from "./Battle.module.css";

import CrabList from "../components/crabs/CrabList";
import Spinner from "../components/ui/Spinner";

const Battle = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  let url = `${process.env.REACT_APP_API_URL}/games?sort-by=popularity`;

  if (selectedCategory) {
    url = `${process.env.REACT_APP_API_URL}/games?sort-by=popularity&category=${selectedCategory}`;
  }

  const { data, isPending, error } = useFetch(url);
  const currentYear = new Date().getFullYear();
  const currentMonth = Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date()
  );

  return (
    <section className={styles.popular}>
      {isPending && <Spinner />}
      {error && <p>{error}</p>}
      {data && <CrabList items={data.slice(0, 10)} />}
    </section>
  );
};

export default Battle;

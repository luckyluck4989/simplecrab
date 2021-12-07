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

  const categories = [
    "MMO",
    "MMORPG",
    "Shooter",
    "Strategy",
    "Moba",
    "Card Games",
    "Racing",
    "Sports",
    "Social",
    "Fighting",
  ];

  return (
    <section className={styles.popular}>
      <h1 className="title">
        Top 10 Free{" "}
        <span className={styles.lead}>
          {selectedCategory ? selectedCategory : "To Play"}
        </span>{" "}
        Games for PC and Browser in {currentMonth} {currentYear}
      </h1>

      <div className={styles.filter}>
        <label htmlFor="category">More Top 10's:</label>
        <select
          defaultValue="Select Category"
          id="category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option disabled>Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              Top {category}
            </option>
          ))}
        </select>
      </div>

      {isPending && <Spinner />}
      {error && <p>{error}</p>}
      {data && <CrabList items={data.slice(0, 10)} />}
    </section>
  );
};

export default Battle;

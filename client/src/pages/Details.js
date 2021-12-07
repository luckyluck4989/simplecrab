import { useContext } from "react";
import { useParams } from "react-router";
import { AiFillHeart, AiFillWindows } from "react-icons/ai";
import { GoBrowser } from "react-icons/go";
import { useFetch } from "../hooks/useFetch";
import { FavoritesContext } from "../context/FavoritesContext";

// styles
import styles from "./Details.module.css";

import Spinner from "../components/ui/Spinner";

const Details = () => {
  const { id } = useParams();
  const {
    data: game,
    isPending,
    error,
  } = useFetch(`${process.env.REACT_APP_API_URL}/game?id=${id}`, {
    id,
  });
  /*const {
    data : game,
    isPending,
    error,
  } = { 
  data : [
    {
    "_id": "61ab5f58940bd853957a35f0",
    "battleID": '1',
    "battleAmount": '10',
    "p1Adress": '0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd',
    "p1CrabID": '1',
    "p2Adress": '0x0000000000000000000000000000000000000000',
    "p2CrabID": '2',
    "winerCrabID": '0',
    "battleStatus": '0',
    "battleStartTime": '1638620975',
    "battleEndTime": '0'
    },
    {
    "_id": "61ab5f58940bd853957a35f0",
    "battleID": '2',
    "battleAmount": '20',
    "p1Adress": '0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd',
    "p1CrabID": '3',
    "p2Adress": '0x0000000000000000000000000000000000000000',
    "p2CrabID": '4',
    "winerCrabID": '0',
    "battleStatus": '0',
    "battleStartTime": '1638621016',
    "battleEndTime": '0'
    },
    {
    "_id": "61ab5f58940bd853957a35f0",
    "battleID": '3',
    "battleAmount": '20',
    "p1Adress": '0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd',
    "p1CrabID": '1',
    "p2Adress": '0x0000000000000000000000000000000000000000',
    "p2CrabID": '3',
    "winerCrabID": '0',
    "battleStatus": '0',
    "battleStartTime": '1638621016',
    "battleEndTime": '0'
    },
    {
    "_id": "61ab5f58940bd853957a35f0",
    "battleID": '4',
    "battleAmount": '20',
    "p1Adress": '0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd',
    "p1CrabID": '1',
    "p2Adress": '0x0000000000000000000000000000000000000000',
    "p2CrabID": '4',
    "winerCrabID": '0',
    "battleStatus": '0',
    "battleStartTime": '1638621016',
    "battleEndTime": '0'
    },
    {
    "_id": "61ab5f58940bd853957a35f0",
    "battleID": '5',
    "battleAmount": '20',
    "p1Adress": '0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd',
    "p1CrabID": '2',
    "p2Adress": '0x0000000000000000000000000000000000000000',
    "p2CrabID": '4',
    "winerCrabID": '0',
    "battleStatus": '0',
    "battleStartTime": '1638621016',
    "battleEndTime": '0'
    }
    ],
  isPending : false,
  error : null
  };*/

  const { gameIsFavorite, addToFavorite } = useContext(FavoritesContext);

  return (
    <section className={styles.crab_details}>
      {isPending && <Spinner />}
      {error && <p>{error}</p>}
      {game && (
        <article className={styles.article}>
          <img
            className={styles.thumbnail}
            src={game.thumbnail}
            alt={game.title}
          />
          <h1 className={styles.title}>About {game.title}</h1>
          {game.description.split(/(\r\n|\r|\n)/gi).map((paragraph, idx) => (
            <p key={idx} style={{ margin: "20px 0", fontSize: "15px" }}>
              {paragraph}
            </p>
          ))}

          <h3>Additional Information</h3>
          <ul className={styles.info_list}>
            <li>
              <span className="text-muted">Title</span>
              <p>{game.title}</p>
            </li>
            <li>
              <span className="text-muted">Developer</span>
              <p>{game.developer}</p>
            </li>
            <li>
              <span className="text-muted">Publisher</span>
              <p>{game.publisher}</p>
            </li>
            <li>
              <span className="text-muted">Release Date</span>
              <p>{game.release_date}</p>
            </li>
            <li>
              <span className="text-muted">Genre</span>
              <p>{game.genre}</p>
            </li>
            <li>
              <span className="text-muted">Platform</span>
              <div className={styles.platform}>
                {game.platform === "Windows" ? (
                  <AiFillWindows className={styles.platform_icon} />
                ) : (
                  <GoBrowser className={styles.platform_icon} />
                )}
                <p>{game.platform}</p>
              </div>
            </li>
          </ul>

          {game?.screenshots && <h3>{game.title} Screenshots</h3>}
          {game?.screenshots && (
            <div className={styles.screenshot_grid}>
              {game?.screenshots?.map(({ image }) => (
                <div key={image}>
                  <img src={image} alt="" />
                </div>
              ))}
            </div>
          )}

          {game?.minimum_system_requirements && (
            <h3>Minimum System Requirements (Windows)</h3>
          )}
          {game?.minimum_system_requirements && (
            <ul className={styles.info_list}>
              <li>
                <span className="text-muted">OS</span>
                <p>{game.minimum_system_requirements.os}</p>
              </li>
              <li>
                <span className="text-muted">Processor</span>
                <p>{game.minimum_system_requirements.processor}</p>
              </li>
              <li>
                <span className="text-muted">Memory</span>
                <p>{game.minimum_system_requirements.memory}</p>
              </li>
              <li>
                <span className="text-muted">Graphics</span>
                <p>{game.minimum_system_requirements.graphics}</p>
              </li>
              <li>
                <span className="text-muted">Storage</span>
                <p>{game.minimum_system_requirements.storage}</p>
              </li>
            </ul>
          )}

          <button
            onClick={() => addToFavorite(game)}
            className={`btn ${styles.btn_favorite}`}
            title={
              gameIsFavorite(game.id)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <AiFillHeart
              className={styles.heart_icon}
              color={gameIsFavorite(game.id) ? "#ff0000" : "#fff"}
            />
          </button>
        </article>
      )}
    </section>
  );
};

export default Details;

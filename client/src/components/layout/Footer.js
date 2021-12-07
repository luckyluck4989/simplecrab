import { AiFillHeart } from "react-icons/ai";
// styles
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className="text-muted">
          © {currentYear} Simple Crab Game, all rights reserved.
        </p>
        <p className={styles.created}>
          Created with{" "}
          <span>
            <AiFillHeart className={styles.heart} />
          </span>{" "}
          by Team 1.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

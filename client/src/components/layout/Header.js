import { NavLink } from "react-router-dom";
import { IoGameController } from "react-icons/io5";
// styles
import styles from "./Header.module.css";

const Header = () => {
  const activeStyle = {
    color: "#fff",
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        <NavLink to="/">
          <img src="/logo.056281dd.svg" alt="image" className={styles.logo} />
        </NavLink>
        <nav className={styles.navigation}>
          <ul>
            <li>
              <NavLink
                to="/"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                My Crab
              </NavLink>
            </li>
            <li>
              <NavLink
                to="battle"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Battle
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

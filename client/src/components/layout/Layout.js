import Header from "./Header";
import Footer from "./Footer";
import BottomBar from "./BottomBar";
import UserInfo from "./UserInfo";

// styles
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <UserInfo />
      <BottomBar />
      <main className={`${styles.main_content} container`}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;

import styles from "./Header.module.scss";
import { Person } from "@material-ui/icons";

function Header() {
  return (
    <div className={styles.headerSection}>
      <h2 className={styles.header}>Alaska</h2>
      <div className={styles.userProfile}>
        <Person />
        <div>UserName</div>
      </div>
    </div>
  );
}

export default Header;

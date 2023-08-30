import styles from "./Footer.module.scss";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        &copy; {currentYear} Your Website Name. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

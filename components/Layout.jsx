import styles from "../styles/Components/Layout.module.css"
import Head from "next/head"
import Navbar from "./Navbar"
import Footer from "./Footer"

const Layout = ({ children }) => {
  return (
    <>
      <div className={styles.layout}>
        <Head>
          <title>Arganaya</title>
        </Head>
      </div>
      <header>
        <Navbar />
      </header>
      <main className={styles.mainContainer}>{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}
export default Layout

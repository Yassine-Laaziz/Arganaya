import Head from "next/head"
import Navbar from "./Navbar"
import Footer from './Footer'

const Layout = ( {children} ) => {
  return (
    <>
      <div className="layout">
        <Head>
          <title>Arganaya</title>
        </Head>
      </div>
      <header>
        <Navbar />
      </header>
      <main className="main-container">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}
export default Layout

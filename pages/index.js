import styles from "../styles/index.module.css"
import { Dish, Pack, FooterBanner, HeroBanner } from "../components"
import { client } from "../lib/client"
import { useEffect, useState } from "react"

const Home = ({ dishes, packs, bannerData }) => {
  bannerData = [bannerData, dishes[0].slug.current]

  const [enoughWidth, setEnoughWidth] = useState(null)
  useEffect(() => {
    setEnoughWidth(window.innerWidth >= packs?.length * 470)
    window.addEventListener("resize", () => {
      setEnoughWidth(window.innerWidth >= packs?.length * 470)
    })
  }, [])

  return (
    <>
      <HeroBanner heroBanner={bannerData && bannerData} />
      {packs?.length >= 1 && (
        <>
          <div className={styles.packsHeading}>
            <h2>Special offer{packs.length > 1 ? "s" : ""}!</h2>
          </div>
          <div className={styles.packsContainer}>
            {enoughWidth ? (
              packs.map((pack) => <Pack key={pack._id} pack={pack} />)
            ) : (
              <div
                className="track"
                style={{
                  "--width": `${packs.length * 470}px`, //450 for image width, 20 for flex gap
                  "--time": `${packs.length * 8}s`,
                }}
              >
                {packs.map((pack) => (
                  <Pack key={pack._id} pack={pack} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      {dishes?.length >= 1 && (
        <>
          <div className={styles.dishesHeading}>
            <h2>Recommended</h2>
          </div>
          <div className={styles.dishesContainer}>
            {dishes?.map((dish) => (
              <Dish key={dish._id} dish={dish} />
            ))}
          </div>
        </>
      )}
      <FooterBanner footerBanner={bannerData && bannerData} />
    </>
  )
}

export const getServerSideProps = async () => {
  const dishesQuery = '*[_type == "dish"]'
  const dishes = await client.fetch(dishesQuery)

  const bannerQuery = '*[_type == "banner"]'
  const bannerData = await client.fetch(bannerQuery)

  const packsQuery = '*[_type == "pack"]'
  const packs = await client.fetch(packsQuery)

  return {
    props: { dishes, packs, bannerData },
  }
}

export default Home

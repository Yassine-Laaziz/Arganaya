import styles from "../styles/index.module.css"
import { Dish, Pack, FooterBanner, HeroBanner } from "../components"
import { client } from "../lib/client"

const Home = ({ dishes, packs, bannerData }) => {
  bannerData = [bannerData, dishes[0].slug.current]

  return (
    <>
      <HeroBanner heroBanner={bannerData && bannerData} />
      {packs && (
        <div className={styles.packsContainer}>
          {packs.map((pack) => (
            <Pack key={pack._id} pack={pack} />
          ))}
        </div>
      )}
      <div className={styles.dishesHeading}>
        <h2>Recommended</h2>
        <p>The Arabic Taste</p>
      </div>
      <div className={styles.dishesContainer}>
        {dishes?.map((dish) => (
          <Dish key={dish._id} dish={dish} />
        ))}
      </div>
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

import { Dish, FooterBanner, HeroBanner } from "../components"
import { client } from "../lib/client"

const Home = ({ dishes, bannerData }) => {
  bannerData = [bannerData, dishes[0].slug.current]

  return (
    <>
      <HeroBanner heroBanner={bannerData && bannerData} />
      <div className="dishes-heading">
        <h2>Recommended</h2>
        <p>The Arabic Taste</p>
      </div>
      <div className="dishes-container">
        {dishes?.map(dish => <Dish key={dish._id} dish={dish} />)}
      </div>
      <FooterBanner footerBanner={bannerData && bannerData}/>
    </>
  )
}

export const getServerSideProps = async () => {
  const dishesQuery = '*[_type == "dish"]'
  const dishes = await client.fetch(dishesQuery)

  const bannerQuery = '*[_type == "banner"]'
  const bannerData = await client.fetch(bannerQuery)

  return {
    props: { dishes, bannerData }
  }
}

export default Home

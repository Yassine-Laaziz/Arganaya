import styles from "../styles/Components/HeroBanner.module.css"
import Link from "next/link"
import { urlFor } from "../lib/client"

const HeroBanner = ({ heroBanner }) => {
  heroBanner = heroBanner[0][0]
  const slug = heroBanner[1]
  return (
    <div className={styles.heroBannerContainer}>
      <div>
        <p className={styles.smallText}>{heroBanner.smallText}</p>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        <img
          src={urlFor(heroBanner.image)}
          alt="dish"
          className={styles.heroBannerImage}
        />
        <div>
          <Link href={`/dish/${slug}`}>
            <button type="button">{heroBanner.buttonText}</button>
          </Link>
        </div>
        <div className={styles.desc}>
          <h5>Arganaya... Hummy SOOO Yummy!</h5>
          <p>{heroBanner.description}</p>
        </div>
      </div>
    </div>
  )
}
export default HeroBanner

import styles from "../styles/Components/HeroBanner.module.css"
import Link from "next/link"
import { urlFor } from "../lib/client"

const HeroBanner = ({ heroBanner }) => {
  const {
    smallText,
    midText,
    largeText1,
    image,
    buttonText,
    description,
    link,
  } = heroBanner[0][0]

  return (
    <div className={styles.heroBannerContainer}>
      <div>
        <p className={styles.smallText}>{smallText}</p>
        <h3>{midText}</h3>
        <h1>{largeText1}</h1>
        <img
          src={urlFor(image)}
          alt="dish"
          className={styles.heroBannerImage}
        />
        <div>
          {link && (
            <Link href={link}>
              <button type="button">{buttonText}</button>
            </Link>
          )}
        </div>
        <div className={styles.desc}>
          <h5>Arganaya... Hummy SOOO Yummy!</h5>
          <p>{description}</p>
        </div>
      </div>
    </div>
  )
}
export default HeroBanner

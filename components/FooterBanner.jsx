import styles from "../styles/Components/FooterBanner.module.css"
import Link from "next/link"
import { urlFor } from "../lib/client"

const FooterBanner = ({ footerBanner }) => {
  const { description, largeText1, midText, buttonText, image, link } =
    footerBanner[0][0]

  return (
    <div className={styles.footerBannerContainer}>
      <div className={styles.left}>
        <p>{description}</p>
        <h3>{largeText1}</h3>
      </div>
      <div className={styles.right}>
        <h3>{midText}</h3>
        {link && (
          <Link href={link}>
            <button>{buttonText}</button>
          </Link>
        )}
      </div>
      <img
        src={urlFor(image)}
        alt="Arganaya"
        className={styles.footerBannerImage}
      />
    </div>
  )
}
export default FooterBanner


import Link from "next/link"
import { urlFor } from "../lib/client"

const FooterBanner = ({ footerBanner }) => {
  const {
    description,
    largeText1,
    smallText,
    midText,
    buttonText,
    image,
  } = footerBanner[0][0]

  const slug = footerBanner[1]

  return (
    <div className="footer-banner-container">
      <div className="banner-desc">
        <div className="left">
          <p>{description}</p>
          <h3>{largeText1}</h3>
        </div>
        <div className="right">
          <p>{smallText}</p>
          <h3>{midText}</h3>
          <Link href={`/Dish/${slug}`}>
            <button>{buttonText}</button>
          </Link>
        </div>
        <img
          src={urlFor(image)}
          alt="Arganaya"
          className="footer-banner-image"
        />
      </div>
    </div>
  )
}
export default FooterBanner

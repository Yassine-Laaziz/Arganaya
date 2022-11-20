import styles from "../styles/Components/Dish.module.css"
import Link from "next/link"
import { urlFor } from "../lib/client"

const Pack = ({ pack }) => {
  const { images, slug } = pack

  return (
    <Link href={`/Pack/${slug.current}`}>
      <div className={styles.dishCard} tabIndex="0">
        <img
          src={urlFor(images[0])}
          alt="Arganaya"
          className={styles.dishImage}
          width="450px"
          height="350px"
        />
      </div>
    </Link>
  )
}
export default Pack

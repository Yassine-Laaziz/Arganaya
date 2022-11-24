import styles from "../styles/Components/Dish.module.css"
import Link from "next/link"
import { urlFor } from "../lib/client"

const Pack = ({ pack }) => {
  const { images, slug, name } = pack

  return (
    <Link href={`/Pack/${slug.current}`}>
      <div className={styles.dishCard} tabIndex="0">
        <img
          src={images && urlFor(images[0])}
          alt="Arganaya"
          className={styles.dishImage}
          width="450px"
          height="350px"
        />
        <p className={styles.dishName}>{name}</p>
      </div>
    </Link>
  )
}
export default Pack

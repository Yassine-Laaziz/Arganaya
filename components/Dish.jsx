import styles from "../styles/Components/Dish.module.css"
import Link from "next/link"
import { urlFor } from "../lib/client"

const Dish = ({ dish }) => {
  const { images, name, slug } = dish

  return (
    <Link href={`/Dish/${slug.current}`}>
      <div className={styles.dishCard} tabIndex="0">
        <img
          src={images && urlFor(images[0])}
          alt="Arganaya"
          className={styles.dishImage}
        />
        <p className={styles.dishName}>{name}</p>
      </div>
    </Link>
  )
}
export default Dish

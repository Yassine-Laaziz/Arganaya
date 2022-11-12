
import Link from "next/link"
import { urlFor } from "../lib/client"

const Dish = ({ dish }) => {
  const { images, name, slug, price } = dish
  return (
    <Link href={`/Dish/${slug.current}`}>
      <div className="dish-card">
        <img
          src={urlFor(images[0])}
          alt="Arganaya"
          className="dish-image"
          width="250px"
          height="250px"
        />
        <p className="dish-name">{name}</p>
        <p className="dish-price">{price}dh</p>
      </div>
    </Link>
  )
}
export default Dish

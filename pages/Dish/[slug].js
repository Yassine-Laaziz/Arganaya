import { urlFor, client } from "../../lib/client"
import { Dish } from "../../components"
import { useState } from "react"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import { useStateContext } from "../../context/StateContext"

const DishDetails = ({ dish, similiarDishes }) => {
  const { images, name, description, price, perPiece } = dish
  const [index, setIndex] = useState(0)
  const { qty, incQty, decQty, onAdd } = useStateContext()

  return (
    <div>
      <div className="dish-detail-container">
        <div>
          <div className="image-container">
            <img
              alt={`Arganaya ${name}`}
              src={urlFor(images && images[index])}
              className="dish-detail-image"
            />
          </div>
          <div className="small-images-container">
            {images?.map((image, i) => (
              <img
                alt={`Small Arganaya photo of ${name}`}
                key={name + " pic " + i}
                src={urlFor(image)}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="dish-detail-desc">
          <h1>{name}</h1>
          <h4>Details: </h4>
          <p>{description}</p>
          <p>
            <span className="price">{price}dh</span>
            {perPiece && <span className="per-piece">/per piece</span>}
          </p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => onAdd(dish, qty)}
            >
              Add to bag
            </button>
            <button type="button" className="buy-now">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-dishes-wrapper">
        <h2>You May Also Like:</h2>
        <div className="marquee">
          <div className="maylike-dishes-container track">
            {similiarDishes.map((similiarDish) => {
              if (similiarDish._id !== dish._id)
                return <Dish key={similiarDish._id} dish={similiarDish} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == 'dish'] {
    slug{
      current
    }
  }
  `
  const dishes = await client.fetch(query)
  const paths = dishes.map((dish) => ({
    params: {
      slug: dish.slug.current,
    },
  }))

  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const dishQuery = `*[_type == 'dish' && slug.current == '${slug}'][0]`
  const similiarDishesQuery = "*[_type == 'dish']"

  const dish = await client.fetch(dishQuery)
  const similiarDishes = await client.fetch(similiarDishesQuery)

  return { props: { dish, similiarDishes } }
}

export default DishDetails

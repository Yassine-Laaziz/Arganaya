import styles from "../../styles/Dish.module.css"
import { urlFor, client } from "../../lib/client"
import { Dish } from "../../components"
import { useState } from "react"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import { IoOptions } from "react-icons/io5"
import { CgCloseR } from "react-icons/cg"
import { useStateContext } from "../../context/StateContext"
import transpileValue from "../../lib/utils/transpileValue"

const DishDetails = ({ dish, similiarDishes }) => {
  const { images, name, description, price, perPiece, options } = dish
  const [displayOptions, setDisplayOptions] = useState(false)
  const [chosenOptions, setChosenOptions] = useState({})
  const [index, setIndex] = useState(0)
  const { qty, incQty, decQty, onAdd, setShowCart } = useStateContext()

  const handleChange = (e, option) => {
    const status = transpileValue(e.target.valueAsNumber, "toText")
    setChosenOptions((prev) => ({ ...prev, [option]: status }))
  }

  const toggleDisplay = (e, checkModal = true) => {
    if (!displayOptions) return setDisplayOptions(true)
    if (checkModal && !e.target.classList.contains("modal")) return
    setDisplayOptions(false)
  }

  const resetToDefault = (e) => {
    const valuePairs = Object.entries(chosenOptions)
    for (let i = 0; i < valuePairs.length; i++) {
      setChosenOptions((prev) => {
        delete prev[valuePairs[i][0]]
        return prev
      })
    }
    toggleDisplay(e, false)
  }

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
          <h1>
            {name}
            <IoOptions
              className={styles.optionsIcon}
              onClick={(e) => toggleDisplay(e)}
              tabIndex="0"
            />
          </h1>
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
              // here we parse it because we don't want to pass a state as an argument
              onClick={() =>
                onAdd(dish, qty, JSON.parse(JSON.stringify(chosenOptions)))
              }
            >
              Add to bag
            </button>
            <button
              type="button"
              className="buy-now"
              onClick={() => {
                onAdd(dish, qty, JSON.parse(JSON.stringify(chosenOptions)))
                setShowCart(true)
              }}
            >
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

      {displayOptions && (
        <div className="modal" onClick={(e) => toggleDisplay(e)}>
          <div className={styles.options}>
            <header>
              <button
                onClick={(e) => resetToDefault(e)}
                className={styles.reset}
              >
                Reset
              </button>
              <CgCloseR
                onClick={(e) => toggleDisplay(e, false)}
                className={styles.xMark}
              />
            </header>

            {/* mapping every available option */}
            <div className={styles.mappedOptions}>
              {options?.map((option, i) => (
                <div
                  className={styles.option}
                  key={`${name}option${i}`}
                  style={{
                    borderColor: transpileValue(
                      chosenOptions[option],
                      "toColor"
                    ),
                  }}
                >
                  <p className={styles.name}>{option}</p>
                  <p>{chosenOptions[option] || "moderate"}</p>
                  <input
                    type="range"
                    max="4"
                    defaultValue={transpileValue(
                      chosenOptions[option],
                      "toNum"
                    )}
                    onChange={(e) => handleChange(e, option)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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

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
  const { images, name, description, perPiece, params, price } = dish

  let { options } = dish
  if (options) {
    // because of sanity rules we can't append arrays into arrays so:
    // [ 'beef: 30', ... ]    ->
    // [ ['beef, 30], ... ]   ->
    // { beef: 30, ... }
    const optionsObj = {}
    for (let i = 0; i < options.length; i++) {
      const valuePair = options[i].split(":")
      const extractedNum = +valuePair[1]?.match(/\d+$/)[0]
      optionsObj[valuePair[0] || "problem occured"] = extractedNum || null
    }
    options = optionsObj
  } else options = null

  const { qty, incQty, decQty, onAdd, setShowCart } = useStateContext()
  const [index, setIndex] = useState(0)
  const [displayParams, setDisplayParams] = useState(false)
  const [chosenParams, setChosenParams] = useState({})
  const [chosenOption, setChosenOption] = useState(
    options ? Object.entries(options)[0] : []
  )
  const [priceState, setPriceState] = useState(
    options ? Object.values(options)[0] : price
  )

  const paramsChange = (e, param) => {
    const status = transpileValue(e.target.valueAsNumber, "toText")
    setChosenParams((prev) => ({ ...prev, [param]: status }))
  }
  const optionChange = (e, newPrice) => {
    setPriceState(newPrice)
    setChosenOption([e.target.value, newPrice])
  }

  const toggleDisplay = (e, checkModal = true) => {
    if (!displayParams) return setDisplayParams(true)
    if (checkModal && !e.target.classList.contains("modal")) return
    setDisplayParams(false)
  }

  const resetToDefault = (e) => {
    const valuePairs = Object.entries(chosenParams)
    for (let i = 0; i < valuePairs.length; i++) {
      setChosenParams((prev) => {
        delete prev[valuePairs[i][0]]
        return prev
      })
    }
    toggleDisplay(e, false)
  }

  return (
    <div>
      <div className={styles.dishDetailContainer}>
        <div>
          <img
            alt={`Arganaya ${name}`}
            src={urlFor(images && images[index])}
            className={styles.dishDetailImage}
          />
          <div className={styles.smallImagesContainer}>
            {images?.map((image, i) => (
              <img
                alt={`Small Arganaya photo of ${name}`}
                key={name + " pic " + i}
                src={urlFor(image)}
                className={
                  i === index
                    ? `${styles.smallImage} ${styles.selectedImage}`
                    : styles.smallImage
                }
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className={styles.dishDetailDesc}>
          <h1>{name}</h1>
          <h4>Details: </h4>
          <p>{description}</p>
          <p>
            <span className="price">{priceState} dh</span>
            {perPiece && <span className="per-piece">/for each piece</span>}
          </p>
          <div className={styles.customize}>
            {(options || params?.length > 1) && <h3>Customize:</h3>}
            {params?.length > 1 && (
              <IoOptions
                className={styles.paramsIcon}
                onClick={(e) => toggleDisplay(e)}
                tabIndex="0"
              />
            )}
          </div>
          {options && (
            <div className={styles.options}>
              {Object.entries(options).map((mappedOption, i) => (
                <label
                  key={`${name}options${i}`}
                  className={styles.option}
                  chosen={
                    chosenOption[0] && chosenOption[0] === mappedOption[0]
                      ? "chosen"
                      : undefined
                  }
                >
                  <input
                    style={{ display: "none" }}
                    type="radio"
                    value={mappedOption[0]}
                    name="option"
                    onChange={(e) => optionChange(e, mappedOption[1])}
                  />
                  {mappedOption[0]}
                </label>
              ))}
            </div>
          )}
          <h3>Quantity: </h3>
          <p className={`quantity-desc ${styles.quantityDesc}`}>
            <span className="minus" tabIndex="0" onClick={decQty}>
              <AiOutlineMinus />
            </span>
            <span className="num">{qty}</span>
            <span className="plus" tabIndex="0" onClick={incQty}>
              <AiOutlinePlus />
            </span>
          </p>
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.addToCart}
              // here we parse it because we don't want to pass a state as an argument
              onClick={() =>
                onAdd({
                  dish,
                  paramsState: chosenParams,
                  optionState: chosenOption,
                })
              }
            >
              Add to bag
            </button>
            <button
              type="button"
              className={styles.buyNow}
              onClick={() => {
                onAdd({
                  dish,
                  paramsState: chosenParams,
                  optionState: chosenOption,
                })
                setShowCart(true)
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className={styles.maylikeDishesWrapper}>
        <h2>You May Also Like:</h2>
        <div className="marquee">
          <div
            className={`${styles.maylikeDishesContainer} track`}
            style={{
              "--width": `${similiarDishes.length * (250 + 20)}px`,
              "--time": `${similiarDishes.length * 5}s`,
            }}
          >
            {similiarDishes.map((similiarDish) => {
              if (similiarDish._id !== dish._id)
                return <Dish key={similiarDish._id} dish={similiarDish} />
            })}
          </div>
        </div>
      </div>

      {displayParams && (
        <div className="modal" onClick={(e) => toggleDisplay(e)}>
          <div className={styles.params}>
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

            {/* mapping every available parameter */}
            <div className={styles.mappedParams}>
              {params?.map((param, i) => (
                <div
                  className={styles.param}
                  key={`${name}param${i}`}
                  style={{
                    borderColor: transpileValue(chosenParams[param], "toColor"),
                  }}
                >
                  <p className={styles.name}>{param}</p>
                  <p>{chosenParams[param] || "moderate"}</p>
                  <input
                    type="range"
                    max="4"
                    defaultValue={transpileValue(chosenParams[param], "toNum")}
                    onChange={(e) => paramsChange(e, param)}
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

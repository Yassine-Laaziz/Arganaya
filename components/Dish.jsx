import styles from "../styles/Components/Dish.module.css"
import Link from "next/link"
import { urlFor } from "../lib/client"
import { IoOptions } from "react-icons/io5"
import { useEffect, useState } from "react"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import { CgCloseR } from "react-icons/cg"
import { useStateContext } from "../context/StateContext"
import transpileValue from "../lib/utils/transpileValue"

const Dish = ({ dish }) => {
  const { images, name, slug, price, options, perPiece } = dish
  const { onAdd } = useStateContext()
  const [displayOptions, setDisplayOptions] = useState(false)
  const [chosenOptions, setChosenOptions] = useState({})
  const [qty, setQty] = useState(1)

  const handleChange = (e, option) => {
    const status = transpileValue(e.target.valueAsNumber, "toText")
    setChosenOptions((prev) => {
      return { ...prev, [option]: status }
    })
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
    <>
      <div className={styles.dishCard} tabIndex="0">
        <Link href={`/Dish/${slug.current}`}>
          <img
            src={urlFor(images[0])}
            alt="Arganaya"
            className={styles.dishImage}
            width="250px"
            height="250px"
          />
        </Link>

        <span className={styles.dishName}>{name}</span>
        <IoOptions
          className={styles.optionsIcon}
          onClick={(e) => toggleDisplay(e)}
          tabIndex="0"
        />
        <p>
          <span className="price">{price}dh</span>
          {perPiece && <span className="per-piece">/per piece </span>}
        </p>

        <div className={styles.quantityDesc}>
          <span
            className="minus"
            onClick={() => setQty((prev) => (prev >= 2 ? prev - 1 : prev))}
            tabIndex="0"
          >
            <AiOutlineMinus />
          </span>
          <span className="num">{qty}</span>
          <span
            className="plus"
            onClick={() => setQty((prev) => prev + 1)}
            tabIndex="0"
          >
            <AiOutlinePlus />
          </span>
        </div>
        <button
          type="button"
          className="add-to-cart"
          style={{ marginTop: "10px", marginInline: "auto", display: "block" }}
          onClick={() => onAdd(dish, qty, chosenOptions)}
        >
          Add to bag
        </button>
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
    </>
  )
}
export default Dish

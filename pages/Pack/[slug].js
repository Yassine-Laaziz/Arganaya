import styles from "../../styles/Dish.module.css"
import { urlFor, client } from "../../lib/client"
import { useState } from "react"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import { useStateContext } from "../../context/StateContext"
import { Pack } from "../../components"

const PackDetails = ({ pack, otherPacks }) => {
  const { images, name, description, price } = pack

  const { qty, incQty, decQty, onAdd, setShowCart } = useStateContext()
  const [index, setIndex] = useState(0)

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
          <p className="price">{price} dh </p>
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
              onClick={() => onAdd({ dish: pack })}
            >
              Add to bag
            </button>
            <button
              type="button"
              className={styles.buyNow}
              onClick={() => {
                onAdd({ dish: pack })
                setShowCart(true)
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      {otherPacks.length >= 2 && (
        <div className={styles.maylikeDishesWrapper}>
          <h2>You May Also Like:</h2>
          <div className="marquee">
            <div
              className={`${styles.maylikeDishesContainer} track`}
              style={{
                "--width": `${otherPacks.length * (250 + 20)}px`,
                "--time": `${otherPacks.length * 5}s`,
              }}
            >
              {otherPacks.map((otherPack) => {
                if (otherPack._id !== pack._id)
                  return <Pack key={otherPack._id} pack={otherPack} />
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == 'pack'] {
    slug{
      current
    }
  }
  `
  const packs = await client.fetch(query)
  const paths = packs.map((pack) => ({
    params: {
      slug: pack.slug.current,
    },
  }))

  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const packQuery = `*[_type == 'pack' && slug.current == '${slug}'][0]`
  const otherPacksQuery = "*[_type == 'pack']"

  const pack = await client.fetch(packQuery)
  const otherPacks = await client.fetch(otherPacksQuery)

  return { props: { pack, otherPacks } }
}

export default PackDetails

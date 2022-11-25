import styles from "../styles/Components/Footer.module.css"
import { AiFillInstagram } from "react-icons/ai"

const Footer = () => {
    return(
        <div className={styles.footerContainer}>
            <p>2022 Arganaya &copy; All Rights Reserverd</p>
            <p className={styles.icons}><AiFillInstagram /></p>
        </div>
    )
}
export default Footer
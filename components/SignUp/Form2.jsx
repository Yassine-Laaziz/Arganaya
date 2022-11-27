import { IoEyeSharp } from "react-icons/io5"
import { BsFillEyeSlashFill } from "react-icons/bs"
import { useState } from "react"

const Form2 = (props) => {
  const { dataChange, password, confirmPassword } = props
  const [showPass, setShowPass] = useState(false)

  return (
    <>
      <div
        onClick={() => setShowPass((prev) => (prev ? false : true))}
        style={{ float: "right" }}
      >
        {showPass ? <IoEyeSharp /> : <BsFillEyeSlashFill />}
      </div>
      <input
        type={showPass ? "text" : "password"}
        placeholder="Create a password"
        onChange={(e) => dataChange("password", e)}
        defaultValue={password}
        required
      />
      <input
        type={showPass ? "text" : "password"}
        placeholder="Confirm password"
        onChange={(e) => dataChange("confirmPassword", e)}
        defaultValue={confirmPassword}
        required
      />
    </>
  )
}

export default Form2

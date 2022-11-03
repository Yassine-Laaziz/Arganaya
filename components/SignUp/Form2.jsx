const Form2 = (props) => {
  const { handleChange, addressLine1, addressLine2, password, confirmPassword } = props
  return (
    <>
      <input
        type="text"
        placeholder="Address Line 1"
        onChange={(e) => handleChange("addressLine1", e)}
        defaultValue={addressLine1}
        required
      />
      <input
        type="text"
        placeholder="Address Line 2"
        onChange={(e) => handleChange("addressLine2", e)}
        defaultValue={addressLine2}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => handleChange("password", e)}
        defaultValue={password}
        required
      />
          <input
        type="password"
        placeholder="Confirm password"
        onChange={(e) => handleChange("confirmPassword", e)}
        defaultValue={confirmPassword}
        required
      />
    </>
  )
}

export default Form2

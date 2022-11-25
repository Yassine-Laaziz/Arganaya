const Form2 = (props) => {
  const { dataChange, password, confirmPassword } = props
  return (
    <>
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => dataChange("password", e)}
        defaultValue={password}
        required
      />
      <input
        type="password"
        placeholder="Confirm password"
        onChange={(e) => dataChange("confirmPassword", e)}
        defaultValue={confirmPassword}
        required
      />
    </>
  )
}

export default Form2

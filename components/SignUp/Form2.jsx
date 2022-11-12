const Form2 = (props) => {
  const { dataChange, email, password, confirmPassword } = props
  return (
    <>
      <input
        type="email"
        placeholder="Email"
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
        onChange={(e) => dataChange("email", e)}
        defaultValue={email}
        required
      />
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

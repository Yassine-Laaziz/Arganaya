const Form1 = (props) => {
  const { dataChange, fullName, email } = props
  return (
    <>
      <input
        type="text"
        placeholder="Full Name"
        onChange={(e) => dataChange("fullName", e)}
        defaultValue={fullName}
        required
      />
      <input
        type="email"
        placeholder="Email"
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
        onChange={(e) => dataChange("email", e)}
        defaultValue={email}
        required
      />
    </>
  )
}
export default Form1

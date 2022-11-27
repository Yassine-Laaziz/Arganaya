const Form1 = (props) => {
  const { dataChange, name, email } = props
  return (
    <>
      <input
        type="text"
        placeholder="Your name"
        onChange={(e) => dataChange("name", e)}
        defaultValue={name}
        required
      />
      <input
        type="email"
        placeholder="Your email"
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
        onChange={(e) => dataChange("email", e)}
        defaultValue={email}
        required
      />
    </>
  )
}
export default Form1

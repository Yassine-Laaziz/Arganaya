const Form1 = (props) => {
  const {handleChange, fullName, number, email} = props
  return (
    <>
      <input
        type="text"
        placeholder="Full Name"
        onChange={(e) => handleChange("fullName", e)}
        defaultValue={fullName}
        required
      />
      <input
        type="number"
        placeholder="Phone Number"
        maxLength={20}
        pattern="^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$"
        onChange={(e) => handleChange("number", e)}
        defaultValue={number === 0 ? '' : number}
        required
      />
      <input
        type="email"
        placeholder="Email"
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
        onChange={(e) => handleChange("email", e)}
        defaultValue={email}
        required
      />
    </>
  )
}
export default Form1

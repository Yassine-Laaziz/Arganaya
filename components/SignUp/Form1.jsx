const Form1 = (props) => {
  const { dataChange, fullName, number } = props
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
        type="number"
        placeholder="Phone Number"
        maxLength={20}
        pattern="^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$"
        onChange={(e) => dataChange("number", e)}
        defaultValue={!number ? "" : number}
        required
      />
    </>
  )
}
export default Form1

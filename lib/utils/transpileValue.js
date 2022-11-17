const transpileValue = (value, to) => {
  switch (to) {
    case "toNum":
      let num
      switch (value) {
        case "super low":
          num = 0
          break
        case "low":
          num = 1
          break
        case "more":
          num = 3
          break
        case "high":
          num = 4
          break
        default:
          num = 2
          break
      }
      return num
    case "toColor":
      let color
      switch (value) {
        case "super low":
          color = "lime"
          break
        case "low":
          color = "darkgreen"
          break
        case "more":
          color = "orange"
          break
        case "high":
          color = "orangered"
          break
        default:
          color = "#324d67"
          break
      }
      return color
    default:
      let word
      switch (value) {
        case 0:
          word = "super low"
          break
        case 1:
          word = "low"
          break
        case 3:
          word = "more"
          break
        case 4:
          word = "high"
          break
        default:
          word = "moderate"
          break
      }
      return word
  }
}

export default transpileValue

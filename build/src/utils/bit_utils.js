const new_bitmap = () => {
  let bitArray = []
  for(let y = 0; y < bit_height;y += 1) {
    let bits = []
      for(let x = 0; x < bit_width;x += 1) {
        bits.push(0)
      }
    bitArray.push(bits)
  }
  return bitArray
}

const get_magnitude = (v_x, v_y) => {
  return Math.sqrt((v_x * v_x)+(v_y * v_y))
}
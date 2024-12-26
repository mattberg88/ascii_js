const new_bitmap = () => {
  let bitArray = []
  for(let y = 0; y < HEIGHT;y += 1) {
    let bits = []
      for(let x = 0; x < WIDTH;x += 1) {
        bits.push(0)
      }
    bitArray.push(bits)
  }
  return bitArray
}

/**
 * @param v_x vector x
 * @param v_y vector y
 * @returns length of vector (v_x, v_y)
 */
const get_magnitude = (v_x, v_y) => {
  return Math.sqrt((v_x * v_x)+(v_y * v_y))
}

const logBitMap = (bm) => {
  bm.forEach(b => console.log(JSON.stringify(b)))
}
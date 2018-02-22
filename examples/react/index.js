import React from 'react'
import ReactDOM from 'react-dom'

import image from 'now-loader!./ctf-example.png'

ReactDOM.render(
  <img src={image} />,
  document.getElementById('root')
)
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import backend from 'now-loader?apiKey=FM8lHTdjemnAakEmoii6DVPf!../backend/package.json'

class Message extends Component {
  constructor(){
    super();
    this.state = { message: null }
  }

  componentDidMount(){
    fetch(backend)
      .then(r => r.text())
      .then(r => this.setState({message: r}))
      .catch(err => this.setState({message: err}))
  }

  render() {
    return <p>{this.state.message || "Loding message from server"}</p>
  }
}

ReactDOM.render(
  <Message />,
  document.getElementById('root')
)
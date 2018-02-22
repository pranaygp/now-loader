import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import backend from 'now-loader!../backend/package.json'

class Message extends Component {
  constructor(){
    super();
    this.state = { message: null }
  }

  componentDidMount(){
    fetch(backend)
      .then(r => r.text())
      .then(r => this.setState({message: r + " - Server"}))
      .catch(err => this.setState({message: "Error: " + err.toString()}))
  }

  render() {
    return <p>{this.state.message || "Loading message from server"}</p>
  }
}

ReactDOM.render(
  <Message />,
  document.getElementById('root')
)
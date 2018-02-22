const cors = require('micro-cors')()
module.exports = cors(() => "hello world")

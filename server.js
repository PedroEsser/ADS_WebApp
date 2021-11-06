const express = require('express')
const app = express()
const path = require('path');

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log('ADS App listening on port ' + port)
})

app.get('/mandelbrot', (req, res) => {
  //docker_client_uri = req.params.uri
  res.sendFile(path.join("/3dMandelbrot", '/index.html'));
})

app.get('/', (req, res) => {
  res.send("")
})

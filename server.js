const express = require('express')
const app = express()

const port = process.env.PORT || 5000
let docker

app.listen(port, () => {
  console.log('ADS App listening on port ' + port)
})

app.get('/test', (req, res) => {
  //docker_client_uri = req.params.uri
  docker = res
})

app.get('/', (req, res) => {
  if (docker)
    docker.send("Badabim badabum")
  res.send("")
})

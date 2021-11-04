const express = require('express')
const app = express()

const port = process.env.PORT || 5000
let docker_client

app.listen(port, () => {
  console.log('ADS App listening on port ' + port)
})

app.get('/docker-connect', (req, res) => {
    docker_client = res
    res.send("")
})

app.get('/', (req, res) => {
  //docker_client?.send("U geh")
  //res.send("")
  console.log(res)
})
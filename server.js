const express = require('express')
const app = express()
const port = 5000
let docker_client

app.listen(port, () => {
  console.log('ADS App listening on port ' + port)
})

app.get('/', (req, res) => {
    docker_client = res
    res.send("Le test2")
})


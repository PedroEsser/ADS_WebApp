const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000
let docker
let last_client

app.listen(port, () => {
  console.log('ADS App listening on port ' + port)
})

app.get('/docker_connect', (req, res) => {
  //if (/* is really our docker)*/)
  console.log("Docker connect")
  docker = res
})

router.post("/docker_post",(request, response) => {
  console.log("Docker post:")
  if(last_client){
    last_client.send(request.body.data)
    last_client = null
  }
});

app.use("/", router);

app.get('', (req, res) => {
  if (docker){
    docker.send(req.params[0])
    docker = null
    last_client = res
  }else{
    res.send("Docker not connected yet!")
  }
})

app.get('/*', (req, res) => {
  if (docker){
    docker.send(req.params[0])
    docker = null
    last_client = res
  }else{
    res.send("Docker not connected yet!")
  }
})
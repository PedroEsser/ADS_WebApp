const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000
let docker_clients = []
let client_id = 0
let clients = new Map()

app.listen(port, () => {
  console.log('ADS App listening on port ' + port)
})

router.get('/docker_hello', (req, res) => {
  docker_clients.push(res)
  res.setTimeout(25000, () => {
    res.send("Timed out")
    docker_clients.splice(docker_clients.indexOf(res), 1)
  })
})

router.post("/docker_post", (req, res) => {
  let id = parseInt(req.body.id)
  clients.get(id).send(req.body.data)
  clients.delete(id)
});

app.use("/", router);

router.get('*', handle_client_request)

router.post('*', handle_client_request)

function handle_client_request(req, res){
  if (docker_clients.length > 0){
    client_id += 1
    response_obj = {
      client_id:client_id,
      url:req.path,
      data:req.body             //req.body -> dados do POST
    }
    docker = docker_clients.pop()
    docker.send(response_obj)
    docker = null
    clients.set(client_id, res)
  }else{
    res.send("Docker not connected!")
  }
}


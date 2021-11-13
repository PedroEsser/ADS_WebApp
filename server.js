const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000
let docker
let client_id = 0
let clients = new Map()

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
  let id = parseInt(request.body.id)
  clients.get(id).send(request.body.data)
  clients.delete(id)
  /*if(last_client){
    last_client.send(request.body.data)
    last_client = null
  }*/
});

app.use("/", router);

app.get('', handle_client)

app.get('/*', handle_client)

function handle_client(req, res){
  if (docker){
    client_id += 1
    let message = req.params[0] || " "
    docker.send(client_id + "/" + message)
    docker = null
    clients.set(client_id, res)
  }else{
    res.send("Docker not connected yet!")
  }
}
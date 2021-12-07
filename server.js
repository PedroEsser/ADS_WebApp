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

const server = app.listen(port, () => {
  var host = server.address().address
  var port = server.address().port
  console.log('ADS app listening at http://%s:%s', host, port)
})

router.get('/docker_hello', (req, res) => {
  docker_clients.unshift(res)
  res.setTimeout(20000, () => {
    res.send("Timed out")
    docker_clients.splice(docker_clients.indexOf(res), 1)
  })
})

router.post("/docker_post", (req, res) => {
  let id = parseInt(req.body.id)
  let headers = JSON.parse(req.body.headers)
  let client_res = clients.get(id)

  for(property in headers)
    headers[property] = headers[property][0]

  client_res.set(headers)

  if("Location" in headers) 
    client_res.redirect(headers["Location"])
  else
    client_res.send(req.body.data)
  
  console.log(headers)
  
  clients.delete(id)
  res.send("Post sent")
});

router.get('/debug', (req, res) => {
  var host = server.address().address
  var port = server.address().port
  let debug = "<h1>Active docker connections: " + docker_clients.length + "</h1><br>"
  debug += "<h2>Current client id: " + client_id + "</h2><br>"
  debug += "<h2> Server at http://" + host + ":" + port + "</h2><br>"
  res.send(debug)
})

app.use("/", router);

router.get('*', handle_client_request)

router.post('*', handle_client_request)

function handle_client_request(req, res){
  if (docker_clients.length > 0){
    client_id += 1
    response_obj = {
      client_id:client_id,
      path:req.originalUrl,
      headers:req.headers,
      body:req.body             //req.body -> dados do POST
    }
    docker = docker_clients.pop()
    docker.send(response_obj)
    docker = null
    clients.set(client_id, res)
  }else{
    res.send("Docker not connected!")
  }
}
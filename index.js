const fs = require('fs');
const https = require('https');
const express = require("express");
const mercadopago = require('mercadopago');
const cors = require('cors');

const app = express();
const port = 5100;

app.use(express.json());
app.use(cors());

app.post('/notifications', (req, res) => {
  console.log("-----------")  
    
});

app.options('/createOrder', cors())

app.post('/createOrder', (req, res) => {
  res.status(200)
  console.log("body", req.body.items)

  const items = req.body.items  
  const itemsHandled = items.map((item)=>({"id": Math.round(Math.random(),2), "title": item.name, "unit_price": item.price, "quantity": item.quantity, currency_id: "ARS", "picture_url": item.images[0]}))
  
  mercadopago.configure({
    access_token: 'TEST-6329496204948801-071110-6ce629584c6dbe109aea60144d5d3830-1421065886'
  });
  
  let preference = { 
    "back_urls": {
      "success": "https://www.pandora-backpacks.xyz/",
      "failure": "https://www.pandora-backpacks.xyz/",
      "pending": "https://www.pandora-backpacks.xyz/"
    },
    "auto_return": "approved",
    notification_url: "https://internal-server-projects.xyz/notifications",

    items: itemsHandled
  };

  mercadopago.preferences.create(preference)
    .then(function (response) {
      global.id = response.body.id;
      console.log(response.body.init_point);          
      res.send(JSON.stringify({"urlPayment":response.body.init_point}));
    })
    .catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
});

const options = {
  key: fs.readFileSync('/etc/cert/privkey.pem'),
  cert: fs.readFileSync('/etc/cert/fullchain.pem')
};

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Servidor HTTPS escuchando en el puerto ${port}`);
});



  

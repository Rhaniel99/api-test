const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.static("./public"));


// Rota para o callback
app.get("/callback", (req, res) => {
  const returnAPI = "http://localhost:4000"; // URL da API na porta 4000
  const originAPI = req.query.api || "API-3500";


  // Envia uma solicitação GET usando o Axios
  axios
    .get(`${returnAPI}/api/user/callback?originAPI=${originAPI}`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Erro ao fazer a solicitação");
    });
});

app.get("/api/user/connect", (req, res) => {
  res.send("Resposta recebida do servidor");
});

// Inicia o servidor na porta 3000
app.listen(3500, () => {
  console.log(`Cliente iniciado na porta `);
});
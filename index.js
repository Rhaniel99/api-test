const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.static("./public"));

// Rota para o redirecionamento
app.get("/callback", (req, res) => {
  const returnAPI = "http://localhost:4000"; // URL da API na porta 4000
  const originAPI = req.query.api || "API-3500";

  // Configuração dos cabeçalhos
  const headers = {
    authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJDJ2VzdCBsYSB2aWUgQVBJIiwidXJsRG9tYWluIjoiQVBJLTM1MDAiLCJ0b2tlbiI6IjFkNGIxYTVmLTAzNzUtNGYyNC05OWYwLTAzNmQ3ZDhhMWM3OCJ9LCJpYXQiOjE2ODUxMTY2NjB9.jkCU7bykrbQ1jVXQD2cuAQXnrvtV-_-S73EKAn7bOkg",
    "Content-Type": "application/json",
  };

  // Envia uma solicitação GET usando o Axios
  axios
    .get(`${returnAPI}/api/user/callback?originAPI=${originAPI}`, { headers })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erro ao fazer a solicitação");
    });
});

// Inicia o servidor na porta 3000
app.listen(3500, () => {
  console.log("Cliente iniciado na porta 3500");
});

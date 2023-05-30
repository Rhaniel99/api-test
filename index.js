const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.static("./public"));

app.get("/login", (req, res) => {
  const authorizationServer = "http://localhost:4000"; // URL do servidor OAuth 2.0
  const clientId = "1"; // Substituir pelo ID do cliente
  const redirectUri = "http://localhost:3500/oauth/seduc/callback"; // URL de redirecionamento do cliente

  const authorizeUrl = `${authorizationServer}/api/user/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;

  // Redirecionar o usuário para a rota /authorize do servidor OAuth 2.0
  fetch(authorizeUrl)
    .then(response => response.json())
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Erro na autenticação");
    });
});

// Rota para o redirecionamento
app.get("/oauth/seduc/callback", (req, res) => {
  const authorizationServer = "http://localhost:4000"; // URL do servidor OAuth 2.0
  const clientId = "1"; // Substituir pelo ID do cliente
  const clientSecret = "123"; // Substituir pelo segredo do cliente
  const redirectUri = "http://localhost:3500/oauth/seduc/callback"; // URL de redirecionamento do cliente

  // Trocar o código de autorização por um token de acesso
  const tokenEndpoint = `${authorizationServer}/api/user/callback`;
  const params = {
    code: req.query.code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(response => response.json())
    .then(data => {
      const accessToken = data.access_token;
      console.log(accessToken);
      // Utilizar o token de acesso para autenticar as solicitações para a API protegida
      // ...
      fetch(`${authorizationServer}/api/user/protegida`, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
        .then(apiResponse => apiResponse.json())
        .then(data => {
          const redirectUrl = data.redirectUrl;
          res.json({ redirectUrl });
        })
        .catch(error => {
          console.error(error);
          res.status(500).send("Erro na autenticação");
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Erro na autenticação");
    });
});

// Inicia o servidor na porta 3500
app.listen(3500, () => {
  console.log("Cliente iniciado na porta 3500");
});

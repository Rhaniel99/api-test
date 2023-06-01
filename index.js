const express = require("express");
const app = express();
app.use(express.static("./public"));

// Rota para o redirecionamento
app.get("/oauth/seduc/callback", (req, res) => {
  const urlServer = "http://localhost:4000"; 
  const clientId = "e320e4b6-be05-46b7-a5b5-01367f103f8d";
  const clientSecret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVybF9kb21haW4iOiJodHRwOi8vbG9jYWxob3N0OjM1MDAifSwiaWF0IjoxNjg1NjQ5NjU2fQ.Yz50E4KeL6IqkH2HIAWPKlNMeqxdK9tBgw-pgWxJvDU";
  const urlCB = "http://localhost:3500/oauth/seduc/callback"; // URL de redirecionamento do cliente

  // Trocar o código de autorização por um token de acesso
  const tokenEndpoint = `${urlServer}/api/user/callback`;
  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: urlCB,
    grant_type: "client_credentials",
  };

  fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => {
      const accessToken = data.access_token;
      res.redirect(`/redirect?token=${accessToken}`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erro na autenticação");
    });
});

app.get("/redirect", (req, res) => {
  const accessToken = req.query.token;
  res.redirect(`http://localhost:4000/api/user/protegida?token=${accessToken}`);
});

app.listen(3500, () => {
  console.log("Cliente iniciado na porta 3500");
});

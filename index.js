const express = require("express");
const app = express();
app.use(express.static("./public"));

// Rota para o redirecionamento
app.get("/oauth/seduc/callback", (req, res) => {
  const urlServer = "http://localhost:4000";
  const clientId = "250ad033-0102-4c74-b68e-d6f611d1b8d0";
  const clientSecret =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVybF9kb21haW4iOiJodHRwOi8vbG9jYWxob3N0OjQ1MDAifSwiaWF0IjoxNjg2MTY2MzU4fQ.fxf2p4yqxObEFGKt7sznM2p-SOVcI0lKzfO6dcs-MTc";
  const protocol = req.protocol;
  const host = req.get("host");
  const urlCB = `${protocol}://${host}/oauth/seduc/callback`; // URL de redirecionamento do cliente

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
      if (accessToken == null) {
        res.send(data.msg);
      } else {
        res.redirect(`/redirect?token=${accessToken}`);
      }
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

app.listen(4500, () => {
  console.log("Cliente iniciado na porta 4500");
});

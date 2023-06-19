const express = require("express");
const app = express();
app.use(express.static("./public"));
app.use(express.json());

// Rota para o redirecionamento
app.get("/oauth/seduc/callback", (req, res) => {
  const urlServer = "http://localhost:4000";
  const clientId = "d6e4f837-ab19-404f-8cc4-66ab6f933a5f";
  const clientSecret =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVybF9kb21haW4iOiJodHRwOi8vbG9jYWxob3N0OjM1MDAifSwiaWF0IjoxNjg2ODQzNzg2fQ.WruzIhUjcb5tQK6VFl9c2fnaf4THr0ITA1pOwYjDgOA";
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

app.post("/api/endpoint", (req, res) => {
  const user = req.body;
  const home = `http://localhost:3500/home?id=${user.id}&name=${user.name}&email=${user.email}&dateBirth=${user.dateBirth}&code=${user.code}`;
  res.send(home);
});

app.get("/home", (req, res) => {
  const { id, name, email, dateBirth, code } = req.query;
  res.send(`
    <h1>Dados do usuário</h1>
    <p>ID: ${id}</p>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
    <p>Date of Birth: ${dateBirth}</p>
    <p>Code: ${code}</p>
  `);
});

app.listen(3500, () => {
  console.log("Cliente iniciado na porta 3500");
});

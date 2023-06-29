const express = require("express");
const app = express();
app.use(express.static("./public"));
app.use(express.json());
app.set('view engine', 'ejs');
const port = 4500;

// Rota para o redirecionamento
app.get("/oauth/seduc/callback", (req, res) => {
  const urlServer = "http://localhost:4000";
  const clientId = "ecb209e7-4474-498d-b0e4-e60db4d2b1fb";
  const clientSecret =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVybERvbWFpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDUwMCJ9LCJpYXQiOjE2ODc5NzQxNDB9.ObcUiHUGsqPjnUNrIPKc8iSH6ik7dxQgD3mO4axGAjk";
  const protocol = req.protocol;
  const host = req.get("host");
  const urlCB = `${protocol}://${host}/oauth/seduc/callback`; // URL de redirecionamento do cliente

  // Trocar o código de autorização por um token de acesso
  const tokenEndpoint = `${urlServer}/api/user/callback`;
  const params = {
    clientID: clientId,
    clientSecret: clientSecret,
    urlCB: urlCB,
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
        res.redirect(`/redirect?client_id=${accessToken}`);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erro na autenticação");
    });
});

app.get("/redirect", (req, res) => {
  const accessToken = req.query.client_id;
  res.redirect(`http://localhost:4000/api/user/protegida?client_id=${accessToken}`);
});



app.post("/api/endpoint", (req, res) => {
  const user = req.body;
  const home = `http://localhost:${port}/home?id=${user.id}&name=${user.name}&email=${user.email}&dateBirth=${user.dateBirth}&code=${user.code}`;
  res.send(home);
});

app.get('/home', (req, res) => {
  const { id, name, email, dateBirth, code } = req.query;
  res.render('user', { id, name, email, dateBirth, code });
});

app.listen(port, () => {
  console.log(`Cliente iniciado na porta ${port}`);
});

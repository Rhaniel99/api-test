const express = require("express");
const app = express();
app.use(express.static("./public"));


// Rota para o redirecionamento
app.get("/oauth/seduc/callback", (req, res) => {
  const authorizationServer = "http://localhost:4000"; // URL do servidor OAuth 2.0
  const clientId = "1"; // Substituir pelo ID do cliente
  const clientSecret = "123"; // Substituir pelo segredo do cliente
  const redirectUri = "http://localhost:3500/oauth/seduc/callback"; // URL de redirecionamento do cliente


  
  // Trocar o código de autorização por um token de acesso
  const tokenEndpoint = `${authorizationServer}/api/user/callback`;
  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
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
      fetch(`${authorizationServer}/api/user/protegida`, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
      .then((apiResponse) => {
        if (apiResponse.ok) {
          // A requisição para a API protegida foi bem-sucedida
          // Redirecione o usuário para outra página
          console.log(apiResponse);
          res.send("ok");
        } else {
          // A requisição para a API protegida falhou
          // Faça algo para lidar com o erro
        }
      })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Erro na autenticação");
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erro na autenticação");
    });
});


app.listen(3500, () => {
  console.log("Cliente iniciado na porta 3500");
});

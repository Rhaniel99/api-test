const express = require('express');
const app = express();
app.use(express.static("./public"));


// Rota para o redirecionamento
app.get('/redirect', (req, res) => {
  const returnAPI = 'http://localhost:4000'; // URL da API na porta 4000
  const originAPI = req.query.api || 'API-3000';
  // Redireciona para a URL da API na porta 4000
  res.redirect(`${returnAPI}/api/user/index?originAPI=${originAPI}`);
});

app.get('/api/user/connect', (req, res) => {
  res.send('Resposta recebida do servidor');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Cliente iniciado na porta 3000');
});

// Importe as dependências necessárias
const express = require('express');
const app = express();

// Rota para o redirecionamento
app.get('/redirecionar', (req, res) => {
  const originAPI = req.query.api || 'API-PORT-4000';

  // Redireciona para a URL da API A na porta 3000
  res.redirect(`http://localhost:4000/api/user/retorno?originAPI=${originAPI}`);
});

// Inicia o servidor na porta 4000
app.listen(3000, () => {
  console.log('API Final iniciada na porta 3000');
});

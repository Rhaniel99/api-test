// Importe as dependências necessárias
const express = require('express');
const app = express();

// Rota para o redirecionamento
app.get('/redirect', (req, res) => {
  const returnAPI = 'http://localhost:4000'; // URL da API na porta 4000
  const originAPI = req.query.api || 'API-3000';
  // Redireciona para a URL da API na porta 4000
  res.redirect(`${returnAPI}/api/user/retorno?originAPI=${originAPI}`);
});

app.get('/api/user/retorno', (req, res) => {
  // Obtenha o cabeçalho personalizado da resposta
  const accessingAPI = req.header('X-Accessing-API');
  
  // Resto da lógica para lidar com a resposta do servidor
  // ...
  
  // Exemplo de exibição no console
  console.log(`Acesso à API: ${accessingAPI}`);
  
  res.send('Resposta recebida do servidor');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Cliente iniciado na porta 3000');
});

async function chamarServidor (endereco, metodo = 'GET', dados) {
    const resposta = await fetch(endereco, {
    method: metodo,
    headers: { 'Content-Type' : 'application/json' },
    body: dados ? JSON.stringify(dados) : undefined,
    });
    return resposta.json()
}

const mensagemDeBoasVindas = document.getElementById('mensagemDeBoasVindas');
if (mensagemDeBoasVindas) {
  const nome = new URLSearchParams(location.search).get('nome');
  if (nome) mensagemDeBoasVindas.textContent = 'Bem-vindo, ' + nome + '!';
}
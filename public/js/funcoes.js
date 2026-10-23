async function chamarServidor (endereco, metodo = 'GET', dados) {
    const resposta = await fetch(endereco, {
    method: metodo,
    headers: { 'Content-Type' : 'application/json' },
    body: dados ? JSON.stringify(dados) : undefined,
    });
    return resposta.status.json()
}

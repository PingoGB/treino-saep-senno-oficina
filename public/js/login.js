document.getElementById('formularioDeLogin').onsubmit = async (evento) => {
  evento.preventDefault();
  const usuarioLogado = await chamarServidor('/login', 'POST', {
    login: document.getElementById('login').value,
    senha: document.getElementById('senha').value,
  });
  if (usuarioLogado.nome) location.href = 'index.html?nome=' + encodeURIComponent(usuarioLogado.nome);
};
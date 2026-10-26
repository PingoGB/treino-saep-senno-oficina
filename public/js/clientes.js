let listaDeClientes = [];

async function carregarClientes() {
  listaDeClientes = await chamarServidor('http://localhost:3000/cliente');
  document.getElementById('tabela').innerHTML = listaDeClientes.map(cliente => `
    <tr>
      <td>${cliente.nome}</td>
      <td>${cliente.email}</td>
      <td>${cliente.cpf}</td>
      <td>
        <button onclick="preencherFormularioDeCliente(${cliente.id})">Editar</button>
        <button onclick="excluirCliente(${cliente.id})">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function limparFormularioDeCliente() {
  document.getElementById('formulario').reset();
  document.getElementById('idDoRegistro').value = '';
}

function preencherFormularioDeCliente(idDoCliente) {
  const cliente = listaDeClientes.find(clienteDaLista => clienteDaLista.id == idDoCliente);
  document.getElementById('idDoRegistro').value = cliente.id;
  document.getElementById('nome').value = cliente.nome;
  document.getElementById('email').value = cliente.email;
  document.getElementById('cpf').value = cliente.cpf;
}

async function excluirCliente(idDoCliente) {
  await chamarServidor('http://localhost:3000/cliente/' + idDoCliente, 'DELETE');
  carregarClientes();
}

document.getElementById('formulario').onsubmit = async (evento) => {
  evento.preventDefault();
  const idDoRegistro = document.getElementById('idDoRegistro').value;
  const dadosDoCliente = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    cpf: document.getElementById('cpf').value,
  };

  if (idDoRegistro) await chamarServidor('http://localhost:3000/cliente/' + idDoRegistro, 'PUT', dadosDoCliente);
  else await chamarServidor('http://localhost:3000/cliente', 'POST', dadosDoCliente);
  limparFormularioDeCliente();
  carregarClientes();
};

carregarClientes();
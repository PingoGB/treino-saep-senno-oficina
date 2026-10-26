let listaDeClientes = [];

async function carregarClientes() {
  listaDeClientes = await chamarServidor('/api/clientes');
  document.getElementById('tabela').innerHTML = listaDeClientes.map(cliente => `
    <tr>
      <td>${cliente.nome}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.telefone}</td>
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
  document.getElementById('cpf').value = cliente.cpf;
  document.getElementById('telefone').value = cliente.telefone;
}

async function excluirCliente(idDoCliente) {
  await chamarServidor('/api/clientes/' + idDoCliente, 'DELETE');
  carregarClientes();
}

document.getElementById('formulario').onsubmit = async (evento) => {
  evento.preventDefault();
  const idDoRegistro = document.getElementById('idDoRegistro').value;
  const dadosDoCliente = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    telefone: document.getElementById('telefone').value,
  };

  if (idDoRegistro) await chamarServidor('/api/clientes/' + idDoRegistro, 'PUT', dadosDoCliente);
  else await chamarServidor('/api/clientes', 'POST', dadosDoCliente);
  limparFormularioDeCliente();
  carregarClientes();
};

carregarClientes();
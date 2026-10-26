let listaDeVeiculos = [];

async function carregarVeiculos() {
  const clientes = await chamarServidor('http://localhost:3000/cliente');
  document.getElementById('id_cliente').innerHTML =
    '<option value="">Selecione o cliente</option>' +
    clientes.map(cliente => `<option value="${cliente.id}">${cliente.nome}</option>`).join('');

  listaDeVeiculos = await chamarServidor('http://localhost:3000/carro');
  document.getElementById('tabela').innerHTML = listaDeVeiculos.map(carro => `
    <tr>
      <td>${carro.modelo}</td>
      <td>${carro.placa}</td>
      <td>${carro.ano}</td>
      <td>${carro.idCliente}</td>
      <td>
        <button onclick="preencherFormularioDeVeiculo(${carro.id})">Editar</button>
        <button onclick="excluirVeiculo(${carro.id})">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function limparFormularioDeVeiculo() {
  document.getElementById('formulario').reset();
  document.getElementById('idDoRegistro').value = '';
}

function preencherFormularioDeVeiculo(idDoVeiculo) {
  const veiculo = listaDeVeiculos.find(veiculoDaLista => veiculoDaLista.id == idDoVeiculo);
  document.getElementById('idDoRegistro').value = veiculo.id;
  document.getElementById('modelo').value = veiculo.modelo;
  document.getElementById('placa').value = veiculo.placa;
  document.getElementById('ano').value = veiculo.ano;
  document.getElementById('id_cliente').value = veiculo.idCliente;
}

async function excluirVeiculo(idDoVeiculo) {
  await chamarServidor('http://localhost:3000/carro/' + idDoVeiculo, 'DELETE');
  carregarVeiculos();
}

document.getElementById('formulario').onsubmit = async (evento) => {
  evento.preventDefault();
  const idDoRegistro = document.getElementById('idDoRegistro').value;
  const dadosDoVeiculo = {
    placa: document.getElementById('placa').value,
    modelo: document.getElementById('modelo').value,
    ano: document.getElementById('ano').value,
    idCliente: document.getElementById('id_cliente').value,
  };

  if (idDoRegistro) await chamarServidor('http://localhost:3000/carro/' + idDoRegistro, 'PUT', dadosDoVeiculo);
  else await chamarServidor('http://localhost:3000/carro', 'POST', dadosDoVeiculo);
  limparFormularioDeVeiculo();
  carregarVeiculos();
};

carregarVeiculos();
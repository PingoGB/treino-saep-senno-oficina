let listaDeVeiculos = [];

async function carregarVeiculos() {
  const clientes = await chamarServidor('/api/clientes');
  document.getElementById('id_cliente').innerHTML =
    '<option value="">Selecione o cliente</option>' +
    clientes.map(cliente => `<option value="${cliente.id}">${cliente.nome}</option>`).join('');

  listaDeVeiculos = await chamarServidor('/api/veiculos');
  document.getElementById('tabela').innerHTML = listaDeVeiculos.map(veiculo => `
    <tr>
      <td>${veiculo.placa}</td>
      <td>${veiculo.modelo}</td>
      <td>${veiculo.ano}</td>
      <td>${veiculo.cliente}</td>
      <td>
        <button onclick="preencherFormularioDeVeiculo(${veiculo.id})">Editar</button>
        <button onclick="excluirVeiculo(${veiculo.id})">Excluir</button>
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
  document.getElementById('placa').value = veiculo.placa;
  document.getElementById('modelo').value = veiculo.modelo;
  document.getElementById('ano').value = veiculo.ano;
  document.getElementById('id_cliente').value = veiculo.id_cliente;
}

async function excluirVeiculo(idDoVeiculo) {
  await chamarServidor('/api/veiculos/' + idDoVeiculo, 'DELETE');
  carregarVeiculos();
}

document.getElementById('formulario').onsubmit = async (evento) => {
  evento.preventDefault();
  const idDoRegistro = document.getElementById('idDoRegistro').value;
  const dadosDoVeiculo = {
    placa: document.getElementById('placa').value,
    modelo: document.getElementById('modelo').value,
    ano: document.getElementById('ano').value,
    id_cliente: document.getElementById('id_cliente').value,
  };

  if (idDoRegistro) await chamarServidor('/api/veiculos/' + idDoRegistro, 'PUT', dadosDoVeiculo);
  else await chamarServidor('/api/veiculos', 'POST', dadosDoVeiculo);
  limparFormularioDeVeiculo();
  carregarVeiculos();
};

carregarVeiculos();
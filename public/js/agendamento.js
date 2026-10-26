let listaDeAgendamentos = [];

async function carregarAgendamentos() {
  const veiculos = await chamarServidor('/api/veiculos');
  document.getElementById('id_veiculo').innerHTML =
    '<option value="">Selecione o veículo</option>' +
    veiculos.map(veiculo => `<option value="${veiculo.id}">${veiculo.placa} - ${veiculo.modelo}</option>`).join('');

  listaDeAgendamentos = await chamarServidor('/api/agendamentos');
  document.getElementById('tabela').innerHTML = listaDeAgendamentos.map(agendamento => `
    <tr>
      <td>${agendamento.data_agendamento}</td>
      <td>${agendamento.servico}</td>
      <td>${agendamento.cliente}</td>
      <td>${agendamento.placa}</td>
      <td>${agendamento.modelo}</td>
      <td>
        <button onclick="preencherFormularioDeAgendamento(${agendamento.id})">Editar</button>
        <button onclick="excluirAgendamento(${agendamento.id})">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function limparFormularioDeAgendamento() {
  document.getElementById('formulario').reset();
  document.getElementById('idDoRegistro').value = '';
}

function preencherFormularioDeAgendamento(idDoAgendamento) {
  const agendamento = listaDeAgendamentos.find(agendamentoDaLista => agendamentoDaLista.id == idDoAgendamento);
  document.getElementById('idDoRegistro').value = agendamento.id;
  document.getElementById('data_agendamento').value = agendamento.data_agendamento;
  document.getElementById('servico').value = agendamento.servico;
  document.getElementById('id_veiculo').value = agendamento.id_veiculo;
}

async function excluirAgendamento(idDoAgendamento) {
  await chamarServidor('/api/agendamentos/' + idDoAgendamento, 'DELETE');
  carregarAgendamentos();
}

document.getElementById('formulario').onsubmit = async (evento) => {
  evento.preventDefault();
  const idDoRegistro = document.getElementById('idDoRegistro').value;
  const dadosDoAgendamento = {
    data_agendamento: document.getElementById('data_agendamento').value,
    servico: document.getElementById('servico').value,
    id_veiculo: document.getElementById('id_veiculo').value,
  };

  if (idDoRegistro) await chamarServidor('/api/agendamentos/' + idDoRegistro, 'PUT', dadosDoAgendamento);
  else await chamarServidor('/api/agendamentos', 'POST', dadosDoAgendamento);
  limparFormularioDeAgendamento();
  carregarAgendamentos();
};

carregarAgendamentos();
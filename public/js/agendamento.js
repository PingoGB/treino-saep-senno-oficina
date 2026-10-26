  let listaDeAgendamentos = [];

  async function carregarAgendamentos() {
    const veiculos = await chamarServidor('http://localhost:3000/carro');
    document.getElementById('id_veiculo').innerHTML =
      '<option value="">Selecione o veículo</option>' +
      veiculos.map(carro => `<option value="${carro.id}">${carro.placa} - ${carro.modelo}</option>`).join('');

    listaDeAgendamentos = await chamarServidor('http://localhost:3000/agendamento');
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
    document.getElementById('id_veiculo').value = agendamento.id_carro;
  }

  async function excluirAgendamento(idDoAgendamento) {
    await chamarServidor('http://localhost:3000/agendamento/' + idDoAgendamento, 'DELETE');
    carregarAgendamentos();
  }

  document.getElementById('formulario').onsubmit = async (evento) => {
    evento.preventDefault();
    const idDoRegistro = document.getElementById('idDoRegistro').value;
    const dadosDoAgendamento = {
      data_agendamento: document.getElementById('data_agendamento').value,
      servico: document.getElementById('servico').value,
      id_carro: document.getElementById('id_veiculo').value,
    };

    if (idDoRegistro) await chamarServidor('http://localhost:3000/agendamento/' + idDoRegistro, 'PUT', dadosDoAgendamento);
    else await chamarServidor('http://localhost:3000/agendamento', 'POST', dadosDoAgendamento);
    limparFormularioDeAgendamento();
    carregarAgendamentos();
  };

  carregarAgendamentos();
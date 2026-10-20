create table usuario (
id SERIAL primary key,
nome VARCHAR(255) not null,
email VARCHAR(255) not null unique,
senha VARCHAR(255) not null
);

insert into usuario (nome, email, senha) VALUES
('vitor', 'vitor@gmail.com', 'vitor69'),
('arthur', 'arthur@gmail.com', 'arthur69'),
('senno', 'senno@gmail.com', 'senno69');

create table cliente (
id SERIAL PRIMARY KEY,
nome VARCHAR(255) not null,
email VARCHAR(255) not null unique,
cpf VARCHAR(11) not null unique
);

insert into cliente (nome, email, cpf) VALUES
('willer', 'willer@gmail.com', '11111111111'),
('romuel', 'romuel@gmail.com', '22222222222'),
('luciano', 'luciano@gmail.com', '33333333333');

create table carro (
id SERIAL PRIMARY KEY,
modelo VARCHAR(255) not null,
placa VARCHAR(7) not null unique,
ano INT not null,
idCliente INT not null

foreign key idCliente references cliente (id)
);

insert into carro (modelo, placa, ano, idCliente) VALUES
('Civic', 'ABC1234', 2007, 1),
('Uno', 'ABC1235', 2008, 2),
('Mobi', 'ABC1236', 2009, 3);


create table agendamento(
id SERIAL PRIMARY KEY,
id_cliente INT not null,
id_carro INT not null,
servico VARCHAR(255) not null,
data_agendamento DATE not null,

foreign key (id_cliente) references cliente (id),
foreign key (id_carro) references carro (id)
);

insert into agendamento (id_cliente, id_carro, servico, data_agendamento) VALUES
(1, 1, 'troca de óleo', '2026-10-19'),
(2, 2, 'calibragem de pneu', '2026-10-20'),
(3, 3, 'martelinho de ouro', '2026-10-21');
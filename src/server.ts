import express from 'express';
import { v4 as uuid } from 'uuid';

type TransactionType = {
  type: string;
  id: string;
  amount: number; //amount
  date: Date;
}
type UserType = {
  id: string;
  cpf: string;
  name: string;
  transactions: TransactionType[];
}

const clients = [] as UserType[];

const server = express();

server.use(express.json());

/* CRUD- create,delete,read,update do usuario */
type BodyType = {
  cpf: string;
  name: string;
};
server.post('/users', (request, response) => {
  const { cpf, name } = request.body as BodyType;
  //validar campus
  // validar se o cliente com cpf informado já existe

  const ClientNew = {
    cpf,
    name,
    id: uuid(),
    transactions: []
  }
  clients.push(ClientNew);
  return response.status(201).json({
    message: "cadastro realizado com sucesso",
    client: ClientNew
  });
});

server.get('/users', (request, response) => {
  response.status(200).json(clients);
});

type ParamsType = {
  id: string;
};
server.delete('/users/:id', (request, response) => {
  const { id } = request.params as ParamsType;
  //validar o id
  const index = clients.findIndex(client => client.id === id);
  if (index < 0) {
    return response.status(400).json({ message: "error: cliente não existe no banco de dados" });
  }
  clients.splice(index, 1);
  return response.status(200).json({ message: "usuario removido com sucesso" });

});

server.put('/users/:id', (request, response) => {
  const { id } = request.params as ParamsType;
  const { cpf, name } = request.body as BodyType;
  //validar o id
  const index = clients.findIndex(client => client.id === id);
  if (index < 0) {
    return response.status(400).json({ message: "error: cliente não existe no banco de dados" });
  }
  clients[index] = {
    id,
    cpf,
    name,
    transactions: clients[index].transactions
  }
  return response.status(200).json(
    { message: "alterado com sucesso", client: clients[index] }
  );
});

// CRUD da tabela Transactions
type BodyTypeTransactions = {
  type: string;
  amount: number;
};

server.post('/transactions', (request, response) => {
  const { type, amount } = request.body as BodyTypeTransactions;
  const { id } = request.headers;
  const client = clients.find(client => client.id === id);

  if (!client) {
    return response.status(400).json({ message: "error: cliente não existe no banco de dados" });
  }
  const transaction = {
    id: uuid(),
    type,
    amount,
    date: new Date()
  }
  console.log(transaction);
  client.transactions.push(transaction);

  return response.status(201).json({
    message: "transação realizada com sucesso",
    transactions: client.transactions
  });
});

server.get('/users', (request, response) => {
  response.status(200).json(clients);
});

type ParamsType = {
  id: string;
};
server.delete('/users/:id', (request, response) => {
  const { id } = request.params as ParamsType;
  //validar o id
  const index = clients.findIndex(client => client.id === id);
  if (index < 0) {
    return response.status(400).json({ message: "error: cliente não existe no banco de dados" });
  }
  clients.splice(index, 1);
  return response.status(200).json({ message: "usuario removido com sucesso" });

});

server.put('/users/:id', (request, response) => {
  const { id } = request.params as ParamsType;
  const { cpf, name } = request.body as BodyType;
  //validar o id
  const index = clients.findIndex(client => client.id === id);
  if (index < 0) {
    return response.status(400).json({ message: "error: cliente não existe no banco de dados" });
  }
  clients[index] = {
    id,
    cpf,
    name,
    transactions: clients[index].transactions
  }
  return response.status(200).json(
    { message: "alterado com sucesso", client: clients[index] }
  );
});


server.listen('3333', () => {
  console.log('server online on port 3333');
});
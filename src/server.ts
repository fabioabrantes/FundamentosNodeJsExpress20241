import express from 'express';
import { v4 as uuid } from 'uuid';

type TransactionType = {
  tipo: string;
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

type ParamsTypeUser = {
  id: string;
};
server.delete('/users/:id', (request, response) => {
  const { id } = request.params as ParamsTypeUser;
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
  tipo: string;
  amount: number;
};

server.post('/client/transactions', (request, response) => {
 
  const { id, tipo, amount } = request.headers;

  const client = clients.find(client => client.id === id);

  if (!client) {
    return response.status(400).json({ message: "error: cliente não existe no banco de dados" });
  }
  const transaction = {
    id: uuid(),
    tipo:String(tipo),
    amount: Number(amount),
    date: new Date()
  }

  client.transactions.push(transaction);

  return response.status(201).json({
    message: "transação realizada com sucesso",
    transactions: client.transactions
  });
});

server.get('/client/:id/transactions', (request, response) => {
  const {id} = request.params;
  const client = clients.find(client => client.id === id);

  if (!client) {
    return response.status(400).json({ message: "error: cliente não existe no banco de dados" });
  }
  
  response.status(200).json(client.transactions);
});

type BodyTransactions = {
  novotipo:string;
  novoAmount: number;
};

server.put('/client/:idClient/transactions/:idTransaction', (request,response)=>{
  const {idTransaction, idClient} = request.params;
  const client = clients.find(client => client.id === idClient);
  const {novotipo,novoAmount} = request.body as BodyTransactions;

  if (!client) {
    return response.status(400).json({ message: "error: cliente não existe no banco de dados" });
  }
  const transaction = client.transactions.find(item => item.id === idTransaction);

  if (!transaction) {
    return response.status(400).json({ message: "error: transacao não existe no banco de dados" });
  }

  transaction.tipo = novotipo;
  transaction.amount = novoAmount;

  return response.status(200).json({message:" edição realaizada com sucesso da transação"})
})

type ParamsType = {
  id: string;
};
server.delete('/client/:idClient/transactions/:idTransaction', (request, response) => {

});


server.listen('3333', () => {
  console.log('server online on port 3333');
});
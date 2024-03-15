import express from 'express';
import {v4 as uuid} from 'uuid';

const server = express();

server.use(express.json());

type TransactionType ={
  type:'credit'|'debit';
  id:string;
  value:number;
}
type UserType = {
  id:string;
  name:string;
  transactions:TransactionType[];
}

const users = [] as UserType[];
/* CRUD- create,delete,read,update do usuario */

server.post('/users', (request, response) => {
  
});

server.get('/users', (request, response) => {
  
});

server.delete('/users/:id', (request, response) => {
 ;
});

server.put('/users/:id', (request, response) => {
  
});

server.listen('3333', () => {
  console.log('server online on port 3333');
});
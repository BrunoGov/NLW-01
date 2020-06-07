import express, { response, request } from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3333);

// const users = [
//     'Bruno',
//     'Bruno Pereira',
//     'Bruno Morais',
//     'Bruno Gouveia'
// ];

// app.get('/users', (request, reponse) => {
//     // console.log('Listagem de usuários');
//     // reponse.send('Hello World!');

//     const search = String(request.query.search);
//     const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

//     //Com JSON
//     reponse.json(filteredUsers);
// });

// app.get('/users/:id', (resq, res) =>{
//     const id = Number(resq.params.id);
    
//     const user = users[id];

//     return res.json(user);
// });

// app.post('/users', (request, response) => {
//     const data = request.body;

//     const user = {
//         name: data.name,
//         email: data.email
//     }
//     // const user = {
//     //     name: 'CJ',
//     //     email: 'bmorais@gmail.com'
//     // };

//     return response.json(user);
// });
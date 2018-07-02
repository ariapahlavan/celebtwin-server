const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dbname = 'emojifydb';
const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'ariapahlavan',
    password : '',
    database : dbname
  }
});

const database = {
  users: [
    {
      id: 1,
      name: 'Sarah',
      email: 'sarah@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    }, {
      id: 2,
      name: 'Joe',
      email: 'joe@yahoo.com',
      password: '1234',
      entries: 0,
      joined: new Date()
    }
  ]
}



const app = express();

app.use(bodyParser.json());
app.use(cors());

const databaseContains = (predicate, onPresent, onAbsent) => {
  for (let i = 0; i < database.users.length; i++) {
    const user = database.users[i];
    if (predicate(user))
          return onPresent(user);
  }

  return onAbsent();
};


app.get('/', (req, res) => {
  res.json(database.users);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({id})
    .then(user => {
      if (user.length>0) { res.json(user[0]); }
      else { res.status(400).json('no such user'); }
    })
    .catch(err => res.status(400).json('error getting user'));
});


app.post('/signin', (req, res) => {
  const body = req.body;

  databaseContains(
    user => body.email === user.email && body.password === user.password,
    user => res.json(user),
    () => res.status(400).json('error logging in')
  );
});

app.post('/register', (req, res) => {
  const {name, email, password} = req.body;

  db('users')
  .returning('*')
  .insert({
    name: name,
    email: email,
    joined: new Date()
  })
  .then(user => res.json(user[0]))
  .catch(err => res.status(400).json('unable to register'));
});


app.put('/image', (req, res) => {
  const {id} = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      if (entries.length>0) { res.json(entries[0]); }
      else { res.status(400).json('no such user'); }
    })
    .catch(err => res.status(400).json('no such user'));
});

app.listen(3000, () => {
  console.log('app running on port 3000');
});

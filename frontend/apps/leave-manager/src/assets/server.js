const jsonServer = require('json-server');
const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middleWares = jsonServer.defaults();
const userDb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'));

server.use(middleWares);
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

const SECRET_KEY = '123456789';

const users = userDb.Users;

const leave = userDb.Leaves;

const appliedLeave = userDb.Applied;

const expiresIn = '1h';

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

function isAuthenticated({email, password}) {
  return users.find(user => user.email === email && user.password === password);
}

server.post('/auth/login', (req, res) => {
  const {email, password} = req.body;
  const loggedInUser = isAuthenticated({email, password});
  if (!loggedInUser) {
    const status = 401;
    const message = "Incorrect email or Password";
    res.status(401).json({status, message});
  } else {
    const token = createToken({ email, password });
    res.status(200).json({ token, user: loggedInUser });
  }
});

server.get('/Leaves', (req, res) => {
  res.json(leave);
});

server.get('/Applied', (req, res) => {
  res.json(appliedLeave);
});

server.use(router);
server.listen(5000, () => {
  console.log('JSON Server is running in http://localhost:5000');
});

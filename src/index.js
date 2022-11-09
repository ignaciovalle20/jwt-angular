const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwToken = require('jsonwebtoken');
const fs = require('fs');


// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
  } else {
    next(err);
  }
});

const users = [
  { id: '1', email: 'manolito@gmail.com', password: '1234', name: 'manolo' }
]

function validateEmailAndPassword(email, password) {
  for (let user of users) {
    if (user.email == email) {
      if (user.password == password) {
        return true;
      }
      return false;
    }
  }
  return false;
}

function findUserIdForEmail(email) {
  for (const user of users) {
    if (user.email == email) {
      return user.id;
    }
  }
}

const RSA_PRIVATE_KEY = fs.readFileSync('keys/rsa_private.pem');

app.post('/login', async ({ body }, res) => {
  const email = body.email,
    password = body.password;

  if (validateEmailAndPassword(email, password)) {
    const userId = findUserIdForEmail(email);

    const jwtBearerToken = jwToken.sign({}, RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: 120,
      subject: userId
    })

    res.status(200).json({
      idToken: jwtBearerToken,
      expiresIn: 120
    });
  } else {
    // send status 401 Unauthorized
    res.sendStatus(401);
  }
});

var { expressjwt: jwt } = require("express-jwt");

const RSA_PUBLIC_KEY = fs.readFileSync('keys/rsa_public.pem');

const checkIfAuthenticated = jwt({
  secret: RSA_PUBLIC_KEY,
  algorithms: ["RS256"]
});

app.get('/verify', checkIfAuthenticated, async ({ body }, res) => {
  res.status(200).send({ message: 'you are authenticated' });
})




// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});
const express = require('express');
const jwt = require('jsonwebtoken');
const customers = express.Router();

let users = [
  { username: "rhuanpablo", password: "strongpass123", fullName: "Rhuan Pablo", email: "rhuan@example.com" },
  { username: "alicejones", password: "alicepwd", fullName: "Alice Jones", email: "alice.jones@example.com" },
  { username: "bobjohnson", password: "bobjohnson456", fullName: "Bob Johnson", email: "bob.j@example.com" }
];

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

customers.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username }, "access_secret_key", { expiresIn: '1h' });
  req.session.authorization = { token, username };
  return res.status(200).json({ message: `Welcome back, ${username}!`, token });
});

module.exports.authenticated = customers;

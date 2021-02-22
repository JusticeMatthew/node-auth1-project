const express = require('express');
const router = express.Router();
const User = require('../users/users-model.js');
const bcrypt = require('bcryptjs');

const {
  checkPayload,
  checkUserInDb,
  checkUserExists,
} = require('../middleware/auth-middleware');

router.post('/register', checkPayload, checkUserInDb, async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10); //2^10
    const newUser = await User.add({
      username: req.body.username,
      password: hash,
    });
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', checkPayload, checkUserExists, (req, res) => {
  try {
    const verified = bcrypt.compareSync(
      req.body.password,
      req.userData.password,
    );
    if (verified) {
      req.session.user = req.userData;
      res.json(`Logged in`);
    } else {
      res.status(401).json('You shall not pass!');
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

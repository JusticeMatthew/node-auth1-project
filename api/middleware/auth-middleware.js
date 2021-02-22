const User = require('../users/users-model.js');

const checkPayload = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json('You shall not pass!');
  } else {
    next();
  }
};

const checkUserInDb = async (req, res, next) => {
  try {
    const rows = await User.findBy({ username: req.body.username });
    if (!rows.length) {
      next();
    } else {
      res.status(401).json('Username already exists');
    }
  } catch (e) {
    res.status(500).json(`Server error: ${e}`);
  }
};

const checkUserExists = async (req, res, next) => {
  try {
    const rows = await User.findBy({ username: req.body.username });
    if (rows.length) {
      req.userData = rows[0];
      next();
    } else {
      res.status(401).json('You shall not pass!');
    }
  } catch (e) {
    res.status(500).json(`Server error: ${e}`);
  }
};

module.exports = {
  checkPayload,
  checkUserInDb,
  checkUserExists,
};

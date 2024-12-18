// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

//Validating Signup Request Body
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.')
    .custom(async (email) => {
      const user = await User.findOne({ where: { email } });
      if (user) {
        throw new Error('This email is already associated with an account.');
      }
    }),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 5 })
      .withMessage('Please provide a username with at least 5 characters.')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/) 
      .withMessage('Username must contain at least one number.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('First name is required.')
      .matches(/^[A-Za-z]+$/) 
      .withMessage('First name must contain only letters.'),
    
    check('lastName')
      .exists({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Last name is required.')
      .matches(/^[A-Za-z]+$/) 
      .withMessage('Last name must contain only letters.'),
      check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });
  
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.status(201).json({
        user: safeUser
      });
    }
  );
module.exports = router;
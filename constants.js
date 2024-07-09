// constants/config.js
require('dotenv').config();

const config = {
  API_URL: process.env.API_URL,
  COOKIE: process.env.COOKIE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_TO: 'harshalpatil_21129@aitpune.edu.in',
  EMAIL_CC: ['shantanurajmane_22992@aitpune.edu.in']
};

module.exports = config;

const axios = require('axios');
const fs = require('fs');
const nodemailer = require('nodemailer');
const config = require('./constants');

require('dotenv').config();

const { API_URL, COOKIE, EMAIL_USER, EMAIL_PASS, EMAIL_TO } = config;

let axiosConfig = {
  method: 'get',
  maxBodyLength: Infinity,
  url: API_URL,
  headers: {
    'Cookie': COOKIE
  }
};


const previousDataFile = 'previousData.json';

const loadPreviousData = () => {
  if (fs.existsSync(previousDataFile)) {
    const data = fs.readFileSync(previousDataFile);
    return JSON.parse(data);
  }
  return null;
};

const saveCurrentData = (data) => {
  fs.writeFileSync(previousDataFile, JSON.stringify(data, null, 2));
};

async function runQuery() {
  try {
    const response = await axios.request(axiosConfig);
    const result = response.data[0].result.data.notices;

    const previousData = loadPreviousData();

    if (JSON.stringify(previousData) !== JSON.stringify(result)) {
      let newTitles;
      if(previousData === null){
          newTitles = result.map(notice => notice.title);
      }else{
          const newNotices = result.filter(currentNotice => {
              return !previousData.some(previousNotice => previousNotice.id === currentNotice.id);
          });
          newTitles = newNotices.map(notice => notice.title);
      }

      await sendNotification(newTitles);
      saveCurrentData(result);
    } else {
      console.log('No changes in data.');
    }
  } catch (error) {
    console.error('Error running query:', error);
  }
}

async function sendNotification(titles) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  const emailBody = `
    <h1>New Notices Update</h1>
    <p>Here are the new notices:</p>
    <ul>
      ${titles.map(title => `<li>${title}</li>`).join('')}
    </ul>
  `;

  let mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_TO,
    subject: 'New Notices Update',
    html: emailBody
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

runQuery();

import axios from 'axios';
import fs from 'fs';
import moment from 'moment-timezone';
import chalk from 'chalk';
import express from 'express';

const credentials = [
  { username: 'OK2362348', merchantcode: '779449717442591932362348OKCTCEAB6C2F70C7944A77A9F462D0CBABAA', name: 'Ridwan'}, // Elzy
  { username: 'OK2361626', merchantcode: '771833317439413652361626OKCT409AF42BB29805AEE8C9D0517DDBE24E', name: 'Ghofar' }, // Canny
  { username: 'OK2376343', merchantcode: '355903817442636252376343OKCT637349CFD3243DCDC2CFE7B9E4B6283F', name: 'Sakura'}, // Lau Store
  { username: 'OK1666484', merchantcode: '863463217401195201666484OKCT0C35E392D85B6D4587E5D4153963E8B7', name: 'Roy' }, // 
  { username: 'OK2248107', merchantcode: '471895917383232572248107OKCTA9CBDA4CE9E1E4B73E11DF8DACF26809', name: 'Azumi'},
  { username: 'OK2246540', merchantcode: '669040117377193032246540OKCTEC2622AB8B400DEDD09F773150DAF3A8', name: 'Jeci'},
];

let currentIndex = 0;

const app = express();
const port = process.env.PORT || 3000;

async function fetch() {
  const { username, merchantcode } = credentials[currentIndex];
  try {
    const response = await axios.get(`https://gateway.okeconnect.com/api/mutasi/qris/${username}/${merchantcode}`);
    const data = response.data;
    const fileName = `mutasi_${currentIndex + 1}.json`;
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

    const currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    console.log(
      chalk.green.bold('INFO ') +
      chalk.green.bold(`[`) +
      chalk.white.bold(`${currentTime}`) +
      chalk.green.bold(`]: `) +
      chalk.cyan(`Data saved to ${fileName}`)
    );
  } catch (error) {
    console.error(chalk.red(`Error fetching for ${username}:`, error));
  }

  currentIndex = (currentIndex + 1) % credentials.length;
  setTimeout(fetch, 10000); // 10 detik interval
}

fetch();

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.get('/mutasi/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 1 && id <= 6) {
    const filePath = `${process.cwd()}/mutasi_${id}.json`;
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  } else {
    res.status(400).send('Invalid ID. Use 1 to 6.');
  }
});

app.listen(port, () => {
  console.log(chalk.green(`Server berjalan di port ${port}`));
});

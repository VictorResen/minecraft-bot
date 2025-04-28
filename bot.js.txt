import pkgBot from 'mineflayer';
const { createBot } = pkgBot;

import pkg from 'mineflayer-pathfinder';
const { pathfinder, Movements, goals } = pkg;

import { Vec3 } from 'vec3'; // Til position preview

import express from 'express';
const app = express();

const bot = createBot({ 
  host: 'MosedeGernik.aternos.me',
  port: 25565,
  username: '!PreviewBot', 
});

bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
  console.log('✅ Bot is online og klar til ballade!');

  // Lav "preview" — viser hvor botten står
  setInterval(() => {
    const pos = bot.entity.position;
    console.log(`📍 Bot Position: X=${pos.x.toFixed(2)} Y=${pos.y.toFixed(2)} Z=${pos.z.toFixed(2)}`);
  }, 5000); // Hver 5. sekund
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return; // Gider ikke snakke med sig selv

  if (message === '!pos') {
    const pos = bot.entity.position;
    bot.chat(`Yo ${username}, jeg står her: X=${Math.floor(pos.x)}, Y=${Math.floor(pos.y)}, Z=${Math.floor(pos.z)} 📍`);
  }

  if (message.startsWith('!goto ')) {
    const args = message.split(' ');
    if (args.length !== 4) {
      bot.chat('Bro skriv det rigtigt: !goto <x> <y> <z> 😤');
      return;
    }
    const [x, y, z] = args.slice(1).map(Number);
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      bot.chat('Bro, tal skal være tal... du er cooked 😂');
      return;
    }

    const goal = new goals.GoalBlock(x, y, z);
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(goal);
    bot.chat(`Alright G, på vej til ${x} ${y} ${z} 🚶‍♂️💨`);
  }
});

bot.on('error', (err) => {
  console.log('💥 Fejl:', err);
});

bot.on('end', () => {
  console.log('😵‍💫 Botten blev kicked... prøver igen om 10 sek.');
  setTimeout(() => bot.connect(), 10000);
});

app.get('/', (req, res) => {
  res.send('🚀 Botten kører G! Alt er fire!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Webserver online på port ${PORT}`);
});

const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const mcDataLoader = require('minecraft-data')

// Opretter botten
const bot = mineflayer.createBot({
  host: 'MosedeGernik.aternos.me', // DIN SERVER URL
  username: 'dinbotnavn' // ÆNDRE BOT NAVN HER
})

// Vent på, at botten er spawnet
bot.once('spawn', () => {
  // Henter den rigtige mcData baseret på versionen
  const mcData = mcDataLoader(bot.version)
  
  // Loader pathfinder plugin
  bot.loadPlugin(pathfinder)

  // Skaber movement data baseret på mcData
  const defaultMove = new Movements(bot, mcData)
  bot.pathfinder.setMovements(defaultMove)

  console.log("✅ Bot er klar G!")
  
  // Eksempel på, at botten følger en spiller (eller andet mål)
  const target = bot.players['somePlayer'] // Skift 'somePlayer' med navnet på en spiller
  if (target) {
    bot.pathfinder.setGoal(new goals.GoalFollow(target.entity, 1)) // Følg spilleren med 1 blok afstand
  }
})

// Hvis botten mister forbindelse til serveren
bot.on('end', () => {
  console.log('Bot lost connection!')
})

// Hvis der er en fejl med botten
bot.on('error', (err) => {
  console.log('Bot encountered an error:', err)
})

// Når botten er offline (disconnectet)
bot.on('offline', () => {
  console.log('Bot is offline!')
})

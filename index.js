const TelegramBot = require("node-telegram-bot-api")

const token = process.env.BOT_TOKEN

const bot = new TelegramBot(token, { polling: true })

// Simple in-memory user data (resets on restart)
let userData = {}

// ===================== START =====================
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(
        chatId,
        `👋 Welcome ${msg.from.first_name}!\n\nI am Riddleman's Bot 🤖\nUse /help to see commands.`
    )
})

// ===================== HELP =====================
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `📌 Commands List:\n\n/start - Start bot\n/help - Show commands\n/age 18 - Check age status\n/birthyear 2005 - Calculate your age\n/setname John - Save your name\n/riddle - Play a game`
    )
})

// ===================== AGE COMMAND =====================
bot.onText(/\/age (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const age = parseInt(match[1])

    if (isNaN(age)) {
        return bot.sendMessage(chatId, "❌ Example: /age 18")
    }

    if (age >= 18) {
        bot.sendMessage(chatId, `✅ You are ${age}. You are an adult.`)
    } else {
        bot.sendMessage(chatId, `🧒 You are ${age}. You are a kid.`)
    }
})

// ===================== BIRTH YEAR =====================
bot.onText(/\/birthyear (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const birthYear = parseInt(match[1])
    const currentYear = new Date().getFullYear()

    if (isNaN(birthYear)) {
        return bot.sendMessage(chatId, "❌ Example: /birthyear 2005")
    }

    if (birthYear > currentYear) {
        return bot.sendMessage(chatId, "❌ Invalid year.")
    }

    const age = currentYear - birthYear

    if (age >= 18) {
        bot.sendMessage(chatId, `📅 You are ${age} years old.\n✅ Adult`)
    } else {
        bot.sendMessage(chatId, `📅 You are ${age} years old.\n🧒 Kid`)
    }
})

// ===================== SET NAME =====================
bot.onText(/\/setname (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const name = match[1]

    userData[chatId] = userData[chatId] || {}
    userData[chatId].name = name

    bot.sendMessage(chatId, `👤 Name saved as: ${name}`)
})

// ===================== RIDDLE GAME =====================
bot.onText(/\/riddle/, (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, "🧠 Riddle: What has keys but can't open locks?")

    bot.once("message", (answerMsg) => {
        if (answerMsg.chat.id !== chatId) return

        const answer = answerMsg.text.toLowerCase()

        if (answer.includes("keyboard")) {
            bot.sendMessage(chatId, "🎉 Correct!")
        } else {
            bot.sendMessage(chatId, "❌ Wrong answer! It was: Keyboard")
        }
    })
})

require("dotenv").config()

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const fs = require("fs")
const pino = require("pino")
const readline = require("readline")

const PREFIX = process.env.PREFIX || "."
const OWNER = process.env.OWNER || "unknown"

// ------------------- LOAD PLUGINS -------------------
const plugins = new Map()

function loadPlugins() {
  plugins.clear()
  const files = fs.readdirSync("./plugins").filter(f => f.endsWith(".js"))

  for (let file of files) {
    const plugin = require(`./plugins/${file}`)
    if (plugin?.name && plugin?.run) {
      plugins.set(plugin.name, plugin)
    }
  }
}

loadPlugins()

// ------------------- MENU DESIGN -------------------
function getMenu() {
  return `
╭══〘〘 𝗥𝗜𝗗𝗗𝗟𝗘 𝗠𝗔𝗡 𝗕𝗢𝗧 〙〙═⊷
│↠👤 ᴜsᴇʀ: Riddle Man
│↠🤖 ʙᴏᴛ: Riddle Bot
│↠✒️ ᴘʀᴇғɪx: [ ${PREFIX} ]
│↠🧩 ᴄᴍᴅs: ${plugins.size}
│↠⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: Riddle Man Tech
╰═════════════════⊷

╭─「 📁 *COMMANDS* 」
${[...plugins.keys()].map(cmd => `│  ◈  ${PREFIX}${cmd}`).join("\n")}
╰═════════════════⊷
`
}

// ------------------- BOT START -------------------
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false
  })

  // ------------------- PAIRING CODE -------------------
  if (!sock.authState.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question("📱 Enter your WhatsApp number: ", async (num) => {
      try {
        const code = await sock.requestPairingCode(num)
        console.log("\n🔑 YOUR PAIRING CODE:", code)
        console.log("👉 Enter this code in WhatsApp > Linked Devices\n")
      } catch (e) {
        console.log("Error generating pairing code:", e)
      }
      rl.close()
    })
  }

  sock.ev.on("creds.update", saveCreds)

  // ------------------- MESSAGE HANDLER -------------------
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const sender = msg.key.remoteJid
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if (!text.startsWith(PREFIX)) return

    const args = text.slice(PREFIX.length).trim().split(" ")
    const command = args.shift().toLowerCase()

    // MENU COMMAND
    if (command === "menu" || command === "help") {
      return sock.sendMessage(sender, { text: getMenu() })
    }

    // PLUGIN SYSTEM
    const plugin = plugins.get(command)
    if (plugin) {
      try {
        await plugin.run(sock, sender, args, msg)
      } catch (err) {
        console.log(err)
        sock.sendMessage(sender, { text: "❌ Error running command" })
      }
    }
  })

  // ------------------- CONNECTION UPDATE -------------------
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode

      if (reason !== DisconnectReason.loggedOut) {
        startBot()
      }
    }

    if (connection === "open") {
      console.log("✅ Bot Connected Successfully")
    }
  })
}

startBot()
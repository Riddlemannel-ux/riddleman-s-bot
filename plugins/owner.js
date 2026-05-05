module.exports = {
  name: "owner",

  run: async (sock, sender, args) => {

    const OWNER = "2348154753618@s.whatsapp.net"

    // STRICT OWNER CHECK
    if (sender !== OWNER) {
      return sock.sendMessage(sender, { text: "❌ Owner only command." })
    }

    const cmd = (args[0] || "").toLowerCase()
    const value = args.slice(1).join(" ").trim()

    const reply = (text) => sock.sendMessage(sender, { text })

    const actions = {

      // ───── CORE SYSTEM ─────
      setbotname: () => {
        if (!value) return reply("❌ Usage: .owner setbotname <name>")
        return reply(`🤖 Bot name set to: ${value}`)
      },

      setownername: () => {
        if (!value) return reply("❌ Usage: .owner setownername <name>")
        return reply(`👑 Owner name updated to: ${value}`)
      },

      setownernumber: () => {
        if (!value) return reply("❌ Usage: .owner setownernumber <number>")
        return reply(`📱 Owner number set to: ${value}`)
      },

      setprefix: () => {
        if (!value) return reply("❌ Usage: .owner setprefix <symbol>")
        return reply(`⚙️ Prefix changed to: ${value}`)
      },

      setmode: () => {
        if (!value) return reply("❌ Usage: .owner setmode <public/private>")
        return reply(`🔄 Mode switched to: ${value}`)
      },

      restart: async () => {
        await reply("♻ Restarting bot...")
        setTimeout(() => process.exit(0), 1200)
      },

      update: () => reply("⬆ Bot update triggered"),

      save: () => reply("💾 Data saved"),

      // ───── BLOCK SYSTEM ─────
      block: () => {
        if (!value) return reply("❌ Usage: .owner block <number>")
        return reply(`🚫 Blocked: ${value}`)
      },

      unblock: () => {
        if (!value) return reply("❌ Usage: .owner unblock <number>")
        return reply(`✅ Unblocked: ${value}`)
      },

      blocklist: () => reply("📋 Fetching block list..."),

      // ───── SUDO SYSTEM ─────
      setsudo: () => {
        if (!value) return reply("❌ Usage: .owner setsudo <number>")
        return reply(`🔑 Sudo added: ${value}`)
      },

      delsudo: () => {
        if (!value) return reply("❌ Usage: .owner delsudo <number>")
        return reply(`🗑 Sudo removed: ${value}`)
      },

      getsudo: () => reply("📌 Listing sudo users..."),
      resetsudo: () => reply("♻ Sudo reset done"),

      // ───── AUTO SYSTEM ─────
      autobio: () => reply("🤖 AutoBio toggled"),
      autoread: () => reply("👁 AutoRead toggled"),
      autoreadstatus: () => reply("📊 AutoReadStatus toggled"),
      autoreact: () => reply("⚡ AutoReact toggled"),

      // ───── SETTINGS ─────
      getsetting: () => reply("⚙️ Fetching settings..."),
      setsetting: () => reply("⚙️ Setting updated"),
      resetsetting: () => reply("♻ Settings reset"),
      resetallsettings: () => reply("♻ All settings reset"),

      // ───── INFO ─────
      userinfo: () => reply(`👤 User: ${sender}`),
      jid: () => reply(`📎 JID: ${sender}`),
      owner: () => reply("👑 You are the owner")
    }

    // ───── DEFAULT MENU ─────
    if (!cmd) {
      return reply(`
👑 OWNER COMMANDS

Example:
.owner setbotname Riddle Bot
.owner setprefix .
.owner restart
.owner block number
.owner setsudo number

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀɪᴅᴅʟᴇ ᴍᴀɴ
`)
    }

    if (actions[cmd]) {
      return actions[cmd]()
    }

    return reply(`❌ Unknown owner command: ${cmd}`)
  }
}
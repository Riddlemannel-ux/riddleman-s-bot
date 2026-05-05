const fs = require("fs")

module.exports = {
  name: "menu",
  run: async (sock, sender, args) => {

    const files = fs.readdirSync("./plugins").filter(f => f.endsWith(".js"))

    let list = ""

    for (let file of files) {
      const plugin = require(`./${file}`)
      if (plugin.name) {
        list += `│  ◈  .${plugin.name}\n`
      }
    }

    const menu = `
╭══〘 𝗥𝗜𝗗𝗗𝗟𝗘 𝗠𝗔𝗡 𝗕𝗢𝗧 〙═⊷
│↠🤖 Bot Menu
│↠📦 Total Cmds: ${files.length}
├─────────────────
${list}
╰═════════════════⊷

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀɪᴅᴅʟᴇ ᴍᴀɴ
`

    await sock.sendMessage(sender, { text: menu })
  }
}
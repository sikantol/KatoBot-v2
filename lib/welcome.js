const fs = require('fs-extra')
	
module.exports = welcome = async (kato, event) => {
	const welkom = JSON.parse(fs.readFileSync('./lib/database/welcome.json'))
	const isWelkom = welkom.includes(event.chat)
    try {
        if (event.action == 'add' && isWelkom) {
            const gChat = await kato.getChatById(event.chat)
            const pChat = await kato.getContact(event.who)
            const { contact, groupMetadata, name } = gChat
            const pepe = await kato.getProfilePicFromServer(event.who)
            const capt = `Halo @${event.who.replace(
              "@c.us",
              ""
            )} 👋\nSelamat datang di *Grup ${name}*\n═══════════════════\nSemoga betah ya 😉\n═══════════════════\n`;
            if (pepe == '' || pepe == undefined) {
		var pfp = "https://i.ibb.co/z4dnf5L/welcome.jpg";
	} else {
		var pfp = pepe
	     }
                await kato.sendFileFromUrl(event.chat, pfp, 'profile.jpg', capt)
            }
        } catch (err) {
            console.log(err)
        }
        }
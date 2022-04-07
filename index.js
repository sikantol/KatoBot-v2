const { create, vf } = require('@open-wa/wa-automate')
const { color, options } = require('./function')
const left = require('./lib/left')
const welcome = require('./lib/welcome')
const express = require('express')
const app = express()
const PORT = process.env.PORT
const figlet = require('figlet')
const fs = require('fs-extra')
const HandleMsg = require('./HandleMsg')

const start = async (kato = new kato()) => {
    console.log(color('------------------------------------------------------------------------', 'white'))
    console.log(color(figlet.textSync('KATO BOT', { font: 'Ghost', horizontalLayout: 'default' })))
    console.log(color('------------------------------------------------------------------------', 'white'))
    console.log(color('CREATOR: ', 'aqua'), color('4ndrexyz', 'magenta'))
    console.log(color('BOT NAME: ', 'aqua'), color('KATO BOT Online!', 'magenta'))
    console.log(color('VERSION: ', 'aqua'), color('0.2.1', 'magenta'))
    kato.onStateChanged((state) => {
        console.log(color('-> [STATE]'), state)
        if (state === 'CONFLICT') kato.forceRefocus()
        if (state === 'UNPAIRED') kato.forceRefocus()


        app.get('/', (req, res) => res.status(200).send('Kato Bot'))
        const PORT = process.env.PORT || 8080 || 5000 || 3000
        app.listen(PORT, () => {
            console.log(color('App is Running!', 'yellow'))
        })
    })

    kato.onAddedToGroup(async (chat) => {
        await kato.sendText(chat.groupMetadata.id, 'Terima kasih sudah memasukkan Kato Bot kedalam grup')
        await kato.leaveGroup(chat.groupMetada.id)
    })

    kato.onGlobalParticipantsChanged((async (heuh) => {
        await welcome(kato, heuh)
        left(kato, heuh)
    }))

    kato.onMessage((message) => {
        HandleMsg(kato, message)
    })

    kato.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await kato.sendText(callData.peerJid, 'Maaf Kato Bot tidak bisa menerima panggilan.\n~ Kato Bot')
            .then(async () => {
                // bot akan memblock nomor itu
                await kato.contactBlock(callData.peerJid)
            })
    })
}
create(options(start))
    .then((kato) => start(kato))
    .catch((err) => console.error(err))
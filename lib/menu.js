const fs = require("fs-extra");

/* Gatau kenapa yang list block sama premium kebalik, awokawok */

const help = (prefix, jame, betime, blockNumber, prem, banned, cts, waver) => {
  return `
╭──────【 INFORMATION 】
│
│⇒ Tanggal  : *${betime}*
│⇒ Waktu    : *${jame}*
│⇒ Premium  : *${blockNumber.length} User*
│⇒ Banned   : *${banned.length} User*
│⇒ Block    : *${prem.length} User*
│⇒ Runtime  : *${cts}*
│⇒ Versi WA : *${waver}*
│
╰──────

║▌║█║▌│║▌║▌█

╭──────【 FUN 】
│
│⇒ ${prefix}stc
│⇒ ${prefix}sfull
│⇒ ${prefix}autostik
│⇒ ${prefix}attp
│⇒ ${prefix}ttp
│⇒ ${prefix}stickergif
│⇒ ${prefix}sgiffull
│⇒ ${prefix}startgif
│⇒ ${prefix}stickergiphy
│⇒ ${prefix}stmg
│⇒ ${prefix}meme
│⇒ ${prefix}quotemaker
│⇒ ${prefix}rate
│⇒ ${prefix}kapan
│⇒ ${prefix}apakah
│⇒ ${prefix}bisakah 
│⇒ ${prefix}zodiak <key>
│⇒ ${prefix}sreddit 
│⇒ ${prefix}resep <key>
│⇒ ${prefix}aiquote
│⇒ ${prefix}doggo
│⇒ ${prefix}quote 
│⇒ ${prefix}tts
│⇒ ${prefix}resi <key>
│⇒ ${prefix}bapakfont
│⇒ ${prefix}howmuch
│⇒ ${prefix}google <key>
│⇒ ${prefix}read
│⇒ ${prefix}santet
│⇒ ${prefix}saylist 
│⇒ ${prefix}addsay
│⇒ ${prefix}say
│⇒ ${prefix}delsay
│⇒ ${prefix}listbacot
│⇒ ${prefix}addbacot
│⇒ ${prefix}bacot
│⇒ ${prefix}delbacot
│⇒ ${prefix}jadian
│⇒ ${prefix}mystat
│⇒ ${prefix}bucin 
│⇒ ${prefix}tahta
│⇒ ${prefix}playstore
│⇒ ${prefix}tebakgambar
│⇒ ${prefix}gsmarena
│⇒ ${prefix}darkjokes
│⇒ ${prefix}trendingtwit  
│⇒ ${prefix}memeindo 
│⇒ ${prefix}iplocation
│⇒ ${prefix}tr
│⇒ ${prefix}afk
│⇒ ${prefix}postig
│⇒ ${prefix}bioskop 
│⇒ ${prefix}infoloker 
│⇒ ${prefix}jadwaltvnow
│⇒ ${prefix}jadwaltv
│⇒ ${prefix}burn
│⇒ ${prefix}readmore
│⇒ ${prefix}givecolor
│⇒ ${prefix}ytplaylist
│⇒ ${prefix}dankmemes
│⇒ ${prefix}mabar
│⇒ ${prefix}jwbmabar
│
╰──────

╭──────【 EDUCATION 】
│
│⇒ ${prefix}infobmkg
│⇒ ${prefix}brainly
│⇒ ${prefix}cerpen
│⇒ ${prefix}translate
│⇒ ${prefix}luassegitiga
│⇒ ${prefix}kelsegitiga
│⇒ ${prefix}kuadrat
│⇒ ${prefix}kubik
│⇒ ${prefix}faktaunik
│⇒ ${prefix}foliokiri
│⇒ ${prefix}foliokanan
│⇒ ${prefix}translate 
│⇒ ${prefix}fakta2
│⇒ ${prefix}wattpadstory
│
╰──────

╭──────【 STALKING 】
│
│⇒ ${prefix}stalktiktok <user>
│⇒ ${prefix}igstalk <user>
│⇒ ${prefix}githubstalk <user>
│
╰──────


╭──────【 DOWNLOAD 】
│
│⇒ ${prefix}ig <url>
│⇒ ${prefix}ig2 <url>
│⇒ ${prefix}postigurl <url>
│⇒ ${prefix}play <url>
│⇒ ${prefix}play2 <url>
│⇒ ${prefix}trendingyt <key>
│⇒ ${prefix}trendmusic <key>
│⇒ ${prefix}trendgaming <key>
│⇒ ${prefix}ytmp3 <url>
│⇒ ${prefix}ytmp4 <url>
│⇒ ${prefix}ytmp4hd <url>
│⇒ ${prefix}tomp3 <url>
│⇒ ${prefix}spotify <key>
│⇒ ${prefix}spotifysearch <key>
│⇒ ${prefix}spotifydown <key>
│⇒ ${prefix}imgtourl <url>
│⇒ ${prefix}happymod <key>
│
╰──────

╭──────【 ANIME & NSFW 】
│
│⇒ ${prefix}kusonime <key>
│⇒ ${prefix}rhug 
│⇒ ${prefix}slap
│⇒ ${prefix}waifu
│⇒ ${prefix}nsfwgif
│⇒ ${prefix}bjgif
│⇒ ${prefix}cumgif
│⇒ ${prefix}kissgif
│⇒ ${prefix}rhentai
│⇒ ${prefix}pussy
│⇒ ${prefix}kodenuklir
│⇒ ${prefix}gifhentai 
│⇒ ${prefix}randomhug
│⇒ ${prefix}baka
│⇒ ${prefix}animeavatar
│⇒ ${prefix}neko
│⇒ ${prefix}randompat
│⇒ ${prefix}wallpaper
│⇒ ${prefix}wallpaper2
│⇒ ${prefix}nekonsfw
│⇒ ${prefix}spank
│⇒ ${prefix}classic
│⇒ ${prefix}kuni
│⇒ ${prefix}trapnime
│⇒ ${prefix}cuddle
│⇒ ${prefix}tickle
│⇒ ${prefix}pokegif
│⇒ ${prefix}feetgif
│⇒ ${prefix}anal
│⇒ ${prefix}sologif
│⇒ ${prefix}ttgif
│⇒ ${prefix}lesbian
│
╰──────

╭──────【 GRUP 】
│
│⇒ ${prefix}listban
│⇒ ${prefix}listblock
│⇒ ${prefix}gcinfo
│⇒ ${prefix}level
│⇒ ${prefix}leaderboard
│⇒ ${prefix}linkgc
│⇒ ${prefix}adminList
│⇒ ${prefix}ownergc
│⇒ ${prefix}me
│
╰──────

╭──────【 OWNER BOT 】
│
│⇒ ${prefix}exec
│⇒ ${prefix}exif
│⇒ ${prefix}eval
│⇒ ${prefix}mute
│⇒ ${prefix}unmute
│⇒ ${prefix}ban <reply>
│⇒ ${prefix}pban <user>
│⇒ ${prefix}punban <user>
│⇒ ${prefix}unban <reply>
│⇒ ${prefix}deleteban
│⇒ ${prefix}speed
│⇒ ${prefix}oaddprem
│⇒ ${prefix}odelprem
│⇒ ${prefix}bc
│⇒ ${prefix}bcgrup
│⇒ ${prefix}leaveall
│⇒ ${prefix}clearall 
│⇒ ${prefix}setstatus
│⇒ ${prefix}setpic
│⇒ ${prefix}screen
│⇒ ${prefix}addcogan
│⇒ ${prefix}addcecan
│⇒ ${prefix}delallstik
│⇒ ${prefix}delallvn
│⇒ ${prefix}delallimg
│⇒ ${prefix}oblock <user>
│⇒ ${prefix}block <user>
│⇒ ${prefix}unblock <user>
│⇒ ${prefix}unblocked <user>
│⇒ ${prefix}deleteleft
│⇒ ${prefix}deletewelcome
│⇒ ${prefix}listleft
│⇒ ${prefix}listwelcome
│
╰──────

╭──────【 ABOUT BOT 】
│
│⇒ ${prefix}botstat
│⇒ ${prefix}ownerbot
│⇒ ${prefix}join <url>
│⇒ ${prefix}reportbug
│⇒ ${prefix}runtime
│⇒ ${prefix}shutdown
│⇒ ${prefix}eval
│⇒ ${prefix}help
│
╰──────

Note: 
Jika bot tidak merespon, kemungkinan 
server error
`;
};
exports.help = help;

const admin = (prefix) => {
  return `

╭──────【 ADMIN ONLY 】
│
│⇒ ${prefix}welcome <on/off> 
│⇒ ${prefix}left
│⇒ ${prefix}add <user>
│⇒ ${prefix}kick <user>
│⇒ ${prefix}pkick <user>
│⇒ ${prefix}promote <user>
│⇒ ${prefix}opromote <user>
│⇒ ${prefix}odemote <user>
│⇒ ${prefix}demote <user>
│⇒ ${prefix}infoall
│⇒ ${prefix}del
│⇒ ${prefix}leveling <on/off> 
│⇒ ${prefix}seticon
│⇒ ${prefix}revoke <url>
│⇒ ${prefix}setgroupname
│⇒ ${prefix}resend
│⇒ ${prefix}edotensei
│⇒ ${prefix}oedotensei <user>
│⇒ ${prefix}nsfw <on/off>
│⇒ ${prefix}kickall ⚠
│
╰──────

Note: 
Jika bot tidak merespon, kemungkinan 
server error
`;
};
exports.admin = admin;

exports.kodebahasa = () => {
  return `
Kode Bahasa : 

Afrikaans: "af",
Albanian: "sq",
Amharic: "am",
Arabic: "ar",
Armenian: "hy",
Azerbaijani: "az",
Basque: "eu",
Belarusian: "be",
Bengali: "bn",
Bosnian: "bs",
Bulgarian: "bg",
Catalan: "ca",
Cebuano: "ceb",
Chichewa: "ny",
Chinese Simplified: "zh-cn",
Chinese Traditional: "zh-tw",
Corsican: "co",
Croatian: "hr",
Czech: "cs",
Danish: "da",
Dutch: "nl",
English: "en",
Esperanto: "eo",
Estonian: "et",
Filipino: "tl",
Finnish: "fi",
French: "fr",
Frisian: "fy",
Galician: "gl",
Georgian: "ka",
German: "de",
Greek: "el",
Gujarati: "gu",
Haitian Creole: "ht",
Hausa: "ha",
Hawaiian: "haw",
Hebrew: "iw",
Hindi: "hi",
Hmong: "hmn",
Hungarian: "hu",
Icelandic: "is",
Igbo: "ig",
Indonesian: "id",
Irish: "ga",
Italian: "it",
Japanese: "ja",
Javanese: "jw",
Kannada: "kn",
Kazakh: "kk",
Khmer: "km",
Korean: "ko",
Kurdish (Kurmanji): "ku",
Kyrgyz: "ky",
Lao: "lo",
Latin: "la",
Latvian: "lv",
Lithuanian: "lt",
Luxembourgish: "lb",
Macedonian: "mk",
Malagasy: "mg",
Malay: "ms",
Malayalam: "ml",
Maltese: "mt",
Maori: "mi",
Marathi: "mr",
Mongolian: "mn",
Myanmar (Burmese): "my",
Nepali: "ne",
Norwegian: "no",
Pashto: "ps",
Persian: "fa",
Polish: "pl",
Portuguese: "pt",
Punjabi: "ma",
Romanian: "ro",
Russian: "ru",
Samoan: "sm",
Scots Gaelic: "gd",
Serbian: "sr",
Sesotho: "st",
Shona: "sn",
Sindhi: "sd",
Sinhala: "si",
Slovak: "sk",
Slovenian: "sl",
Somali: "so",
Spanish: "es",
Sundanese: "su",
Swahili: "sw",
Swedish: "sv",
Tajik: "tg",
Tamil: "ta",
Telugu: "te",
Thai: "th",
Turkish: "tr",
Ukrainian: "uk",
Urdu: "ur",
Uyghur: "ug",
Uzbek: "uz",
Vietnamese: "vi",
Welsh: "cy",
Xhosa: "xh",
Yiddish: "yi",
Yoruba: "yo",
Zulu: "zu"`;
};

exports.kodenuklir = () => {
  return `	
     ● KODE NUKLIR ●
‌229144 253687 238577 236509
‌227675 229085 233245 266177
254351 265855 239842 219847
239749 230566 253104 230185
251974 253091 251489 238030
260614 245023 232887 233547
262158 262870 239312 255129
244530 246963 256050 215459
243725 233770 250704 261819
261830 215658 256404 260028
261789 241254 268580 262407
262252 201814 250193 236036
262889 243933 245697 239750
128983 95364 223815 225080
110332 225767 97247 231139
266116 217037 160657 182439
205089 176495 199121 199425
184068 186615 224644 129479
251524 153374 146499 258212
163532 255244 269825 235914
247103 138365 124624 219718
168941 265918 205995 191390
‌225496 259137 231681 161688
199613 259260 260433 235532 
‌88323 272117 170213 256613
‌258382 224942 258382 224942
     
229144 253687 238577 236509
‌227675 229085 233245 266177
254351 265855 239842 219847
239749 230566 253104 230185
251974 253091 251489 238030
260614 245023 232887 233547
262158 262870 239312 255129
244530 246963 256050 215459
243725 233770 250704 261819
261830 215658 256404 260028
261789 241254 268580 262407
262252 201814 250193 236036
262889 243933 245697 239750
128983 95364  223815 225080
110332 225767 97247 231139
266116 217037 160657 182439
205089 176495 199121 199425
184068 186615 224644 129479
251524 153374 146499 258212
163532 255244 269825 235914
247103 138365 124624 219718
168941 265918 205995 191390
‌225496 259137 231681 161688
‌199613 259260 260433 235532
‌88323 272117 170213 256613`;
};

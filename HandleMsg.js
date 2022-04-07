require("dotenv").config();
const { decryptMedia } = require("@open-wa/wa-automate");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta").locale("id");
const axios = require("axios");
const FormData = require("form-data");
const os = require("os");
const speed = require("performance-now");
const fetch = require("node-fetch");
const chalk = require("chalk");
const translatte = require("translatte");
const ms = require("parse-ms");
const bent = require("bent");
const path = require("path");
const bdr = require("rumus-bdr");
const ffmpeg = require("fluent-ffmpeg");
const canvas = require("canvacord");
const request = require("request-promise");
const emojiUnicode = require("emoji-unicode");
const get = require("got");
const { fetchJson } = require("./utils/fetcher");
const appRoot = require("app-root-path");
const low = require("lowdb");
const google = require("google-it");
const { stdout } = require("process");
const FileSync = require("lowdb/adapters/FileSync");
const db_group = new FileSync(appRoot + "/lib/data/group.json");
const db = low(db_group);
db.defaults({ group: [] }).write();

const { removeBackgroundFromImageBase64 } = require("remove.bg");

const { exec } = require("child_process");

const {
  menuId,
  cekResi,
  urlShortener,
  meme,
  translate,
  getLocationData,
  images,
  resep,
  rugaapi,
  downloader,
  sticker,
  level,
} = require("./lib");

const { stickerburn, stickerlight } = require("./lib/sticker");

const { msgFilter, color, processTime, isUrl, download } = require("./utils");

const { uploadImages, custom, picturemis } = require("./utils/fetcher");

const fs = require("fs-extra");
const banned = JSON.parse(fs.readFileSync("./settings/banned.json"));
// const simi = JSON.parse(fs.readFileSync("./settings/simi.json"));
const ngegas = JSON.parse(fs.readFileSync("./settings/ngegas.json"));
const setting = JSON.parse(fs.readFileSync("./settings/setting.json"));
const _autostiker = JSON.parse(fs.readFileSync("./lib/helper/autostiker.json"));
const _afk = JSON.parse(fs.readFileSync("./lib/database/afk.json"));
const _leveling = JSON.parse(
  fs.readFileSync("./lib/database/group/leveling.json")
);
const _level = JSON.parse(fs.readFileSync("./lib/database/level.json"));
const _nsfw = JSON.parse(fs.readFileSync("./lib/database/group/nsfw.json"));

let dbcot = JSON.parse(fs.readFileSync("./lib/database/bacot.json"));
let dsay = JSON.parse(fs.readFileSync("./lib/database/say.json"));
let left = JSON.parse(fs.readFileSync("./lib/database/left.json"));
let welkom = JSON.parse(fs.readFileSync("./lib/database/welcome.json"));
let antilink = JSON.parse(fs.readFileSync("./lib/helper/antilink.json"));
let prem = JSON.parse(fs.readFileSync("./lib/database/prem.json"));
let muted = JSON.parse(fs.readFileSync("./lib/database/muted.json"));
let liststicker = JSON.parse(fs.readFileSync("./lib/database/liststiker.json"));
let listvn = JSON.parse(fs.readFileSync("./lib/database/listvn.json"));
// let cogann = JSON.parse(fs.readFileSync("./lib/helper/cogan.json"));
// let cecann = JSON.parse(fs.readFileSync("./lib/helper/cecan.json"));
let listimg = JSON.parse(fs.readFileSync("./lib/database/listimage.json"));

let {
  groupLimit,
  memberLimit,
  vhtearkey,
  banChats,
  cakrayp,
  apirey,
  tobzapi,
  lindowapi,
  onlydev,
  hackapi,
  lolhuman,
  bxhunter,
  dapuhyapi,
  paiskey,
  leysapi,
  zekais,
  caliph,
  zenzapi,
  apikeyvinz, //IF YOU HAVE THIS APIKEY, YOU CAN CUSTOM IT!
  authorstc,
  packstc,
} = setting;

const { apiNoBg, apiSimi } = JSON.parse(fs.readFileSync("./settings/api.json"));

function formatin(duit) {
  let reverse = duit.toString().split("").reverse().join("");
  let ribuan = reverse.match(/\d{1,3}/g);
  ribuan = ribuan.join(".").split("").reverse().join("");
  return ribuan;
}

function waktu(seconds) {
  // TOBZ
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " Hari," : " Hari,") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " Jam," : " Jam,") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " Menit," : " Menit,") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " Detik," : " Detik") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const inArray = (needle, haystack) => {
  let length = haystack.length;
  for (let i = 0; i < length; i++) {
    if (haystack[i].id == needle) return i;
  }
  return false;
};

const errorurl = "https://i.ibb.co/kG0syKb/Error-1.jpg";
const errorurl2 = "https://i.ibb.co/Nt571p1/Error2.jpg";

const isMuted = (chatId) => {
  if (muted.includes(chatId)) {
    return false;
  } else {
    return true;
  }
};

function identify(buffer) {
  return new Promise(async (resolve, reject) => {
    const bodyForm = new FormData();
    const pathh = "./audio.mp3";
    bodyForm.append("audio", buffer, "file.mp3");
    bodyForm.append("apikey", `${apikeyvinz}`);
    axios("https://api.zeks.xyz/api/searchmusic", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        ...bodyForm.getHeaders(),
      },
      data: bodyForm,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch(reject);
  });
}

function banChat() {
  if (banChats == true) {
    return false;
  } else {
    return true;
  }
}

var timeStart = Date.now() / 1000;
moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = HandleMsg = async (kato, message) => {
  try {
    const {
      type,
      id,
      fromMe,
      from,
      t,
      sender,
      isGroupMsg,
      chat,
      chatId,
      caption,
      isMedia,
      mimetype,
      quotedMsg,
      quotedMsgObj,
      author,
      mentionedJidList,
    } = message;
    let { body } = message;
    var { name, formattedTitle, gcok } = chat;
    let { pushname, verifiedName, formattedName } = sender;
    pushname = pushname || verifiedName || formattedName; // verifiedName is the name of someone who uses a business account
    const botNumber = (await kato.getHostNumber()) + "@c.us";
    const groupId = isGroupMsg ? chat.groupMetadata.id : "";
    const groupAdmins = isGroupMsg ? await kato.getGroupAdmins(groupId) : "";
    const isGroupAdmins = groupAdmins.includes(sender.id) || false;
    const chats =
      type === "chat"
        ? body
        : type === "image" || type === "video"
        ? caption
        : "";
    const pengirim = sender.id;
    const serial = sender.id;
    const isLevelingOn = isGroupMsg ? _leveling.includes(groupId) : false;
    const isNsfwOn = _nsfw.includes(chatId);
    const betime = moment(t * 1000).format("DD/MM/YY");
    const time = moment(t * 1000).format("DD/MM/YY HH:mm:ss");
    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
    const userId = sender.id.substring(9, 13);
    const blockNumber = await kato.getBlockedIds();
    const groupMembers = isGroupMsg
      ? await kato.getGroupMembersId(groupId)
      : "";
    const GroupLinkDetector = antilink.includes(chatId);

    // Bot Prefix
    const commands = caption || body || "";
    const command = commands.toLowerCase().split(" ")[0] || "";
    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~`,*zxcv!?@#$%^&.\/\\©^]/.test(command)
      ? command.match(/^[!?#$,^.,/\/\\©^]/gi)
      : "-";
    global.prefix;
    body =
      type === "chat" && body.startsWith(prefix)
        ? body
        : (type === "image" || type === "video") &&
          caption &&
          caption.startsWith(prefix)
        ? caption
        : "";
    const arg = body.trim().substring(body.indexOf(" ") + 1);
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const isBlocked = blockNumber.includes(sender.id);
    const isCmd = body.startsWith(prefix);
    const tms = Date.now() / 1000 - timeStart;
    const cts = waktu(tms);
    const waver = await kato.getWAVersion();
    const uaOverride = process.env.UserAgent;
    const url = args.length !== 0 ? args[0] : "";
    const isVideo = type === "video";
    const isQuotedImage = quotedMsg && quotedMsg.type === "image";
    const isQuotedVideo = quotedMsg && quotedMsg.type === "video";
    const isQuotedGif = quotedMsg && quotedMsg.type === "gif";
    const isQuotedAudio = quotedMsg && quotedMsg.type === "audio";
    const isQuotedSticker = quotedMsg && quotedMsg.type === "sticker";
    const isQuotedFile = quotedMsg && quotedMsg.type === "file";
    const reason = q ? q : "Gada";
    const gifcrop = {
      crop: true,
      square: 240,
      fps: 30,
      loop: 0,
      startTime: `00:00:00.0`,
      endTime: `00:00:10.0`,
    };
    const gifxyz = {
      crop: false,
      square: 240,
      fps: 30,
      loop: 0,
      startTime: `00:00:00.0`,
      endTime: `00:00:10.0`,
    };
    const StickerMetadata = {
      author: authorstc,
      pack: packstc,
      keepScale: true,
    };
    const StickerMetadatacrop = {
      author: authorstc,
      pack: packstc,
      keepScale: false,
    };

    // [IDENTIFY]
    const ownerNumber = "6285158599235@c.us";
    const errorImg = "https://i.ibb.co/jknZjDk/Picerror.jpg";
    const isOwnerBot = ownerNumber.includes(pengirim);
    const isOwner = ownerNumber.includes(pengirim);
    const isOwnerB = ownerNumber.includes(pengirim);
    const isBanned = banned.includes(pengirim);
    // const isSimi = simi.includes(chatId);
    const isNgegas = ngegas.includes(chatId);
    const isAutoStikerOn = _autostiker.includes(chat.id);
    const isImage = type === "image";
    const isPrem = prem.includes(pengirim);

    // message cmd
    if (isCmd && !isGroupMsg) {
      console.log(
        color("[EXEC]", "magenta"),
        color(moment(t * 1000).format("DD/MM/YY HH:mm:ss"), "yellow"),
        color(`${command} [${args.length}]`, "aqua"),
        "from",
        color(`${pushname}`, "magenta")
      );
    }
    if (isCmd && isGroupMsg) {
      console.log(
        color("[EXEC]", "magenta"),
        color(moment(t * 1000).format("DD/MM/YY HH:mm:ss"), "yellow"),
        color(`${command} [${args.length}]`, "aqua"),
        "from",
        color(`${pushname}`, "magenta"),
        "in",
        color(name || formattedTitle, "aqua")
      );
    }

    if (chats == "Assalamualaikum") {
      kato.reply(from, "Waalaikumsalam wr wb.", id);
    }
    if (chats == "bot nya jelek") {
      kato.reply(from, "Maaf bot juga robot, jadi terkadang server error", id);
    }
    if (chats == "assalamualaikum") {
      kato.reply(from, "Waalaikumsalam wr wb.", id);
    }
    if (mentionedJidList.includes(ownerNumber)) {
      /*Y'ALL CAN CUSTOM THIS WHATEVER YOU WANT!*/
      const sends = sender.id;
      const ras = await kato.getProfilePicFromServer(sends);
      if (ras == undefined) {
        var pfp = "https://i.ibb.co/r27yhDZ/Error3.png";
      } else {
        var pfp = ras;
      }
      kato
        .reply(from, "Sebentar Andre lagi slow respon\n\n ~Kato Bot", id)
        .then(() => {
          kato.sendFileFromUrl(
            ownerNumber,
            pfp,
            "img.jpg",
            `*Note Call*\n\n*From:* ${pushname}\n*Group:* ${name}\n*Nomor:* wa.me/${serial.replace(
              /@c.us/g,
              ""
            )}\n*Text:* ${chats}`
          );
        });
    }

    // ROLE (Change to what you want, or add) and you can change the role sort based on XP.
    const levelRole = level.getLevelingLevel(sender.id, _level);
    var role = "Copper V";
    if (levelRole >= 5) {
      role = "Copper IV";
    } else if (levelRole >= 10) {
      role = "Copper III";
    } else if (levelRole >= 15) {
      role = "Copper II";
    } else if (levelRole >= 20) {
      role = "Copper I";
    } else if (levelRole >= 25) {
      role = "Silver V";
    } else if (levelRole >= 30) {
      role = "Silver IV";
    } else if (levelRole >= 35) {
      role = "Silver III";
    } else if (levelRole >= 40) {
      role = "Silver II";
    } else if (levelRole >= 45) {
      role = "Silver I";
    } else if (levelRole >= 50) {
      role = "Gold V";
    } else if (levelRole >= 55) {
      role = "Gold IV";
    } else if (levelRole >= 60) {
      role = "Gold III";
    } else if (levelRole >= 65) {
      role = "Gold II";
    } else if (levelRole >= 70) {
      role = "Gold I";
    } else if (levelRole >= 75) {
      role = "Platinum V";
    } else if (levelRole >= 80) {
      role = "Platinum IV";
    } else if (levelRole >= 85) {
      role = "Platinum III";
    } else if (levelRole >= 90) {
      role = "Platinum II";
    } else if (levelRole >= 95) {
      role = "Platinum I";
    } else if (levelRole > 100) {
      role = "Exterminator";
    }

    const mess = {
      grouponly: "Fitur ini hanya bisa digunakan didalam Grup!",
      restmes: "Rest API sedang error",
      sendfileaudio: "*_Tunggu sebentar, audio sedang dikirim_*",
      sendfilevideo: "*_Tunggu sebentar, video sedang dikirim_*",
      wait: "_Tunggu ya, masih loading nih..._",
      nsfwnoton: "Fitur NSFW belum aktif pada chat ini",
      nsfwalready: "Fitur NSFW sudah aktif sebelumnya di grup ini",
      nsfwoff: "Fitur NSFW berhasil dimatikan",
      nsfwon: "Fitur NSFW berhasil diaktifkan",
      prem: `Command Premium!\nHalo ${pushname} Mau jadi user premium ga ? \n\n cuman *10k* = BISA MENGAKSES SEMUA FITUR\n\nJika kamu berminat, silahkan chat pada Owner saya\n\nwa.me/${ownerNumber.replace(
        "@c.us",
        ""
      )}\n~ Kato Bot`,
      error: {
        St: `[❗] Kirim gambar dengan caption *${prefix}sticker* atau tag gambar yang sudah dikirim`,
        Ti: `[❗] Replay sticker dengan caption *${prefix}stickertoimg* atau tag sticker yang sudah dikirim`,
        Qm: "[❗] Terjadi kesalahan, mungkin themenya tidak tersedia!",
        Yt3: "[❗] Terjadi kesalahan, tidak dapat meng konversi ke mp3!",
        Yt4: "[❗] Terjadi kesalahan, mungkin error di sebabkan oleh sistem.",
        Ig: "[❗] Terjadi kesalahan, mungkin karena akunnya private",
        Ki: "[❗] Bot tidak bisa mengeluarkan Admin group!",
        Sp: "[❗] Bot tidak bisa mengeluarkan Admin",
        Ow: "[❗] Bot tidak bisa mengeluarkan Owner",
        Bk: "[❗] Bot tidak bisa memblockir Owner",
        Ad: "[❗] Tidak dapat menambahkan target, mungkin karena di private",
        Iv: "[❗] Link yang anda kirim tidak valid!",
      },
    };

    if (listvn.includes(chats))
      try {
        const getvn = await fs.readFileSync("./media/audio/" + chats + ".mp3", {
          encoding: "base64",
        });
        kato.sendAudio(
          from,
          `data:audio/mp3;base64,${getvn.toString("base64")}`,
          id
        );
      } catch {
        kato.reply(from, "Maaf, sistem error", id);
      }

    if (listimg.includes(chats))
      try {
        const getimg = await fs.readFileSync(
          "./media/image/" + chats + ".jpg",
          { encoding: "base64" }
        );
        await kato.sendFile(
          from,
          `data:image/jpg;base64,${getimg.toString("base64")}`,
          "",
          "",
          id
        );
      } catch {
        kato.reply(from, "Maaf,sistem error", id);
      }

    if (liststicker.includes(chats))
      try {
        const getstick = await fs.readFileSync(
          "./media/pic/sticker/" + chats + ".jpeg",
          { encoding: "base64" }
        );
        await kato.sendImageAsSticker(
          from,
          `data:image/jpeg;base64,${getstick.toString("base64")}`,
          { author: "4ndrexyz", pack: chats, keepScale: true }
        );
      } catch {
        kato.reply(from, "Maaf, sistem error", id);
      }

    const addAfk = (userId, time) => {
      let obj = { id: `${userId}`, time: `${time}`, reason: `${reason}` };
      _afk.push(obj);
      fs.writeFileSync("./lib/database/afk.json", JSON.stringify(_afk));
    };

    const getAfk = (userId) => {
      let isAfk = false;
      Object.keys(_afk).forEach((i) => {
        if (_afk[i].id === userId) {
          isAfk = true;
        }
      });
      return isAfk;
    };

    const getAfkReason = (userId) => {
      let position = false;
      Object.keys(_afk).forEach((i) => {
        if (_afk[i].id === userId) {
          position = i;
        }
      });
      if (position !== false) {
        return _afk[position].reason;
      }
    };

    const getAfkTime = (userId) => {
      let position = false;
      Object.keys(_afk).forEach((i) => {
        if (_afk[i].id === userId) {
          position = i;
        }
      });
      if (position !== false) {
        return _afk[position].time;
      }
    };

    const getAfkId = (userId) => {
      let position = false;
      Object.keys(_afk).forEach((i) => {
        if (_afk[i].id === userId) {
          position = i;
        }
      });
      if (position !== false) {
        return _afk[position].id;
      }
    };

    const isAfkOn = getAfk(sender.id);
    if (isGroupMsg) {
      const checking = getAfk(sender.id);
      for (let ment of mentionedJidList) {
        if (getAfk(ment)) {
          const getId = getAfkId(ment);
          const getReason = getAfkReason(getId);
          const getTime = getAfkTime(getId);
          await kato.reply(
            from,
            `*「 MODE AFK 」*\n\n Orangnya lagi afk, jangan diganggu!\n➸ *Alasanya*: ${getReason}\n➸ *Sejak*: ${getTime}`,
            id
          );
          kato.sendText(userId, `Seseorang telah tag anda bernama @{pushname}`);
        }
      }
      if (checking && !isCmd) {
        _afk.splice(sender.id, 1);
        fs.writeFileSync("./lib/database/afk.json", JSON.stringify(_afk));
        kato.sendTextWithMentions(
          from,
          `*@${sender.id.replace(/@c.us/g, "")} SEKARANG TIDAK AFK*`
        );
      }
    }

    //fitur anti link
    if (isGroupMsg && GroupLinkDetector && !isGroupAdmins && !isOwner) {
      if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
        const inviteLink1 = await kato.getGroupInviteLink(groupId);
        if (chats.includes(inviteLink1))
          return kato.reply(
            from,
            `Ini Link Group *${name}* Kamu tidak akan dikick`,
            id
          );
        const check = await kato.inviteInfo(chats);
        if (!check) {
          return;
        } else {
          kato
            .reply(
              from,
              "*[GROUP LINK DETECTOR]*\nKarena kamu mengirimkan link grup chat, maka kamu di kick dari grup, wkwkw",
              id
            )
            .then(() => {
              kato.removeParticipant(groupId, sender.id);
            });
        }
      }
    }

    // Leveling [BETA] by Slavyan
    if (isGroupMsg && !level.isGained(sender.id) && !isBanned && isLevelingOn) {
      try {
        level.addCooldown(sender.id);
        const currentLevel = level.getLevelingLevel(sender.id, _level);
        const amountXp = Math.floor(Math.random() * (15 - 25 + 1) + 15);
        const requiredXp =
          5 * Math.pow(currentLevel, 2) + 50 * currentLevel + 100;
        level.addLevelingXp(sender.id, amountXp, _level);
        if (requiredXp <= level.getLevelingXp(sender.id, _level)) {
          level.addLevelingLevel(sender.id, 1, _level);
          const userLevel = level.getLevelingLevel(sender.id, _level);
          const fetchXp = 5 * Math.pow(userLevel, 2) + 50 * userLevel + 100;
          await kato.reply(
            from,
            `*── 「 LEVEL UP! 」 ──*\n\n- *Name*: ${pushname}\n- *XP*: ${level.getLevelingXp(
              sender.id,
              _level
            )} / ${fetchXp}\n- *Level*: ${currentLevel} -> ${level.getLevelingLevel(
              sender.id,
              _level
            )} 🆙 \n- *Role*: *${role}*`,
            id
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (isAutoStikerOn && isMedia && isImage) {
      const mediaData = await decryptMedia(message, uaOverride);
      const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
        "base64"
      )}`;
      await kato.sendImageAsSticker(from, imageBase64, StickerMetadata);
      console.log(
        color(
          `Sticker processed for ${processTime(t, moment())} seconds`,
          "aqua"
        )
      );
    }

    // Picture KATO BOT
    const menupict = "https://i.ibb.co/w6kckG1/pic.jpg";

    // Kerang Menu
    const apakah = ["Ya", "Tidak", "Coba Ulangi"];

    const bisakah = ["Bisa", "Tidak Bisa", "Coba Ulangi"];

    const kapan = [
      "1 Minggu lagi",
      "1 Bulan lagi",
      "1 Tahun lagi",
      "100 tahun lagi",
      "gatau",
      "2030",
    ];

    const jwbmabar = [
      "Ora sek",
      "Gaassss lah Ajing",
      "Tidak punya Kuota",
      "Tidak Dulu",
      "Tidak Mood",
      "Ra Mood",
      "Gasss",
      "Sebentar",
      "Gass Login",
    ];

    const rate = [
      "100%",
      "95%",
      "90%",
      "85%",
      "80%",
      "75%",
      "70%",
      "65%",
      "60%",
      "55%",
      "50%",
      "45%",
      "40%",
      "35%",
      "30%",
      "25%",
      "20%",
      "15%",
      "10%",
      "5%",
    ];

    // Filter Banned People
    if (isBanned && isCmd) {
      console.log(
        color("[BAN]", "red"),
        color(moment(t * 1000).format("DD/MM/YY HH:mm:ss"), "yellow"),
        color(`${command} [${args.length}]`, "aqua"),
        "from",
        color(pushname, "magenta"),
        "in",
        color(name || formattedTitle, "aqua")
      );
    }
    if (isBanned && isCmd) {
      return kato.reply(
        from,
        `Maaf *_${pushname}_* anda telah dibanned untuk menggunakan command Kato Bot!`,
        id
      );
    }

    // Filter Blocked People
    if (isBlocked && isCmd) {
      console.log(
        color("[BLOCK]", "red"),
        color(moment(t * 1000).format("DD/MM/YY HH:mm:ss"), "yellow"),
        color(`${chats} [${args.length}]`, "aqua"),
        "from",
        color(pushname, "magenta"),
        "in",
        color(name || formattedTitle, "aqua")
      );
    }

    kato.setPresence(true);

    if (
      (isCmd && isMuted(chatId) && banChat() && !isBlocked && !isBanned) ||
      isOwnerB ||
      isPrem
    ) {
      switch (command) {
        // Menu and TnC
        case prefix + "exif":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh 4ndrexyz!",
              id
            );
          if (args.length == 0)
            return kato.reply(
              from,
              `Usage : ${prefix}exif author|pack\nExample: ${prefix}exif Kato|Bot`,
              id
            );
          const splitauthor = q.split("|")[1];
          const packauthor = q.split("|")[0];
          authorstc = splitauthor;
          packstc = packauthor;
          kato.reply(
            from,
            `Berhasil mengubah pack stiker menjadi ${splitauthor} dan ${packauthor}`,
            id
          );
          break;

        case prefix + "mute":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan didalam Grup!",
              id
            );
          if (!isOwnerB)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          if (isGroupMsg) {
            isMuted(chatId) == true;
            if (muted.includes(chatId))
              return kato.reply(from, "Grup ini sudah dimute sebelumnya", id);
            muted.push(chatId);
            fs.writeFileSync(
              "./lib/database/muted.json",
              JSON.stringify(muted, null, 2)
            );
            kato.reply(from, "Bot telah di mute pada grup ini!", id);
          } else {
            muted.push(chatId);
            fs.writeFileSync(
              "./lib/database/muted.json",
              JSON.stringify(muted, null, 2)
            );
            kato.reply(from, "Bot telah di mute pada grup ini!", id);
          }
          break;

        case prefix + "unmute":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan didalam Grup!",
              id
            );
          if (!isOwnerB)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          if (isGroupMsg) {
            isMuted(chatId) == false;
            let indexsz = muted.indexOf(chatId);
            muted.splice(indexsz, 1);
            fs.writeFileSync(
              "./lib/database/muted.json",
              JSON.stringify(muted, null, 2)
            );
            kato.reply(from, "Bot telah di unmuted pada grup ini!", id);
          } else {
            let indexsz = muted.indexOf(chatId);
            muted.splice(indexsz, 1);
            fs.writeFileSync(
              "./lib/database/muted.json",
              JSON.stringify(muted, null, 2)
            );
            kato.reply(from, "Bot telah di unmuted pada grup ini!", id);
          }
          break;

        case prefix + "private":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh owner Bot!",
              id
            );
          if (setting.banChats === true) return;
          setting.banChats = true;
          banChats = true;
          fs.writeFileSync(
            "./lib/database/setting.json",
            JSON.stringify(setting, null, 2)
          );
          kato.reply(from, "Private Commands has been enable", id);
          break;

        case prefix + "public":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh owner Bot!",
              id
            );
          if (setting.banChats === false) return;
          setting.banChats = false;
          banChats = false;
          fs.writeFileSync(
            "./lib/database/setting.json",
            JSON.stringify(setting, null, 2)
          );
          kato.reply(from, "Public commands has been enable", id);
          break;

        case prefix + "speed":
        case prefix + "ping":
          const loadedMsg = await kato.getAmountOfLoadedMessages();
          const chatIds = await kato.getAllChatIds();
          const groups = await kato.getAllGroups();
          const timestamp = speed();
          const latensi = speed() - timestamp;
          const charged = await kato.getIsPlugged();
          const device = await kato.getMe();
          const deviceinfo = `- Baterai Kamu : ${
            device.battery
          }%\n  ├ Mengisi Daya : ${charged}\n  └ Onlien 24 Jam : ${
            device.is24h
          }\n  ├ Versi OS : ${device.phone.os_version}\n  └ Build Number : ${
            device.phone.os_build_number
          }\n\n _*Jam :*_ ${moment(t * 1000).format("HH:mm:ss")}`;
          kato.sendText(
            from,
            `*Device Info*\n\n${deviceinfo}\n\nPenggunaan RAM: *${(
              process.memoryUsage().heapUsed /
              1024 /
              1024
            ).toFixed(2)}MB / ${Math.round(
              require("os").totalmem / 1024 / 1024
            )}MB*\nCPU: *${
              os.cpus().length
            }*\n\nStatus :\n- *${loadedMsg}* Loaded Messages\n- *${
              groups.length
            }* Group Chats\n- *${
              chatIds.length - groups.length
            }* Personal Chats\n- *${
              chatIds.length
            }* Total Chats\n\nSpeed: ${latensi.toFixed(4)} _Second_`
          );
          break;

        case prefix + "setpic":
          if (!isOwnerB)
            return kato.reply(
              from,
              `Perintah ini hanya bisa di gunakan oleh Owner Bot!`,
              id
            );
          if (isMedia) {
            const mediaData = await decryptMedia(message);
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
              "base64"
            )}`;
            await kato.setProfilePic(imageBase64);
            kato.sendTextWithMentions(
              from,
              `Makasih @${serial} Foto Profilenye..`
            );
          } else if (quotedMsg && quotedMsg.type == "image") {
            const mediaData = await decryptMedia(quotedMsg);
            const imageBase64 = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            await kato.setProfilePic(imageBase64);
            kato.sendTextWithMentions(
              from,
              `Terimakasih @${serial} Foto Profilenya 😘`,
              id
            );
          } else {
            kato.reply(
              from,
              `Wrong Format!\n⚠️ Harap Kirim Gambar Dengan ${prefix}setpic`,
              id
            );
          }
          break;

        case prefix + "help":
          const bots = `Halo ${pushname}, untuk melihat _*command*_ Kato Bot, ketik *${prefix}menu*`;
          await kato.reply(from, bots, id);
          break;

        case prefix + "runtime":
          kato.reply(from, `*Kato Bot telah aktif selama ${cts}*`, id);
          break;

        case prefix + "eval":
        case prefix + "ev":
          if (!isOwner)
            return await kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh Owner!",
              id
            );
          if (!q)
            return await kato.reply(from, "Masukkan kode Javascript!", id);
          try {
            let evaled = await eval(q);
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
          } catch (err) {
            console.error(err);
            kato.reply(from, "Kode Js salah", id);
          }
          break;

        case prefix + "p":
        case prefix + "start":
        case prefix + "menu":
          const jame = moment(t * 1000).format("HH:mm:ss");
          const pictrand = menupict;
          kato
            .sendFileFromUrl(
              from,
              pictrand,
              "image.jpg",
              menuId.help(
                prefix,
                jame,
                betime,
                prem,
                blockNumber,
                banned,
                cts,
                waver
              ),
              id
            )
            .then(() =>
              isGroupMsg && isGroupAdmins
                ? kato.sendText(from, `Menu Admin Grup: *${prefix}menuadmin*`)
                : null
            );
          break;

        case prefix + "menuadmin":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins)
            return kato.reply(from, "Error!, Kamu bukan *Admin Grup* ini", id);
          const php4 = menupict;
          await kato.sendFileFromUrl(
            from,
            php4,
            "image.jpg",
            menuId.admin(prefix),
            id
          );
          break;

        case prefix + "kodebahasa":
          const kodbhs = menuId.kodebahasa();
          kato.reply(from, kodbhs, id, true);
          break;

        case prefix + "kodenuklir":
          const benuk = menuId.kodenuklir();
          await kato.sendText(from, benuk, id, true);
          break;

        case prefix + "rneko":
          kato.reply(from, mess.wait, id);
          axios
            .get(
              `https://api.i-tech.id/anim/nsfwneko?key=6QZWVa-fzRgRY-95xAOH-fspd5y-7eJOkQ`
            )
            .then((res) => {
              kato.sendFileFromUrl(from, res.data.result, "", "", id);
            });
          break;

        // Level
        case prefix + "level":
          if (!isLevelingOn)
            return await kato.reply(
              from,
              "Fitur level belum aktif di grup ini!",
              id
            );
          if (!isGroupMsg)
            return await kato.reply(
              from,
              "Fitur ini hanya bisa digunakan didalam Grup!",
              id
            );
          const userLevel = level.getLevelingLevel(sender.id, _level);
          const userXp = level.getLevelingXp(sender.id, _level);
          const ppLink = await kato.getProfilePicFromServer(serial);
          if (ppLink === "ERROR!") {
            var pepe = errorImg;
          } else {
            pepe = ppLink;
          }
          const requiredXp = 5 * Math.pow(userLevel, 2) + 50 * userLevel + 100;
          const rank = new canvas.Rank()
            .setAvatar(pepe)
            .setLevel(userLevel)
            .setLevelColor("#21FA90", "#21FA90")
            .setRank(Number(level.getUserRank(sender.id, _level)))
            .setCurrentXP(userXp)
            .setOverlay("#000000", 100, false)
            .setRequiredXP(requiredXp)
            .setProgressBar("#21FA90", "COLOR")
            .setBackground("COLOR", "#191923")
            .setUsername(pushname)
            .setDiscriminator(sender.id.substring(6, 10));
          rank
            .build()
            .then(async (buffer) => {
              const imageBase644 = `data:image/png;base64,${buffer.toString(
                "base64"
              )}`;
              await kato.sendImage(from, imageBase644, "rank.png", "", id);
            })
            .catch(async (err) => {
              console.error(err);
              await kato.reply(from, "Error!", id);
            });
          break;

        case prefix + "leveling":
          if (!isGroupMsg)
            return await kato.reply(
              from,
              "Fitur ini hanya bisa digunakan didalam Grup!",
              id
            );
          if (!isGroupAdmins)
            return await kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh Admin Grup!",
              id
            );
          if (args[0] === "on") {
            if (_leveling.includes(groupId))
              return kato.reply(
                from,
                "Fitur level sudah diaktifkan pada grup ini sebelumnya",
                id
              );
            _leveling.push(groupId);
            fs.writeFileSync(
              "./lib/database/group/leveling.json",
              JSON.stringify(_leveling)
            );
            await kato.reply(
              from,
              "Fitur Level berhasil diaktifkan didalam grup ini",
              id
            );
          } else if (args[0] === "off") {
            var thisgroup = _leveling.indexOf(groupId);
            _leveling.splice(thisgroup, 1);
            fs.writeFileSync(
              "./lib/database/group/leveling.json",
              JSON.stringify(_leveling)
            );
            await kato.reply(
              from,
              "Fitur Level berhasil dinonaktifkan didalam grup ini",
              id
            );
          } else {
            await kato.reply(from, "Pilih on atau off ?", id);
          }
          break;

        case prefix + "leaderboard":
          if (!isGroupMsg)
            return await kato.reply(
              from,
              "Fitur ini hanya bisa digunakan didalam Grup!",
              id
            );
          const resp = _level;
          _level.sort((a, b) => (a.xp < b.xp ? 1 : -1));
          let leaderboard = "*──〘 LEADERBOARDS 〙──*\n\n";
          try {
            for (let i = 0; i < 10; i++) {
              var roles = "Copper V";
              if (resp[i].level >= 5) {
                roles = "Copper IV";
              } else if (resp[i].level >= 10) {
                roles = "Copper III";
              } else if (resp[i].level >= 15) {
                roles = "Copper II";
              } else if (resp[i].level >= 20) {
                roles = "Copper I";
              } else if (resp[i].level >= 25) {
                roles = "Silver V";
              } else if (resp[i].level >= 30) {
                roles = "Silver IV";
              } else if (resp[i].level >= 35) {
                roles = "Silver III";
              } else if (resp[i].level >= 40) {
                roles = "Silver II";
              } else if (resp[i].level >= 45) {
                roles = "Silver I";
              } else if (resp[i].level >= 50) {
                roles = "Gold V";
              } else if (resp[i].level >= 55) {
                roles = "Gold IV";
              } else if (resp[i].level >= 60) {
                roles = "Gold III";
              } else if (resp[i].level >= 65) {
                roles = "Gold II";
              } else if (resp[i].level >= 70) {
                roles = "Gold I";
              } else if (resp[i].level >= 75) {
                roles = "Platinum V";
              } else if (resp[i].level >= 80) {
                roles = "Platinum IV";
              } else if (resp[i].level >= 85) {
                roles = "Platinum III";
              } else if (resp[i].level >= 90) {
                roles = "Platinum II";
              } else if (resp[i].level >= 95) {
                roles = "Platinum I";
              } else if (resp[i].level > 100) {
                roles = "Exterminator";
              }
              leaderboard += `${i + 1}. wa.me/${_level[i].id.replace(
                "@c.us",
                ""
              )}\n➸ *XP*: ${_level[i].xp} *Level*: ${
                _level[i].level
              }\n➸ *Role*: ${roles}\n\n`;
            }
            await kato.reply(from, leaderboard, id);
          } catch (err) {
            console.error(err);
            await kato.reply(
              from,
              "Perlu setidaknya *10* user yang memiliki level di database!",
              id
            );
          }
          break;

        case prefix + "tebakgambar":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          try {
            const resp = await axios.get(
              "https://zahirr-web.herokuapp.com/api/kuis/tebakgambar?apikey=zahirgans"
            );
            if (resp.data.error) return kato.reply(from, resp.data.error, id);
            const jwban = `➸ Jawaban : ${resp.data.result.jawaban}`;
            kato.sendFileFromUrl(
              from,
              resp.data.result.images,
              "tebakgambar.jpg",
              "_Silahkan Jawab Maksud Dari Gambar Ini_",
              id
            );
            kato.sendText(from, `30 Detik Lagi...`, id);
            await sleep(10000);
            kato.sendText(from, `20 Detik Lagi...`, id);
            await sleep(10000);
            kato.sendText(from, `10 Detik Lagi...`, id);
            await sleep(10000);
            kato.reply(from, jwban, id);
          } catch (err) {
            console.error(err.message);
            await kato.sendFileFromUrl(
              from,
              errorurl2,
              "error.png",
              "💔️ Maaf, Soal Quiz tidak ditemukan"
            );
          }
          break;

        case prefix + "ownerbot":
        case prefix + "owner":
          await kato.sendContact(from, ownerNumber);
          break;

        case prefix + "wallpaper":
          kato.reply(from, mess.wait, id);
          axios
            .get("https://akaneko-api.herokuapp.com/api/mobileWallpapers")
            .then((res) => {
              kato.sendFileFromUrl(
                from,
                res.data.url,
                "Desktop Wallpaper.jpeg",
                "Enjoy :>",
                id
              );
            });
          break;

        case prefix + "autosticker":
        case prefix + "autostiker":
        case prefix + "autostik":
          if (args.length == 0)
            return kato.reply(from, `Pilih enable atau disable`, id);
          if (args[0] === "enable") {
            if (isAutoStikerOn)
              return await kato.reply(
                from,
                "Fitur auto stiker sudah diaktifkan",
                id
              );
            _autostiker.push(chat.id);
            fs.writeFileSync(
              "./lib/helper/autosticker.json",
              JSON.stringify(_autostiker)
            );
            await kato.reply(
              from,
              "Fitur autosticker berhasil diaktifkan",
              id
            );
          } else if (args[0] === "disable") {
            let ingroup = _autostiker.indexOf(groupId);
            _autostiker.splice(ingroup, 1);
            fs.writeFileSync(
              "./lib/helper/autosticker.json",
              JSON.stringify(_autostiker)
            );
            await kato.reply(
              from,
              "Fitur autostiker berhasil dinonaktifkan",
              id
            );
          } else {
            await kato.reply(from, "Format salah", id);
          }
          break;

        case prefix + "neko":
          try {
            kato.reply(from, mess.wait, id);
            axios
              .get("https://akaneko-api.herokuapp.com/api/neko")
              .then((res) => {
                kato.sendFileFromUrl(
                  from,
                  res.data.url,
                  "neko.jpeg",
                  "Neko *Nyaa*~"
                );
                kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
              });
          } catch (err) {
            console.log(err);
            throw err;
          }
          break;

        case prefix + "gifhentai":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) retkato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios
            .get("https://nekos.life/api/v2/img/Random_hentai_gif")
            .then((res) => {
              kato.sendFileFromUrl(from, res.data.url, "", "", id);
              kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
            });
          break;

        case prefix + "pussy":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/pussy").then((res) => {
            kato.sendFileFromUrl(from, res.data.url, "", "", id);
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "rhentai":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios
            .get("https://nekos.life/api/v2/img/Random_hentai_gif")
            .then((res) => {
              kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
            });
          break;

        case prefix + "kissgif":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          kato.get("https://nekos.life/api/v2/img/kiss").then((res) => {
            const mp4 = res.data.url;
            kato.sendStickerfromUrl(from, mp4, StickerMetadata);
          });
          break;

        case prefix + "sologif":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/solog").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "anal":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          kato.get("https://nekos.life/api/v2/img/anal").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "feetgif":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/feetg").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "ttgif":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/boobs").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "cumgif":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/cum").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "bjgif":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/bj").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "nsfwgif":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios
            .get("https://nekos.life/api/v2/img/nsfw_neko_gif")
            .then((res) => {
              kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
            });
          break;

        case prefix + "waifu":
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/waifu").then((res) => {
            kato.sendFileFromUrl(from, res.data.url, "", "Waifu UwU", id);
          });
          break;

        case prefix + "slap":
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/slap").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "rhug":
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/hug").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "animeavatar":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan didalam Grup!",
              id
            );
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/avatar").then((res) => {
            kato.sendFileFromUrl(from, res.data.url, "Avatar UwU");
          });
          break;

        case prefix + "nekonsfw":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios
            .get("https://nekos.life/api/v2/img/nsfw_neko_gif")
            .then((res) => {
              kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
            });
          break;

        case prefix + "lesbian":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/les").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "wallpaper2":
          kato.reply(from, mess.wait, id);
          axios
            .get("https://akaneko-api.herokuapp.com/api/wallpapers")
            .then((res) => {
              kato.sendFileFromUrl(
                from,
                res.data.url,
                "Desktop Wallpaper.jpeg",
                "Enjoy :>",
                id
              );
            });
          break;

        case prefix + "baka":
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/baka").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "antilink":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins)
            return kato.reply(
              from,
              "Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Hallo admin, jadikan gw sebagai admin grup dong :v",
              id
            );
          if (args[0] == "on") {
            var cek = antilink.includes(chatId);
            if (cek) {
              return kato.reply(
                from,
                "*Anti Group Link Detector* sudah aktif di grup ini",
                id
              ); //if number already exists on database
            } else {
              antilink.push(chatId);
              fs.writeFileSync(
                "./lib/helper/antilink.json",
                JSON.stringify(antilink)
              );
              kato.reply(
                from,
                "*[Anti Group Link]* telah di aktifkan\nSetiap member grup yang mengirim pesan mengandung link grup akan di *kick* oleh Kato Bot!",
                id
              );
            }
          } else if (args[0] == "off") {
            var cek = antilink.includes(chatId);
            if (!cek) {
              return kato.reply(
                from,
                "*Anti Group Link Detector* sudah non-aktif di grup ini",
                id
              ); //if number already exists on database
            } else {
              let nixx = antilink.indexOf(chatId);
              antilink.splice(nixx, 1);
              fs.writeFileSync(
                "./lib/helper/antilink.json",
                JSON.stringify(antilink)
              );
              kato.reply(
                from,
                "*[Anti Group Link]* telah di nonaktifkan\n",
                id
              );
            }
          } else {
            kato.reply(
              from,
              `pilih on / off\n\n*[Anti Group Link]*\nSetiap member grup yang mengirim pesan mengandung link grup akan di *kick* oleh Kato Bqot!`,
              id
            );
          }
          break;

        case prefix + "inv":
        case prefix + "invite":
          var qmoed = quotedMsgObj.sender.id;
          if (!isGroupMsg)
            return kato.reply(
              from,
              `Fitur ini hanya bisa di gunakan dalam group`,
              id
            );
          if (!isGroupAdmins)
            return kato.reply(
              from,
              `Perintah ini hanya bisa di gunakan oleh admin group`,
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              `Perintah ini hanya bisa di gunakan ketika bot menjadi admin`,
              id
            );
          try {
            await kato.addParticipant(from, qmoed);
          } catch {
            kato.reply(from, mess.error.Ad, id);
          }
          break;

        case prefix + "tag":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "perintah ini hanya dapat digunakan di dalam grup",
              id
            );
          if (!args.length >= 1)
            return await kato.reply(from, "pesan tidak boleh kosong", id);
          {
            const text = body.slice(5);
            const mem = groupMembers;
            const randMem = mem[Math.floor(Math.random() * mem.length)];
            const sapa = `${text} 👉 @${randMem}`;
            await kato.sendTextWithMentions(from, sapa);
          }
          break;

        case prefix + "ava":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Fitur ini hanya bisa diugnakan di dalam grup",
              id
            );
          if (!quotedMsg)
            return kato.reply(
              from,
              "Quote/reply pesan seseorang yang akan di download fotonya!!",
              id
            );
          try {
            const dp = await kato.getProfilePicFromServer(
              quotedMsgObj.sender.id
            );
            if (dp == undefined) {
              var pfp = kato.reply(
                from,
                "Dia ini pemalu, mungkin sedang depresi tidak berani memasang foto profil",
                id
              );
            } else {
              var pfp = kato.sendFileFromUrl(from, dp, "profile.png");
            }
          } catch {
            kato.reply(from, "Tidak ada foto profil/private", id);
          }
          break;

        case prefix + "mystat":
          {
            const userid = sender.id;
            const ban = banned.includes(userid);
            const blocked = await kato.getBlockedIds();
            const isblocked = blocked.includes(userid);
            const myLevel = level.getLevelingLevel(userid, _level);
            const exp = level.getLevelingXp(userid, _level);
            const ct = await kato.getContact(userid);
            const isOnline = (await kato.isChatOnline(userid)) ? "✔" : "❌";
            var sts = await kato.getStatus(userid);
            const bio = sts;
            const premuser = prem.includes(userid) ? "Premium" : "Free";
            const admins = groupAdmins.includes(userid) ? "Admin" : "Member";
            var found = false;
            Object.keys(pengirim).forEach((i) => {
              if (pengirim[i].id == userid) {
                found = i;
              }
            });
            var adm = admins;
            if (ct == null) {
              return await kato.reply(
                from,
                "Nomor WhatsApp tidak valid [ Tidak terdaftar di WhatsApp ]",
                id
              );
            } else {
              const contact = ct.pushname;
              const dp = await kato.getProfilePicFromServer(userid);
              const pictrand2 = menupict;
              if (dp == "ERROR: 401") {
                var pfp = pictrand2;
              } else {
                var pfp = dp;
              }
              if (contact == undefined) {
                var nama = "Tidak ada namanya, mungkin dia wibu";
              } else {
                var nama = contact;
              }
              const caption = `*Detail Member* ✨ \n\n● *Name :* ${nama}\n● *Bio :* ${
                bio.status
              }\n● *Level :* ${myLevel}\n● *Xp :* ${exp}\n● *Chat link :* wa.me/${sender.id.replace(
                "@c.us",
                ""
              )}\n● *Premium :* ${premuser}\n● *Role :* ${adm}\n● *Banned by Bot :* ${
                ban ? "✔" : "❌"
              }\n● *Blocked by Kato Bot :* ${
                isblocked ? "✔" : "❌"
              }\n● *Chat with Kato bot :* ${isOnline}`;
              kato.sendFileFromUrl(from, pfp, "dp.jpg", caption, id);
            }
          }
          break;

        case prefix + "jadian":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "perintah ini hanya dapat digunakan di dalam grup",
              id
            );
          const mem = groupMembers;
          const aku = mem[Math.floor(Math.random() * mem.length)];
          const kamu = mem[Math.floor(Math.random() * mem.length)];
          const sapa = `Cieee... @${aku.replace(
            /[@c.us]/g,
            ""
          )} (💘) @${kamu.replace(/[@c.us]/g, "")} jadian aja, ga nikah nikah`;
          await kato.sendTextWithMentions(from, sapa);
          break;

        case prefix + "resend":
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Gagal, Fitur ini hanya bisa digunakan oleh Admin",
              id
            );
          if (quotedMsgObj) {
            let encryptMedia;
            let replyOnReply = await kato.getMessageById(quotedMsgObj.id);
            let obj = replyOnReply.quotedMsgObj;
            if (
              /ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)
            ) {
              encryptMedia = quotedMsgObj;
              if (encryptMedia.animated) encryptMedia.mimetype = "";
            } else if (obj && /ptt|text|audio|video|image/.test(obj.type)) {
              encryptMedia = obj;
            } else return;
            const _mimetype = encryptMedia.mimetype;
            const mediaData = await decryptMedia(encryptMedia);
            await kato.sendFile(
              from,
              `data:${_mimetype};base64,${mediaData.toString("base64")}`,
              "file",
              ":)",
              encryptMedia.id
            );
          } else if (quotedMsgObj) {
            let encryptMedia;
            let reponr = await kato.getMessageById(quotedMsgObj.id);
            let obj = reponr.quotedMsgObj;
            if (/sticker/.test(quotedMsgObj.type)) {
              encryptMedia = quotedMsgObj;
              if (encryptMedia.animated) encryptMedia.mimetype = "";
            } else if (obj && /sticker/.test(obj.type)) {
              encryptMedia = obj;
            } else return;
            const _mimetype = encryptMedia.mimetype;
            const mediaData = await decryptMedia(encryptMedia);
            await kato.sendImageAsSticker(
              from,
              `data:${_mimetype};base64,${mediaData.toString("base64")}`,
              StickerMetadata
            );
          } else kato.reply(from, "reply pesannya dong", id);
          break;

        case prefix + "porno": // MFARELS
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          const mskkntl = fs.readFileSync("./lib/18+.json"); // MFARELS
          const kntlnya = JSON.parse(mskkntl); // MFARELS
          const rindBkp = Math.floor(Math.random() * kntlnya.length); // MFARELS
          const rindBkep = kntlnya[rindBkp]; // MFARELS
          kato.reply(from, rindBkep.teks, id); // MFARELS
          break;

        case prefix + "join":
          if (args.length == 0)
            return kato.reply(
              from,
              `Jika kalian ingin mengundang Kato Bot ke group silahkan invite atau dengan\nketik ${prefix}join [link group]`,
              id
            );
          if (!isPrem && !isOwnerB)
            return kato.reply(
              from,
              `Chat owner (4ndrexyz) buat dimasukkin grup`,
              id
            );
          let linkgrup = body.slice(6);
          let islink = linkgrup.match(/(https:\/\/chat.whatsapp.com)/gi);
          let chekgrup = await kato.inviteInfo(linkgrup);
          if (!islink)
            return kato.reply(
              from,
              "Maaf link group-nya salah! silahkan kirim link yang benar",
              id
            );
          if (isPrem) {
            await kato.joinGroupViaLink(linkgrup).then(async () => {
              await kato.sendText(from, "Berhasil join grup via link!");
              await kato.sendText(
                chekgrup.id,
                `Hallo, Kato Bot disini. Untuk mengetahui perintah pada Bot ini ketik *${prefix}menu*`
              );
            });
          } else {
            let cgrup = await kato.getAllGroups();
            if (cgrup.length > groupLimit)
              return kato.reply(
                from,
                `Maaf, grup ini sudah penuh :(\nMax Group: ${groupLimit}`,
                id
              );
            if (cgrup.size < memberLimit)
              return kato.reply(
                from,
                `Maaf, Kato Bot tidak akan bergabung jika anggota grup tidak melebihi ${memberLimit} orang`,
                id
              );
            await kato
              .joinGroupViaLink(linkgrup)
              .then(async () => {
                await kato.reply(from, "Berhasil join grup via link!", id);
              })
              .catch(() => {
                kato.reply(from, "Gagal!", id);
              });
          }
          break;

        case prefix + "wattpadstory":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari cerita dari wattpad! Gunakan ${prefix}wattpadstory url story\nContoh : ${prefix}wattpadstory https://www.wattpad.com/story/226120582-my-teacher-levi-x-student-reader`,
              id
            );
          const wpstry = body.slice(14);
          kato.reply(from, mess.wait, id);
          try {
            const datplai = await axios.get(`pstry}`);
            const datplay = datplai.data;
            let wtpdst = `*〘 WATTPAD STORY 〙*\n\n*A U T H O R :* ${datplai.data.author.name}\n`;
            for (let i = 0; i < datplay.parts.length; i++) {
              wtpdst += `\n─────────────────\n\n• *Judul :* ${datplai.data.title}\n*•Dibaca :* ${datplai.data.reads}\n• *Votes :* ${datplai.data.votes}\n• *Jumlah Episode :* ${datplai.data.parts_count}\n• *Deskripsi :* ${datplai.data.desc}\n\n`;
              wtpdst += `• *Title :* ${datplay.parts[i].title}\n• *URL :* ${datplay.parts[i].url}\n`;
            }
            await kato.sendFileFromUrl(
              from,
              datplay.thumb,
              "image.jpg",
              wtpdst,
              id
            );
          } catch (err) {
            console.log(err);
          }
          break;

        case prefix + "playstore":
          if (args.length === 0)
            return kato.reply(
              from,
              `Kirim perintah *${prefix}playstore [ Query ]*, Contoh : *${prefix}playstore Mobile Legends*`
            );
          const keywotp = body.slice(11);
          kato.reply(from, mess.wait, id);
          try {
            const dataplai = await axios.get(
              `https://api.zeks.me/api/sgplay?apikey=${apikeyvinz}&q=${keywotp}`
            );
            const dataplay = dataplai.data;
            if (dataplay.status == false)
              return kato.reply(
                from,
                "Aplikasi yang kamu cari tidak dapat ditemukan atau mungkin Rest Api sedang error",
                id
              );
            const dataresultt = dataplay.result;
            let keluarplay = `*〘 P L A Y S T O R E 〙*`;
            for (let i = 0; i < dataresultt.length; i++) {
              keluarplay += `\n─────────────────\n\n• *Nama* : ${dataresultt[i].title}\n• *Developer* : ${dataresultt[i].developer}\n• *Id App* : ${dataresultt[i].appid}\n• *Harga* : ${dataresultt[i].price}\n• *Rating* : ${dataresultt[i].rating}\n• *Link App* : ${dataresultt[i].url}\n`;
            }
            await kato.sendFileFromUrl(
              from,
              dataresultt[0].thumb,
              ``,
              keluarplay,
              id
            );
          } catch (err) {
            console.log(err);
          }
          break;

        case prefix + "reportbug":
          kato.reply(from, mess.wait, id);
          const reporter = body.slice(11);
          const getuserpicture = await kato.getProfilePicFromServer(sender.id);
          if (getuserpicture == undefined) {
            var profilepicc = errorImg;
          } else {
            var profilepicc = getuserpicture;
          }
          await kato.sendFileFromUrl(
            ownerNumber,
            profilepicc,
            "prof.jpg",
            `Laporan bug dari : *${pushname}*\nNomor : ${serial.replace(
              "@c.us",
              ""
            )}\n\nBug : *${reporter}*`,
            id
          );
          kato.reply(from, "Laporan berhasil dikirim ke Owner Bot!", id);
          break;

        case prefix + "setgroupname":
          if (!isGroupMsg)
            return kato.reply(
              from,
              `Fitur ini hanya bisa di gunakan dalam group`,
              id
            );
          if (!isGroupAdmins)
            return kato.reply(
              from,
              `Fitur ini hanya bisa di gunakan oleh admin group`,
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              `Fitur ini hanya bisa di gunakan ketika bot menjadi admin`,
              id
            );
          const namagrup = body.slice(14);
          const sebelum = chat.groupMetadata.gcok;
          let halaman = global.page ? global.page : await kato.getPage();
          await halaman.evaluate(
            (chatId, subject) => Store.WapQuery.changeSubject(chatId, subject),
            groupId,
            `${namagrup}`
          );
          kato.sendTextWithMentions(
            from,
            `Nama group telah diubah oleh admin @${sender.id.replace(
              "@c.us",
              ""
            )}\n\n• Before: ${sebelum}\n• After: ${namagrup}`
          );
          break;

        case prefix + "read":
          if (!isGroupMsg)
            return kato.reply(
              from,
              `Perintah ini hanya bisa di gunakan dalam group!`,
              id
            );
          if (!quotedMsg)
            return kato.reply(from, `Tolong Reply Pesan Bot`, id);
          if (!quotedMsgObj.fromMe)
            return kato.reply(from, `Tolong Reply Pesan Bot`, id);
          try {
            const reader = await kato.getMessageReaders(quotedMsgObj.id);
            let list = "";
            for (let pembaca of reader) {
              list += `- @${pembaca.id.replace(/@c.us/g, "")}\n`;
            }
            kato.sendTextWithMentions(
              from,
              `Kok cuman ngeread sih..\n${list}`
            );
          } catch (err) {
            console.log(err);
            kato.reply(
              from,
              `Maaf, Belum Ada Yang Membaca Pesan Bot atau Mereka Menonaktifkan Read Receipts`,
              id
            );
          }
          break;

        case prefix + "setstatus":
          if (!isOwnerB)
            return kato.reply(
              from,
              `Perintah ini hanya bisa di gunakan oleh Owner Bot!`,
              id
            );
          const setstat = body.slice(11);
          await kato.setMyStatus(setstat);
          kato.sendTextWithMentions(
            from,
            `Makasih Status Barunya @${sender.id.replace("@c.us", "")} 😘`
          );
          break;

        case prefix + "botstat": {
          const loadedMsg = await kato.getAmountOfLoadedMessages();
          const charged = await kato.getIsPlugged();
          const device = await kato.getMe();
          const deviceinfo = `- Battery Level : ${
            device.battery
          }%\n  ├ Is Charging : ${charged}\n  └ 24 Hours Online : ${
            device.is24h
          }\n  ├ OS Version : ${device.phone.os_version}\n  └ Build Number : ${
            device.phone.os_build_number
          }\n\n\n _*Jam :*_ ${moment(t * 1000).format("HH:mm:ss")}\n`;
          const chatIds = await kato.getAllChatIds();
          const groups = await kato.getAllGroups();
          const groupsIn = groups.filter((x) =>
            x.groupMetadata.participants
              .map((x) =>
                [botNumber, "62895334962050@c.us"].includes(x.id._serialized)
              )
              .includes(true)
          );
          kato.sendText(
            from,
            `*Device Info*\n${deviceinfo}\n\n\nStatus :\n- *${loadedMsg}* Loaded Messages\n- *${
              groupsIn.length
            }* Group Joined\n- *${
              groups.length - groupsIn.length
            }* Groups Left\n- *${groups.length}* Group Chats\n- *${
              chatIds.length - groups.length
            }* Personal Chats\n- *${
              chatIds.length - groups.length - groupsIn.length
            }* Personal Chats Active\n- *${chatIds.length}* Total Chats\n- *${
              chatIds.length - groupsIn.length
            }* Total Chats Active\n\n*Whatsapp Version :* ${waver}`
          );
          break;
        }

        //Sticker Converter
        case prefix + "stickergiffull":
        case prefix + "stikergiffull":
        case prefix + "sgiffull":
          if ((isMedia && type === "video") || mimetype == "sticker/gif") {
            kato.reply(from, mess.wait, id);
            try {
              const mediaData = await decryptMedia(message, uaOverride);
              const vidbase = `data:${mimetype};base64,${mediaData.toString(
                "base64"
              )}`;
              await kato
                .sendMp4AsSticker(from, vidbase, gifxyz, StickerMetadata)
                .then(async () => {
                  console.log(
                    color(
                      `Sticker Gif processed for ${processTime(
                        t,
                        moment()
                      )} seconds`,
                      "aqua"
                    )
                  );
                });
            } catch (err) {
              console.log(err);
              kato.reply(
                from,
                "Durasi video terlalu panjang, mohon kecilkan sedikit\nminimal 9 detik",
                id
              );
            }
          } else if (
            (quotedMsg && quotedMsg.type === "sticker") ||
            (quotedMsg && quotedMsg.type === "video")
          ) {
            kato.reply(from, mess.wait, id);
            try {
              const mediaData = await decryptMedia(quotedMsg, uaOverride);
              const videoBase64 = `data:${
                quotedMsg.mimetype
              };base64,${mediaData.toString("base64")}`;
              await kato
                .sendMp4AsSticker(from, videoBase64, gifxyz, StickerMetadata)
                .then(async () => {
                  console.log(
                    color(
                      `Sticker Gif processed for ${processTime(
                        t,
                        moment()
                      )} seconds`,
                      "aqua"
                    )
                  );
                });
            } catch (err) {
              console.error(err);
              await kato.reply(
                from,
                `Ukuran video terlalu besar\nMaksimal size adalah 1MB!`,
                id
              );
            }
          } else {
            await kato.reply(from, `Ukuran video terlalu besar`, id);
          }
          break;

        case prefix + "stickergif":
        case prefix + "stikergif":
        case prefix + "sgif":
          if ((isMedia && type === "video") || mimetype === "sticker/gif") {
            kato.reply(from, mess.wait, id);
            try {
              const mediaData = await decryptMedia(message, uaOverride);
              const videoBase64 = `data:${mimetype};base64,${mediaData.toString(
                "base64"
              )}`;
              await kato
                .sendMp4AsSticker(
                  from,
                  videoBase64,
                  gifcrop,
                  StickerMetadatacrop
                )
                .then(async () => {
                  console.log(
                    color(
                      `Sticker Gif processed for ${processTime(
                        t,
                        moment()
                      )} seconds`,
                      "aqua"
                    )
                  );
                });
            } catch (err) {
              console.error(err);
              await kato.reply(from, `Ukuran video terlalu besar`, id);
            }
          } else if (
            (quotedMsg && quotedMsg.type === "sticker") ||
            (quotedMsg && quotedMsg.type === "video")
          ) {
            kato.reply(from, mess.wait, id);
            try {
              const mediaData = await decryptMedia(quotedMsg, uaOverride);
              const videoBase64 = `data:${
                quotedMsg.mimetype
              };base64,${mediaData.toString("base64")}`;
              await kato
                .sendMp4AsSticker(
                  from,
                  videoBase64,
                  gifcrop,
                  StickerMetadatacrop
                )
                .then(async () => {
                  console.log(
                    color(
                      `Sticker Gif processed for ${processTime(
                        t,
                        moment()
                      )} seconds`,
                      "aqua"
                    )
                  );
                });
            } catch (err) {
              console.error(err);
              await kato.reply(
                from,
                `Ukuran video terlalu besar\nMaksimal size adalah 1MB!`,
                id
              );
            }
          } else {
            await kato.reply(
              from,
              `Reply/post video atau gif dengan caption ${prefix}sgif`,
              id
            );
          }
          break;

        case prefix + "startgif": //By: Thoriq Azzikra
          if ((isMedia && type === "video") || mimetype === "sticker/gif") {
            try {
              kato.reply(from, mess.wait, id);
              const mulai = q.split("|")[0];
              const akhir = q.split("|")[1];
              const mediaData = await decryptMedia(message, uaOverride);
              const vidBase64 = `data:${mimetype};base64,${mediaData.toString(
                "base64"
              )}`;
              await kato.sendMp4AsSticker(
                from,
                vidBase64,
                {
                  crop: true,
                  loop: 0,
                  fps: 30,
                  square: 240,
                  startTime: `00:00:${mulai}.0`,
                  endTime: `00:00:${akhir}.0`,
                },
                StickerMetadatacrop
              );
            } catch (err) {
              console.log(err);
              kato.reply(from, "Kecilkan skala video!\nMinimal 240x240", id);
            }
          } else if (
            (quotedMsg && quotedMsg.type === "sticker") ||
            (quotedMsg && quotedMsg.type === "video")
          ) {
            kato.reply(from, mess.wait, id);
            try {
              const mulaini = q.split("|")[0];
              const akhirni = q.split("|")[1];
              const mediaData = await decryptMedia(quotedMsg, uaOverride);
              const videoBase64 = `data:${
                quotedMsg.mimetype
              };base64,${mediaData.toString("base64")}`;
              await kato
                .sendMp4AsSticker(
                  from,
                  videoBase64,
                  {
                    crop: true,
                    loop: 0,
                    square: 240,
                    fps: 30,
                    startTime: `00:00:${mulaini}.0`,
                    endTime: `00:00:${akhirni}`,
                  },
                  StickerMetadatacrop
                )
                .then(async () => {
                  console.log(
                    color(
                      `Sticker Gif processed for ${processTime(
                        t,
                        moment()
                      )} seconds`,
                      "aqua"
                    )
                  );
                });
            } catch (err) {
              console.error(err);
              await kato.reply(
                from,
                `Ukuran video terlalu besar\nMaksimal size adalah 1MB!`,
                id
              );
            }
          } else {
            await kato.reply(from, `Ukuran video terlalu besar`, id);
          }
          break;

        case prefix + "stikertoimg":
        case prefix + "stickertoimg":
        case prefix + "stmg":
        case prefix + "toimg":
          if (quotedMsg && quotedMsg.type == "sticker") {
            const mediaData = await decryptMedia(quotedMsg);
            kato.reply(
              from,
              `Sedang di proses! Silahkan tunggu sebentar...`,
              id
            );
            const imageBase64 = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            await kato
              .sendFile(
                from,
                imageBase64,
                "imgsticker.jpg",
                "Berhasil convert Sticker to Image!",
                id
              )
              .then(() => {
                console.log(
                  `Sticker to Image Processed for ${processTime(
                    t,
                    moment()
                  )} Seconds`
                );
              });
          } else if (!quotedMsg)
            return kato.reply(
              from,
              `Format salah, silahkan tag sticker yang ingin dijadikan gambar!`,
              id
            );
          break;

        // Sticker Creator
        case prefix + "coolteks":
        case prefix + "cooltext":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk membuat teks keren CoolText pada gambar, gunakan ${prefix}cooltext teks\n\nContoh: ${prefix}cooltext 4ndrexyz`,
              id
            );
          rugaapi.cooltext(args[0]).then(async (res) => {
            await kato.sendFileFromUrl(
              from,
              `${res.link}`,
              "",
              `${res.text}`,
              id
            );
          });
          break;

        case prefix + "tr":
          if (args.length == 0)
            return kato.reply(
              from,
              `Kirim perintah ${prefix}tr [kodebahasa] [reply caption]\n\ncontoh : ${prefix}tr id [reply caption}`,
              id
            );
          const suwayy0 = arg.split("|")[0];
          const suwayy00 =
            quotedMsg.type == "chat"
              ? quotedMsg.body
              : quotedMsg.type == "image"
              ? quotedMsg.caption
              : "";
          axios
            .get(
              `https://amm-api-translate.herokuapp.com/translate?engine=google&text=${suwayy00}&to=${suwayy0}`
            )
            .then((res) => {
              const trans = res.data.data.result;
              kato.reply(from, trans, id);
            });
          break;

        case prefix + "npm":
          if (!q)
            return await kato.reply(
              from,
              `Format salah!\ngunakan ${prefix}npm package_name`,
              id
            );
          try {
            await kato.reply(from, mess.wait, id);
            const datanpm = await axios.get(
              `https://videfikri.com/api/npm/?query=${body.slice(5)}`
            );
            const npm = datanpm.data.result;
            await kato.reply(
              from,
              `➸ *ID*: ${npm.id}\n➸ *Package Name*: ${npm.name}\n➸ *REV*: ${npm.rev}\n➸ *Version Latest*: ${npm.version_latest}\n➸ *Description*: ${npm.description}\n➸ *Homepage*: ${npm.homepage}\n➸ *Author Name*: ${npm.author_name}\n➸ *License*: ${npm.license}\n➸ *Maintainer*: ${npm.maintainer}\n➸ *Email*: ${npm.email}\n➸ *Created At*: ${npm.created_at}\n➸ *Last Modified*: ${npm.last_modified}`,
              id
            );
          } catch (err) {
            console.error(err);
            await kato.reply(from, "Error!", id);
          }
          break;

        case prefix + "delallvn":
          if (!isOwnerB)
            return kato.reply(from, "Fitur ini khusus Owner Bot", id);
          let dellall = listvn.includes(chats);
          listvn.splice(dellall);
          fs.writeFileSync(
            "./lib/database/listvn.json",
            JSON.stringify(listvn)
          );
          kato.reply(from, `semua vn didalam database berhasil dihapus`, id);
          break;

        case prefix + "delallimg":
          if (!isOwnerB)
            return kato.reply(
              from,
              `Fitur ini hanya bisa digunakan oleh owner bot!`,
              id
            );
          let delimg = listimg.includes(chats);
          listimg.splice(delimg);
          fs.writeFileSync(
            "./lib/database/listimage.json",
            JSON.stringify(listimg)
          );
          kato.reply(
            from,
            "semua image didalam database berhasil dihapus",
            id
          );
          break;

        case prefix + "delallstik":
          if (!isOwnerB)
            return kato.reply(from, "fitur ini khusus owner bot", id);
          let delalstc = liststicker.includes(chats);
          liststicker.splice(delalstc);
          fs.writeFileSync(
            "./lib/database/liststiker.json",
            JSON.stringify(liststicker)
          );
          kato.reply(
            from,
            "semua stiker didalam database berhasil didelete",
            id
          );
          break;

        case prefix + "luassegitiga":
          if (args.length == 0)
            return kato.reply(
              from,
              `untuk mencari hasil dari luas segitiga\nGunakan ${prefix}luassegitiga alas tinggi\ncontoh: ${prefix}luassegitiga 12 7`,
              id
            );
          try {
            const luasseg = bdr.datar.luas.segitiga(args[0], args[1], false);
            const caraluas = bdr.datar.luas.segitiga(args[0], args[1], true);
            kato.reply(from, `*Hasil:* ${luasseg}\n*Rumus:* ${caraluas}`, id);
          } catch (err) {
            kato.reply(from, "Format pesannya salah tuh", id);
          }
          break;

        case prefix + "kelsegitiga":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari Hasil dari keliling segitiga\nGunakan ${prefix}kelsegitiga sisi1 sisi2 sisi3\nContoh: ${prefix}kelsegitiga 32 10 8`,
              id
            );
          try {
            const kelsegitiga = bdr.datar.keliling.segitiga(
              args[0],
              args[1],
              args[2],
              false
            );
            const carakel = bdr.datar.keliling.segitiga(
              args[0],
              args[1],
              args[2],
              true
            );
            kato.reply(
              from,
              `*Hasil:* ${kelsegitiga}\n*Rumus:* ${carakel}`,
              id
            );
          } catch (err) {
            kato.reply(from, "Format pesannya salah tuh", id);
          }
          break;

        case prefix + "pythagoras":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari hasil pythagoras\nGunakan ${prefix}pythagoras opsi angka1 angka2\nContoh: ${prefix}pythagoras miring 8 6`,
              id
            );
          try {
            const pytha = bdr.rdb.pythagoras(args[0], args[1], args[2], false);
            const rumuspytha = bdr.rdb.pythagoras(
              args[0],
              args[1],
              args[2],
              true
            );
            kato.reply(from, `*Hasil:* ${pytha}\n*Rumus:* ${rumuspytha}`, id);
          } catch (err) {
            kato.reply(from, "Format pesannya salah tuh", id);
          }
          break;

        case prefix + "kuadrat":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari sebuah Hasil Kuadrat\nGunakan ${prefix}kuadrat angka\nContoh: ${prefix}kuadrat 6`,
              id
            );
          try {
            const kuadrat = bdr.rdb.kuadrat(q);
            kato.reply(from, `*Hasil:* ${kuadrat}`, id);
          } catch (err) {
            kato.reply(from, "Format pesannya salah tuh", id);
          }
          break;

        case prefix + "kubik":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari sebuah Hasil Kubik\nGunakan ${prefix}kubik angka\nContoh: ${prefix}kubik 9`,
              id
            );
          try {
            const kubik = bdr.rdb.kubik(q);
            kato.reply(from, `*Hasil:* ${kubik}`, id);
          } catch (err) {
            kato.reply(from, "Format pesannya salah tuh", id);
          }
          break;

        case prefix + "stcfull":
        case prefix + "stickerfull":
        case prefix + "stikerfull":
        case prefix + "sfull":
          if (isMedia && type === "image") {
            const mediaData = await decryptMedia(message, uaOverride);
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
              "base64"
            )}`;
            await kato.sendImageAsSticker(from, imageBase64, StickerMetadata);
            console.log(
              color(
                `Sticker processed for ${processTime(t, moment())} seconds`,
                "aqua"
              )
            );
          } else if (quotedMsg && quotedMsg.type == "image") {
            const mediaData = await decryptMedia(quotedMsg, uaOverride);
            const imageBase64 = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            await kato.sendImageAsSticker(from, imageBase64, StickerMetadata);
            console.log(
              color(
                `Sticker processed for ${processTime(t, moment())} seconds`,
                "aqua"
              )
            );
          } else {
            kato.reply(from, mess.error.St, id);
          }
          break;

        case prefix + "fakethumb":
          if ((isMedia && isImage) || isQuotedImage) {
            const strs = chats.match("https") || chats.match("http");
            if (!strs)
              return kato.reply(from, "Masukkan param https/http", id);
            kato.reply(from, mess.wait, id);
            const qtmds = isQuotedImage ? quotedMsg : message;
            const mimtype = isQuotedImage ? quotedMsg.mimetype : mimetype;
            const mediaData = await decryptMedia(qtmds, uaOverride);
            const bodslice = body.slice(11);
            const imageBse = `data:${mimtype};base64,${mediaData.toString(
              "base64"
            )}`;
            await kato.sendLinkWithAutoPreview(from, bodslice, "", imageBse);
          } else {
            kato.reply(
              from,
              `Reply foto dengan caption ${prefix}fakethumb url`,
              id
            );
          }
          break;

        case prefix + "shutdown":
          if (!isOwnerB) return kato.reply(from, "Kamu Siapa ?", id);
          kato.sendText(from, "Shutdown Bot in");
          await sleep(1000);
          kato.sendText(from, "5");
          await sleep(1000);
          kato.sendText(from, "4");
          await sleep(1000);
          kato.sendText(from, "3");
          await sleep(1000);
          kato.sendText(from, "2");
          await sleep(1000);
          kato.sendText(from, "1");
          await sleep(1000);
          kato.sendText(from, `Sayonara :)`);
          await sleep(10000);
          kato.kill(true);
          break;

        case prefix + "sticker":
        case prefix + "stiker":
        case prefix + "stc":
        case prefix + "s":
          if (isMedia && type === "image") {
            const mediaData = await decryptMedia(message, uaOverride);
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
              "base64"
            )}`;
            await kato
              .sendImageAsSticker(from, imageBase64, StickerMetadatacrop)
              .then(async () => {
                console.log(
                  color(
                    `Sticker processed for ${processTime(t, moment())} seconds`,
                    "aqua"
                  )
                );
              });
          } else if (quotedMsg && quotedMsg.type == "image") {
            const mediaData = await decryptMedia(quotedMsg, uaOverride);
            const imageBase64 = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            await kato
              .sendImageAsSticker(from, imageBase64, StickerMetadatacrop)
              .then(async (res) => {
                console.log(
                  color(
                    `Sticker processed for ${processTime(t, moment())} seconds`,
                    "aqua"
                  )
                );
              });
          } else {
            kato.reply(from, mess.error.St, id);
          }
          break;

        case prefix + "wattpad":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari sebuah detail dari part cerita Wattpad! Gunakan ${prefix}wattpad [query]\nContoh : ${prefix}wattpad bos birahi`,
              id
            );
          await kato.reply(from, mess.wait, id);
          const bodyslice = body.slice(9);
          try {
            const watpad = await fetch(
              `http://docs-jojo.herokuapp.com/api/wattpad_search?q=${bodyslice}`
            );
            const watjs = await watpad.json();
            const { result } = await watjs;
            let wtpd = `*〘 WATTPAD 〙*\n`;
            for (let i = 0; i < result.length; i++) {
              wtpd += `\n─────────────────\n\n*•Judul:* ${result[i].title}\n*•Reads:* ${result[i].reads}\n*•Votes:* ${result[i].votes}\n*•Url:* ${result[i].url}\n*•Description:* ${result[i].description}\n`;
            }
            await kato.sendFileFromUrl(
              from,
              result[0].thumb,
              "img.jpg",
              wtpd,
              id
            );
          } catch (err) {
            console.log(err);
            kato.reply(from, "Error bang", id);
          }
          break;

        case prefix + "neonime":
          if (args.length == 0)
            return kato.reply(
              from,
              `Mencari anime dari website Neonime!\nContoh: ${prefix}neonime boruto`,
              id
            );
          await kato.reply(from, mess.wait, id);
          rugaapi
            .neo(body.slice(9))
            .then(async ({ result }) => {
              let neoni = "*〘 N E O N I M E 〙*";
              for (let i = 0; i < result.length; i++) {
                neoni += `\n\n• *Judul :* ${result[i].title}\n• *Url :* ${result[i].url}\n• *Deskripsi :* ${result[i].desc}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`;
              }
              await kato.sendFileFromUrl(
                from,
                result[0].thumb,
                "img.jpg",
                neoni,
                id
              );
              console.log(`Succes sending ${body.slice(9)}`);
            })
            .catch(async (err) => {
              console.error(err);
              kato.reply(from, "Error njing", id);
            });
          break;

        case prefix + "brainly":
          if (args.length >= 2) {
            const BrainlySearch = require("./lib/brainly");
            let tanya = body.slice(9);
            let jum = Number(tanya.split(".")[1]) || 2;
            if (jum > 10) return kato.reply(from, "Max 10!", id);
            if (Number(tanya[tanya.length - 1])) {
              tanya;
            }
            kato.reply(
              from,
              `➸ *Pertanyaan* : ${
                tanya.split(".")[0]
              }\n\n➸ *Jumlah jawaban* : ${Number(jum)}`,
              id
            );
            await BrainlySearch(
              tanya.split(".")[0],
              Number(jum),
              function (res) {
                res.forEach((x) => {
                  if (x.jawaban.fotoJawaban.length == 0) {
                    kato.reply(
                      from,
                      `➸ *Pertanyaan* : ${x.pertanyaan}\n\n➸ *Jawaban* : ${x.jawaban.judulJawaban}\n`,
                      id
                    );
                    kato.sendText(from, "nihh lord");
                  } else {
                    kato.reply(
                      from,
                      `➸ *Pertanyaan* : ${x.pertanyaan}\n\n➸ *Jawaban* 〙: ${
                        x.jawaban.judulJawaban
                      }\n\n➸ *Link foto jawaban* : ${x.jawaban.fotoJawaban.join(
                        "\n"
                      )}`,
                      id
                    );
                  }
                });
              }
            );
          } else {
            kato.reply(
              from,
              "Usage :\n/brainly [pertanyaan] [.jumlah]\n\nEx : \n/brainly NKRI .2",
              id
            );
          }
          break;

        case prefix + "readmore":
          const read = arg.split("|")[0];
          const more = arg.split("|")[1];
          const capts = `${read}͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏${more}`;
          kato.reply(from, capts, id);
          break;

        case prefix + "stikergiphy":
        case prefix + "stickergiphy":
          if (args.length !== 1)
            return kato.reply(
              from,
              `Maaf, format pesan salah.\nKetik pesan dengan ${prefix}stickergiphy <link_giphy>`,
              id
            );
          const isGiphy = url.match(
            new RegExp(/https?:\/\/(www\.)?giphy.com/, "gi")
          );
          const isMediaGiphy = url.match(
            new RegExp(/https?:\/\/media.giphy.com\/media/, "gi")
          );
          if (isGiphy) {
            const getGiphyCode = url.match(
              new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, "gi")
            );
            if (!getGiphyCode) {
              return kato.reply(from, "Gagal mengambil kode giphy", id);
            }
            const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, "");
            const smallGifUrl =
              "https://media.giphy.com/media/" +
              giphyCode +
              "/giphy-downsized.gif";
            kato
              .sendGiphyAsSticker(from, smallGifUrl)
              .then(() => {
                kato.reply(from, "Here's your sticker");
                console.log(
                  color(
                    `Sticker Processed for ${processTime(t, moment())} Second`,
                    "aqua"
                  )
                );
              })
              .catch((err) => console.log(err));
          } else if (isMediaGiphy) {
            const gifUrl = url.match(
              new RegExp(/(giphy|source).(gif|mp4)/, "gi")
            );
            if (!gifUrl) {
              return kato.reply(from, "Gagal mengambil kode giphy", id);
            }
            const smallGifUrl = url.replace(gifUrl[0], "giphy-downsized.gif");
            kato
              .sendGiphyAsSticker(from, smallGifUrl)
              .then(() => {
                kato.reply(from, "Here's your sticker");
                console.log(
                  `Sticker Processed for ${processTime(t, moment())} Second`
                );
              })
              .catch(() => {
                kato.reply(from, `Ada yang error!`, id);
              });
          } else {
            await kato.reply(
              from,
              "Maaf, command sticker giphy hanya bisa menggunakan link dari giphy.  [Giphy Only]",
              id
            );
          }
          break;

        case prefix + "infobmkg":
          kato.reply(from, mess.wait, id);
          axios
            .get(`http://zekais-api.herokuapp.com/gempa?apikey=${zekais}`)
            .then(async (res) => {
              if (res.data.status == false)
                return kato.reply(from, "REST-API sedang error", id);
              const imageth = res.data.image;
              const magnitudo = res.data.magnitudo;
              const kedalamannya = res.data.kedalaman;
              const wilayahhh = res.data.wilayah;
              const waktuuu = res.data.waktu;
              const lintang = res.data.lintang;
              const bujur = res.data.bujur;
              const txthehe = `Magnitudo: ${magnitudo}\nKedalaman: ${kedalamannya}\nWilayah: ${wilayahhh}\nWaktu: ${waktuuu}\nLintang: ${lintang}\nBujur: ${bujur}`;
              kato.sendFileFromUrl(from, imageth, "thumb.jpg", txthehe, id);
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "bucin":
          axios
            .get(`http://zekais-api.herokuapp.com/bucin?apikey=${zekais}`)
            .then((res) => {
              const ayamgrg = res.data.result;
              kato.reply(from, ayamgrg, id);
            });
          break;

        case prefix + "setdesc":
          if (!isGroupAdmins)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh Admin!"
            );
          const descnya = body.slice(9);
          const ganti = await kato.setGroupDescription(descnya);
          kato.setGroupDescription(groupId, ganti);
          break;

        case prefix + "dankmemes":
          kato.reply(from, mess.wait, id);
          axios
            .get(`http://zekais-api.herokuapp.com/dankmemes?apikey=${zekais}`)
            .then(async (res) => {
              kato
                .sendFileFromUrl(from, res.data.result, "img.jpg", "", id)
                .catch((err) => {
                  console.log(err);
                  kato.reply(from, "Rest Api sedang error", id);
                });
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "meme":
          if ((isMedia || isQuotedImage) && args.length >= 2) {
            const top = arg.split("|")[0];
            const bottom = arg.split("|")[1];
            const encryptMedia = isQuotedImage ? quotedMsg : message;
            const mediaData = await decryptMedia(encryptMedia, uaOverride);
            const getUrl = await uploadImages(mediaData, false);
            const ImageBase64 = await meme.custom(getUrl, top, bottom);
            kato.sendFile(from, ImageBase64, "image.png", "", null, true);
            kato
              .sendImageAsSticker(from, ImageBase64, StickerMetadata)
              .then(() => {
                kato.reply(from, "Ini makasih!", id);
              })
              .catch(() => {
                kato.reply(from, "Ada yang error!");
              });
          } else {
            await kato.reply(
              from,
              `Tidak ada gambar! Silahkan kirim gambar dengan caption ${prefix}meme <teks_atas> | <teks_bawah>\ncontoh: ${prefix}meme teks atas | teks bawah`,
              id
            );
          }
          break;

        case prefix + "quotemaker":
          if (args.length == 0)
            return kato.reply(
              from,
              `Membuat quote maker, gunakan ${prefix}quotemaker |quotes|author|theme\nContoh: ${prefix}quotemaker terlihatlah sudah|thoriq|aesthetic`,
              id
            );
          const qmaker = body.trim().split("|");
          if (qmaker.length >= 3) {
            const quotes = qmaker[1];
            const author = qmaker[2];
            const theme = qmaker[3];
            kato.reply(from, "Proses kak..", id);
            try {
              const hasilqmaker = await images.quote(quotes, author, theme);
              kato.sendFileFromUrl(
                from,
                `${hasilqmaker}`,
                "",
                "Ini kak..",
                id
              );
            } catch {
              kato.reply(
                "Yahh proses gagal, kakak isinya sudah benar belum?..",
                id
              );
            }
          } else {
            kato.reply(
              from,
              `Pemakaian ${prefix}quotemaker |isi quote|author|theme\n\ncontoh: ${prefix}quotemaker |aku sayang kamu|~ 4ndrexyz|random\n\nuntuk theme nya pakai random ya kak..`
            );
          }
          break;

        case prefix + "foliokanan":
          if (args.length == 0)
            return kato.reply(
              from,
              `Membuat bot menulis teks yang akan dikirim menjadi gambar`,
              id
            );
          const folkan = body.slice(12);
          await kato.sendFileFromUrl(
            from,
            `http://zekais-api.herokuapp.com/foliokanan?text=${folkan}&apikey=${zekais}`,
            "",
            "",
            id
          );
          break;

        case prefix + "foliokiri":
          if (args.length == 0)
            return kato.reply(
              from,
              `Membuat bot menulis teks yang akan dikirim menjadi gambar!`,
              id
            );
          const nulisfol1 = body.slice(11);
          await kato.sendFileFromUrl(
            from,
            `http://zekais-api.herokuapp.com/foliokiri?text=${nulisfol1}&apikey=${zekais}`,
            "",
            "",
            id
          );
          break;

        //Islam Command

        //Group All User
        case prefix + "grouplink":
        case prefix + "linkgc":
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan ketika bot menjadi admin",
              id
            );
          if (isGroupMsg) {
            const inviteLink = await kato.getGroupInviteLink(groupId);
            kato.sendLinkWithAutoPreview(
              from,
              inviteLink,
              `\nLink group *${name}* Gunakan *${prefix}revoke* untuk mereset Link group`
            );
          } else {
            kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          }
          break;

        case prefix + "revoke":
          if (!isGroupAdmins) return kato.reply(from, "Lu admin?", id);
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan ketika bot menjadi admin",
              id
            );
          if (isBotGroupAdmins) {
            kato
              .revokeGroupInviteLink(from)
              .then((res) => {
                kato.reply(
                  from,
                  `Berhasil Revoke Grup Link gunakan *${prefix}grouplink* untuk mendapatkan group invite link yang terbaru`,
                  id
                );
              })
              .catch(() => {
                console.log(`[ERR] ${err}`);
              });
          }
          break;

        //Media
        case prefix + "ytmp3":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mendownload lagu dari youtube\nketik: ${prefix}ytmp3 [link_yt]`,
              id
            );
          kato.reply(from, mess.wait, id);
          rugaapi
            .ymp3v2(body.slice(7))
            .then(async (res) => {
              if (res.status == false)
                return kato.reply(from, "Link tidak valid!", id);
              await kato.sendFileFromUrl(
                from,
                res.result.thumb,
                "",
                ` 〘 *YOUTUBE MP3* 〙\n\n*Title:* ${res.result.title}\n*Size:* ${res.result.size}\n*Quality:* ${res.result.quality}\n*File Type:* ${res.result.ext}\n\n${mess.sendfileaudio}`,
                id
              );
              await kato.sendFileFromUrl(from, res.result.link, "", "", id);
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "sketch":
          if ((isMedia && isImage) || isQuotedImage) {
            await kato.reply(from, mess.wait, id);
            const encryptMedia = isQuotedImage ? quotedMsg : message;
            const mediaData = await decryptMedia(encryptMedia, uaOverride);
            const linkImg = await uploadImages(mediaData, `${sender.id}_img`);
            axios
              .get(
                `https://api.zeks.xyz/api/sketchf?img=${linkImg}&apikey=${apikeyvinz}`
              )
              .then(async (res) => {
                await kato.sendFileFromUrl(
                  from,
                  res.data.result,
                  "img.jpg",
                  "",
                  id
                );
              });
          } else {
            await kato.reply(from, "Error njing", id);
          }
          break;

        case prefix + "imgbb":
          if (isMedia || isImage || isQuotedImage) {
            kato.reply(from, mess.wait, id);
            const jajas = isQuotedImage ? quotedMsg : message;
            const mediaData = await decryptMedia(jajas, uaOverride);
            const uploadImg2 = await uploadImages(
              mediaData,
              `${sender.id}_img`
            );
            const namas = body.slice(7);
            axios
              .get(
                `https://videfikri.com/api/imgbb/?urlgbr=${uploadImg2}&title=${namas}`
              )
              .then(async (res) => {
                const besx = `Link: ${res.data.result.url}`;
                kato
                  .sendFileFromUrl(from, res.data.result.url, "", besx, id)
                  .catch((err) => {
                    kato.reply(from, besx, id);
                  });
              });
          } else {
            kato.reply(from, "Format pesan salah", id);
          }
          break;

        case prefix + "givecolor":
          if (isMedia || isImage || isQuotedImage) {
            kato.reply(from, mess.wait, id);
            const qtmz = isQuotedImage ? quotedMsg : message;
            const mediaData = await decryptMedia(qtmz, uaOverride);
            const upsz = await uploadImages(mediaData, `${sender.id}_img`);
            await kato
              .sendFileFromUrl(
                from,
                `https://docs-jojo.herokuapp.com/api/colorize-old-photo?image_url=${upsz}`,
                "img.jpg",
                "",
                id
              )
              .catch((err) => {
                console.log(err);
                kato.reply(from, "Terjadi kesalahan saat mengupload foto", id);
              });
          } else if (args[0]) {
            kato.reply(from, mess.wait, id);
            const linksur = args[0];
            await kato.sendFileFromUrl(
              from,
              `https://docs-jojo.herokuapp.com/api/colorize-old-photo?image_url=${args}`,
              "img.jpg",
              "",
              "",
              id
            );
          } else {
            kato.reply(
              from,
              `Kirim/reply foto dengan caption ${prefix}givecolor`,
              id
            );
          }
          break;

        case prefix + "nobg":
        case prefix + "stcnobg":
        case prefix + "stikernobg":
        case prefix + "stickernobg":
          if (isMedia || isImage || isQuotedImage) {
            await kato.reply(from, mess.wait, id);
            const encryptMedia = isQuotedImage ? quotedMsg : message;
            const mimetipeee = isQuotedImage ? quotedMsg.mimetype : mimetype;
            const mediaData = await decryptMedia(quotedMsg, uaOverride);
            const heynobg = `data:${
              quotedMsg.mimetipeee
            };base64,${mediaData.toString("base64")}`;
            kato.sendImageAsSticker(from, heynobg, {
              author: "@4ndrexyz",
              pack: "4ndrexyz",
              removebg: true,
            });
          } else {
            kato.reply(
              from,
              `Reply/post foto dengan caption ${prefix}nobg`,
              id
            );
          }
          break;

        case prefix + "textmaker":
          if ((isMedia && isImage) || isQuotedImage) {
            await kato.reply(from, mess.wait, id);
            const textbot = body.slice(11);
            const skruap = isQuotedImage ? quotedMsg : message;
            const mediaData = await decryptMedia(skruap, uaOverride);
            const imgs = await uploadImages(mediaData, false);
            kato.sendImageAsSticker(
              from,
              `https://api.memegen.link/images/custom/_/${textbot}.png?background=${imgs}`,
              StickerMetadata
            );
          } else {
            kato.reply(from, "Reply fotonya dong", id);
          }
          break;

        case prefix + "imagetourl":
        case prefix + "imgtourl":
          if ((isMedia && isImage) || isQuotedImage) {
            await kato.reply(from, mess.wait, id);
            const encryptMedia = isQuotedImage ? quotedMsg : message;
            const mediaData = await decryptMedia(encryptMedia, uaOverride);
            const linkImg = await uploadImages(mediaData, false);
            await kato.reply(from, linkImg, id);
          } else {
            await kato.reply(
              from,
              "Format pesan salah, kirim gambarnya lalu pakai command /imgtorul",
              id
            );
          }
          break;

        case prefix + "igreels":
        case prefix + "instagramreels":
        case prefix + "reelsig":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mendownload reel instagram gunakan ${prefix}igreels link\nContoh: ${prefix}igreels https://www.instagram.com/reel/CTMQQxunAXb/`,
              id
            );
          const reelink = body.slice(9);
          axios
            .get(
              `https://cakrayp.herokuapp.com/api/instagram/feeds?url=${reelink}&apikey=${cakrayp}`
            )
            .then(async (res) => {
              if (res.data.status == false)
                return kato.reply(from, res.data.message.info, id);
              kato.sendFileFromUrl(
                from,
                res.data.result.thumbimg,
                "thumb.jpg",
                `• *Username:* ${res.data.result.username}\n• *Likes:* ${res.data.result.likes}\n• *Comments:* ${res.data.result.comments}\n• *Caption:* ${res.data.result.caption}`,
                id
              );
              kato.sendFileFromUrl(
                from,
                res.data.result.link[0].url,
                "",
                "",
                id
              );
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "ig":
        case prefix + "instagram":
          if (args.length == 0)
            return kato.reply(
              from,
              `Kirim perintah *${prefix}ig [linkIg]*`,
              id
            );
          const igUrl = body.slice(4);
          axios
            .get(
              `https://zekais-api.herokuapp.com/igdl?url=${igUrl}&apikey=${zekais}`
            )
            .then(async (res) => {
              if (res.data.result[0].type == "image") {
                kato.sendFileFromUrl(
                  from,
                  res.data.result[0].url,
                  "ig.jpg",
                  "",
                  id
                );
              } else if (res.data.result[0].type == "video") {
                await kato.sendFileFromUrl(
                  from,
                  res.data.resul[0].url,
                  "ig.mp4",
                  `*from: ${res.data.result.username}*\n*fullname: ${res.data.result.fullname}*\n*caption: ${res.data.result.caption}*`,
                  id
                );
              } else {
                kato.reply(from, "Terjadi kesalahan", id);
              }
            })
            .catch((err) => {
              console.log(err);
              kato.reply(
                from,
                `Error!\nSilahkan gunakan ${prefix}ig2 atau ${prefix}postigurl`,
                id
              );
            });
          break;

        case prefix + "ig2":
          if (args.length == 0)
            return kato.reply(from, `Kirim perintah ${prefix}ig2 linkig`, id);
          kato.reply(from, "_Scrapping Metadataa..._", id);
          axios
            .get(
              `http://api.lolhuman.xyz/api/instagram2?apikey=${lolhuman}&url=${body.slice(
                5
              )}`
            )
            .then(async (res) => {
              kato
                .sendFileFromUrl(
                  from,
                  res.data.result.media[0],
                  "ig.mp4",
                  "",
                  id
                )
                .catch((err) => {
                  console.log(err);
                  kato.reply(
                    from,
                    `Error!\nSilahkan gunakan ${prefix}ig atau ${prefix}postigurl`,
                    id
                  );
                });
            });
          break;

        case prefix + "postigurl":
          if (args.length == 0)
            return kato.reply(
              from,
              `Silahkan kirim perintah ${prefix}postigurl linkurl jumlah\nfitur ini untuk mendownload jumlah yang ingin didownload\nContoh: ${prefix}postigurl https://www.instagram.com/p/CP3QRfTpUGN/ 2`,
              id
            );
          const jams = args[0];
          const jamss = args[1];
          if (jamss > 11) return kato.reply(from, "Maksimal 10", id);
          kato.reply(from, mess.wait, id);
          try {
            const beasin = await axios.get(
              `https://zekais-api.herokuapp.com/igdl?url=${jams}&apikey=${zekais}`
            );
            const beasin2 = beasin.data;
            if (beasin2.status == 500)
              return kato.reply(
                from,
                `Error!\nSilahkan gunakan ${prefix}ig atau ${prefix}ig2`,
                id
              );
            for (let i = 0; i < jamss; i++) {
              await kato
                .sendFileFromUrl(
                  from,
                  beasin2.result[i].url,
                  "",
                  `*from: ${beasin2.owner_user}*\n*uploaded: ${beasin2.date}*\n*caption:* ${beasin2.capt}*`,
                  id
                )
                .catch((err) => {
                  console.log(err);
                  kato.reply(from, err.message, id);
                });
            }
          } catch (err) {
            console.log(err);
            kato.reply(from, err.message, id);
          }
          break;

        case prefix + "bioskop":
          if (args.length == 0)
            return kato.reply(
              from,
              `Fitur untuk mencari bioskop yang ada dikota Kalian\nGunakan ${prefix}bioskop nama kota\nContoh: ${prefix}bioskop Pontianak`,
              id
            );
          const namabis = body.slice(9);
          try {
            const forbis = await fetch(
              `http://docs-jojo.herokuapp.com/api/bioskop?kota=${namabis}`
            );
            const fordat = await forbis.json();
            const { result } = await fordat;
            let namabisa = `〘 *BIOSKOP* 〙\n`;
            for (let i = 0; i < result.length; i++) {
              namabisa += `\n─────────────────\n\n*•Nama:* ${result[i].title}\n*•Alamat:* ${result[i].alamat}\n*•Bintang:* ${result[i].bintang}\n*•Url:* ${result[i].url}\n`;
            }
            await kato.sendFileFromUrl(
              from,
              result[0].img,
              "img.jpg",
              namabisa,
              id
            );
          } catch (err) {
            console.log(err);
            kato.reply(from, "Maaf sedang error, coba lagi nanti", id);
          }
          break;

        case prefix + "jadwaltvnow":
          kato.reply(from, mess.wait, id);
          axios
            .get(`http://docs-jojo.herokuapp.com/api/jadwaltvnow`)
            .then(async (res) => {
              const nihcp = `*•Jam:* ${res.data.result.jam}\n\n*•Jadwal TV:* ${res.data.result.jadwalTV}`;
              kato.reply(from, nihcp, id).catch(() => {
                kato.reply(from, "Maaf sedang error, coba lagi nanti", id);
              });
            })
            .catch((err) => {
              console.log(err);
            });
          break;

        case prefix + "infoloker":
          kato.reply(from, mess.wait, id);
          try {
            const infolok = await fetch(
              `http://docs-jojo.herokuapp.com/api/infoloker`
            );
            const bejson = await infolok.json();
            const { result } = await bejson;
            let infonich = `*〘 INFO LOKER 〙*\n`;
            for (let i = 0; i < result.length; i++) {
              infonich += `\n─────────────────\n\n*•Nama Perusahaan:* ${result[i].perusahaan}\n*•Profesi:* ${result[i].profesi}\n*•Lokasi:* ${result[i].lokasi}\n*•Gaji:* ${result[i].gaji}\n*•Pengalaman:* ${result[i].pengalaman}\n*•Job Function:* ${result[i].jobFunction}\n*•Level Karir:* ${result[i].levelKarir}\n*•Edukasi:* ${result[i].edukasi}\n*•Syarat:* ${result[i].syarat}\n*•Link:* ${result[i].link}\n*•Deskripsi:* ${result[i].desc}\n`;
            }
            await kato.reply(from, infonich, id);
          } catch (err) {
            console.log(err);
            kato.reply(from, "Maaf sedang error, coba lagi nanti", id);
          }
          break;

        case prefix + "jadwaltv":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari jadwal sebuah channel tv, gunakan ${prefix}jadwaltv nama channel\nContoh: ${prefix}jadwaltv trans7\n${prefix}jadwaltv gtv`,
              id
            );
          const tvsearch = body.slice(10);
          kato.reply(from, mess.wait, id);
          try {
            const fortv = await fetch(
              `http://docs-jojo.herokuapp.com/api/jadwaltv?ch=${tvsearch}`
            );
            const tojson = await fortv.json();
            const { result } = await tojson;
            let betv = `*〘 JADWAL TV ${tvsearch} 〙*\n`;
            for (let i = 0; i < result.length; i++) {
              betv += `\n${result[i]}\n`;
            }
            await kato.reply(from, betv, id);
          } catch (err) {
            console.log(err);
            kato.reply(from, `Tv yang anda cari tidak tersedia`, id);
          }
          break;

        case prefix + "faktaunik":
          kato.reply(from, mess.wait, id);
          fetchJson("https://docs-jojo.herokuapp.com/api/fakta-unik")
            .then(async (res) => {
              kato.reply(from, res.result, id).catch((err) => {
                console.log(err);
                kato.reply(from, "Maaf sedang error, coba lagi nanti", id);
              });
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.data, id);
            });
          break;

        case prefix + "ytplaylist":
        case prefix + "playlistyt":
          if (args.length == 0)
            return kato.reply(
              from,
              `mencari sebuah playlist dari youtube gunakan ${prefix}ytplaylist nama playlist\nContoh: ${prefix}ytplaylist good taste music`,
              id
            );
          const playlists = body.slice(12);
          kato.reply(from, mess.wait, id);
          try {
            const ytplays = await fetchJson(
              `https://api.zeks.xyz/api/ytplaylist?apikey=${apikeyvinz}&q=${playlists}`
            );
            if (ytplays.status == false)
              return kato.reply(from, "Playlist yang anda cari tidak ada", id);
            const { result } = await ytplays;
            let playsyt = `*〘 YOUTUBE PLAYLIST 〙*\n`;
            for (let i = 0; i < result.length; i++) {
              playsyt += `\n─────────────────\n\n*•Playlist Name:* ${result[i].title}\n*•Video Count:* ${result[i].video_count}\n*•Playlist ID:* ${result[i].id}\n*•Username:* ${result[i].uploader.username}\n*Playlist Url:* ${result[i].url}\n`;
            }
            await kato.sendFileFromUrl(
              from,
              result[0].thumbnail,
              "thumbnail.jpg",
              playsyt,
              id
            );
          } catch (err) {
            console.log(err);
          }
          break;

        case prefix + "youtubetrending":
        case prefix + "trendingyt":
        case prefix + "trendingyoutube":
        case prefix + "yttrending":
          if (args.length == 0)
            return kato.reply(
              from,
              `Usage : ${prefix}trendingyt countrycode\nContoh : ${prefix}trendingyt id\nContoh 2 : ${prefix}trendingyt usa\nCountry Code bisa ditemukan menggunakan ${prefix}kodebahasa`,
              id
            );
          kato.reply(from, mess.wait, id);
          const trendyt = await axios.get(
            `https://cakrayp.herokuapp.com/api/youtube/trending?country=${args[0]}&page=trending&apikey=${cakrayp}`
          );
          const datatrend = trendyt.data;
          if (datatrend.status == false)
            return kato.reply(from, datatrend.message, id);
          const trendres = datatrend.result;
          let trendtxt = `*「 YOUTUBE TRENDING 」*\n`;
          for (let i = 0; i < trendres.length; i++) {
            trendtxt += `\n─────────────────\n\n• *Title:* ${trendres[i].title}\n• *Duration:* ${trendres[i].duration}\n• *Viewers:* ${trendres[i].viewers}\n• *Uploaded:* ${trendres[i].publishedat}\n• *Channel:* ${trendres[i].channel.name}\n• *Verified:* ${trendres[i].isverified}\n• *Url:* ${trendres[i].video.url}\n• *Description:* ${trendres[i].description}\n`;
          }
          await kato.sendFileFromUrl(
            from,
            trendres[0].thumbnail.url,
            "thumbnail.jpg",
            trendtxt,
            id
          );
          break;
        case prefix + "trendingmusic":
        case prefix + "trendmusic":
          if (args.length == 0)
            return kato.reply(
              from,
              `Usage : ${prefix}trendmusic countrycode\nContoh : ${prefix}trendmusic id\nContoh 2 : ${prefix}trendmusic usa\nCountry Code bisa ditemukan menggunakan ${prefix}kodebahasa`,
              id
            );
          kato.reply(from, mess.wait, id);
          const trendyt2 = await axios.get(
            `https://cakrayp.herokuapp.com/api/youtube/trending?country=${args[0]}&page=music&apikey=${cakrayp}`
          );
          const datatrend2 = trendyt2.data;
          if (datatrend2.status == false)
            return kato.reply(from, datatrend2.message, id);
          const trendres2 = datatrend2.result;
          let trendtxt2 = `*「 YOUTUBE TRENDING MUSIC 」*\n`;
          for (let i = 0; i < trendres2.length; i++) {
            trendtxt2 += `\n─────────────────\n\n• *Title:* ${trendres2[i].title}\n• *Duration:* ${trendres2[i].duration}\n• *Viewers:* ${trendres2[i].viewers}\n• *Uploaded:* ${trendres2[i].publishedat}\n• *Channel:* ${trendres2[i].channel.name}\n• *Verified:* ${trendres2[i].isverified}\n• *Url:* ${trendres2[i].video.url}\n• *Description:* ${trendres2[i].description}\n`;
          }
          await kato.sendFileFromUrl(
            from,
            trendres2[0].thumbnail.url,
            "thumbnail.jpg",
            trendtxt2,
            id
          );
          break;

        case prefix + "trendgaming":
          if (args.length == 0)
            return kato.reply(
              from,
              `Usage : ${prefix}trendgaming countrycode\nContoh : ${prefix}trendgaming id\nContoh 2 : ${prefix}trendgaming usa\nCountry Code bisa ditemukan menggunakan ${prefix}kodebahasa`,
              id
            );
          kato.reply(from, mess.wait, id);
          const trendyt3 = await axios.get(
            `https://cakrayp.herokuapp.com/api/youtube/trending?country=${args[0]}&page=gaming&apikey=${cakrayp}`
          );
          const datatrend3 = trendyt3.data;
          if (datatrend3.status == false)
            return kato.reply(from, datatrend3.message, id);
          const trendres3 = datatrend3.result;
          let trendtxt3 = `*「 YOUTUBE TRENDING GAMING 」*\n`;
          for (let i = 0; i < trendres3.length; i++) {
            trendtxt3 += `\n─────────────────\n\n• *Title:* ${trendres3[i].title}\n• *Duration:* ${trendres3[i].duration}\n• *Viewers:* ${trendres3[i].viewers}\n• *Uploaded:* ${trendres3[i].publishedat}\n• *Channel:* ${trendres3[i].channel.name}\n• *Verified:* ${trendres3[i].isverified}\n• *Url:* ${trendres3[i].video.url}\n• *Description:* ${trendres3[i].description}\n`;
          }
          await kato.sendFileFromUrl(
            from,
            trendres3[0].thumbnail.url,
            "thumbnail.jpg",
            trendtxt3,
            id
          );
          break;

        //Primbon Menu
        case prefix + "zodiak":
          if (args.length !== 4)
            return kato.reply(
              from,
              `Untuk mengecek zodiak, gunakan ${prefix}zodiak nama tanggallahir bulanlahir tahunlahir\nContoh: ${prefix}zodiak fikri 13 06 2004`,
              id
            );
          const cekzodiak = await rugaapi.cekzodiak(args[0], args[1], args[2]);
          await kato.reply(from, cekzodiak, id).catch(() => {
            kato.reply(from, "Maaf sedang error, coba lagi nanti", id);
          });
          break;

        // Random Kata
        case prefix + "tomp3":
          if (isMedia || isQuotedVideo || isVideo) {
            await kato.reply(from, mess.wait, id);
            const encryptMedia = isQuotedVideo ? quotedMsg : message;
            const _mimetype = isQuotedVideo ? quotedMsg.mimetype : mimetype;
            console.log(
              color("[WAPI]", "green"),
              "Downloading and decrypting media..."
            );
            const mediaData = await decryptMedia(encryptMedia, uaOverride);
            const temp = "./temp";
            const name = new Date() * 1;
            const fileInputPath = path.join(
              temp,
              "video",
              `${name}.${_mimetype.replace(/.+\//, "")}`
            );
            const fileOutputPath = path.join(temp, "audio", `${name}.mp3`);
            fs.writeFile(fileInputPath, mediaData, (err) => {
              if (err) return console.error(err);
              ffmpeg(fileInputPath)
                .format("mp3")
                .on("start", (commandLine) =>
                  console.log(color("[FFmpeg]", "green"), commandLine)
                )
                .on("progress", (progress) =>
                  console.log(color("[FFmpeg]", "green"), progress)
                )
                .on("end", async () => {
                  console.log(
                    color("[FFmpeg]", "green"),
                    "Processing finished!"
                  );
                  await kato.sendFile(
                    from,
                    fileOutputPath,
                    "audio.mp3",
                    "",
                    id
                  );
                  console.log(color("[WAPI]", "green"), "Success sending mp3!");
                  setTimeout(() => {
                    fs.unlinkSync(fileInputPath);
                    fs.unlinkSync(fileOutputPath);
                  }, 30000);
                })
                .save(fileOutputPath);
            });
          } else {
            await kato.reply(from, "Format pesan salah", id);
          }
          break;

        case prefix + "fakta2":
          axios
            .get(`https://kocakz.herokuapp.com/api/random/text/faktaunik`)
            .then((res) => {
              const faktuy = `${res.data.result}`;
              kato.reply(from, faktuy, id);
            });
          break;

        case prefix + "quote":
          const quotex = await rugaapi.quote();
          await kato.reply(from, quotex, id).catch(() => {
            kato.reply(from, "Ada yang Error!", id);
          });
          break;
        case prefix + "cerpen":
          kato.reply(from, mess.wait, id);
          axios
            .get(`http://zekais-api.herokuapp.com/cerpen?apikey=${zekais}`)
            .then(async (res) => {
              const ceritanya = `*Judul:* ${res.data.title}\n*Pengarang:* ${res.data.pengarang}\n*Kategori:* ${res.data.category}\n\n*Cerpen:* ${res.data.post}`;
              await kato.reply(from, ceritanya, id).catch((err) => {
                kato.reply(from, "Maaf, sistem sedang error", id);
              });
            })
            .catch((err) => {
              kato.reply(from, err, id);
            });
          break;

        // Search Any
        case prefix + "kusonime":
          if (args.length == 0)
            return kato.reply(
              from,
              `Mencari anime dari website Kusonime, gunakan ${prefix}kusonime judul anime`,
              id
            );
          const carianim = body.slice(10);
          kato.reply(from, mess.wait, id);
          try {
            const kuson = await axios.get(
              `https://zahirr-web.herokuapp.com/api/anime/kusonime?search=${carianim}&apikey=zahirgans`
            );
            const kusondat = kuson.data.result;
            const { download } = kusondat;
            let kusonimx = `*Title:* ${kusondat.title}\n*Title JP:* ${kusondat.title_jp}\n*Genre:* ${kusondat.genre}\n*Season:* ${kusondat.season}\n*Producer:* ${kusondat.producer}\n*Type:* ${kusondat.type}\n*Status:* ${kusondat.status}\n*Score:* ${kusondat.score}\n*Duration:* ${kusondat.duration}\n*Released On:* ${kusondat.released_on}\n*Description:* ${kusondat.description}\n`;
            for (let i = 0; i < download.length; i++) {
              kusonimx += `\n─────────────────\n\n*•Resolution:* ${download[i].resolution}\n*•Web Down:* ${download[i].download_list[0].downloader}\n*•Link Down:* ${download[i].download_list[0].download_link}\n`;
            }
            await kato.sendFileFromUrl(
              from,
              kusondat.thumbs,
              "kusonime.jpg",
              kusonimx,
              id
            );
          } catch (err) {
            console.log(err);
            kato.reply(from, "anime yang anda cari tidak ada", id);
          }
          break;

        case prefix + "sreddit":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari gambar dari sub reddit\nketik: ${prefix}sreddit [search]\ncontoh: ${prefix}sreddit naruto`,
              id
            );
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          const carireddit = body.slice(9);
          const hasilreddit = await images.sreddit(carireddit);
          await kato
            .sendFileFromUrl(from, hasilreddit, "", "", id)
            .catch(() => {
              kato.reply(from, "Ada yang Error!", id);
            });
          break;

        case prefix + "resep":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari resep makanan\nCaranya ketik: ${prefix}resep [search]\n\ncontoh: ${prefix}resep tahu`,
              id
            );
          const cariresep = body.slice(7);
          const hasilresep = await resep.resep(cariresep);
          await kato
            .reply(from, hasilresep + "\n\nIni kak resep makanannya..", id)
            .catch(() => {
              kato.reply(from, "Ada yang Error!", id);
            });
          break;

        case prefix + "stalktiktok":
        case prefix + "stalktik":
        case prefix + "stalktt":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk men-stalk akun Tiktok seseorang\nUsage ${prefix}stalktiktok [username]\ncontoh : ${prefix}stalktiktok @itsandani`,
              id
            );
          kato.reply(from, mess.wait, id);
          const stalktik = await rugaapi.stalktt(args[0]);
          const pictt = await rugaapi.ttpict(args[0]);
          await kato
            .sendFileFromUrl(from, pictt, "", stalktik, id)
            .catch(() => {
              kato.reply(from, "Akun tidak dapat ditemukan...", id);
            });
          break;

        case prefix + "gsmarena":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari spefisikasi handphone dari Website GSMArena\nKetik ${prefix}gsmarena [jenishandphone]`,
              id
            );
          fetchJson(
            `https://api.zeks.me/api/gsmArena?apikey=${apikeyvinz}&q=${body.slice(
              10
            )}`
          ).then(async (res) => {
            if (res.status == false)
              return kato.reply(from, "Barang yang kamu cari tidak ada", id);
            const namabarang = res.data.title;
            const linkbarang = res.data.link;
            const thumbnailhp = res.data.thumb;
            const stringnich = res.data.full_desc.string;
            await kato
              .sendFileFromUrl(
                from,
                thumbnailhp,
                "",
                `Nama: ${namabarang}\nLink: ${linkbarang}\n${stringnich}`,
                id
              )
              .catch((err) => {
                console.log(err);
                kato.reply(from, err.message, id);
              });
          });
          break;

        case prefix + "memeindo":
          await axios
            .get(`https://api.zeks.xyz/api/memeindo?apikey=${apikeyvinz}`)
            .then((res) => {
              kato.sendFileFromUrl(
                from,
                `${res.data.result}`,
                "image.jpg",
                "nehh njeng",
                id
              );
              console.log("Success");
            })
            .catch((err) => {
              kato.reply(from, err, id);
            });
          break;

        case prefix + "darkjokes":
          kato.reply(from, mess.wait, id);
          await axios
            .get(`https://api.zeks.xyz/api/darkjokes?apikey=${apikeyvinz}`)
            .then((res) => {
              kato.sendFileFromUrl(
                from,
                `${res.data.result}`,
                "image.jpg",
                "nehh njeng",
                id
              );
            })
            .catch((err) => {
              console.log(err);
            });
          break;

        case prefix + "stalkig2":
        case prefix + "igstalk":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk men-stalk akun instagram seseorang\nKetik ${prefix}igstalk usernamenya\nContoh: ${prefix}igstalk thoriqazzikraa`,
              id
            );
          kato.reply(from, mess.wait, id);
          fetchJson(
            `https://cakrayp.herokuapp.com/api/instagram/stalk/?username=${body.slice(
              9
            )}&apikey=${cakrayp}`
          )
            .then(async (res) => {
              if (res.status == false)
                return kato.reply(from, res.message.info, id);
              const profilepicx = res.result.profile_pic;
              const usernamex = res.result.username;
              const fullnamex = res.result.fullname;
              const igprivatex = res.result.private;
              const igverifiedx = res.result.verified;
              const bioinstagramx = res.result.biography;
              const followersigx = res.result.followers;
              const followingigx = res.result.following;
              const profileurlx = res.result.profile_url;
              const externalinkx = res.result.mediadata.external_link;
              const mediaresultx = res.result.mediadata.feed_totally;
              const igtxn1 = `• *Username:* ${usernamex}\n• *Name:* ${fullnamex}\n• *Private:* ${igprivatex}\n• *Verified:* ${igverifiedx}\n• *Followers:* ${followersigx}\n• *Following:* ${followingigx}\n• *Total Posts:* ${mediaresultx}\n• *Url Profile:* ${profileurlx}\n• *External Url:* ${externalinkx}\n• *Bio:* ${bioinstagramx}`;
              await kato.sendFileFromUrl(
                from,
                profilepicx,
                "profile.jpg",
                igtxn1,
                id
              );
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "ytmp4":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mendownload video dari youtube\nketik: ${prefix}ytmp4 [link_yt]`,
              id
            );
          rugaapi
            .ymp4v2(body.slice(7))
            .then(async (res) => {
              if (res.status == false)
                return kato.reply(from, "Link tidak valid!", id);
              await kato.sendFileFromUrl(
                from,
                res.result.thumb,
                "thumb.jpg",
                `「 *YOUTUBE MP4* 」\n\n*Title:* ${res.result.title}\n*Size:* ${res.result.size}\n*Quality:* ${res.result.quality}*File Type:* ${res.result.ext}\n\n${mess.sendfilevideo}`,
                id
              );
              await kato
                .sendFileFromUrl(from, res.result.link, "", "", id)
                .catch(() => {
                  kato.reply(from, "Terjadi kesalahan, silahkan coba lagi", id);
                });
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        // case prefix + "nekopoi":
        //   axios
        //     .get(`https://urbaez.my.id/api/anime/nekopoi/random`)
        //     .then(async (res) => {
        //       await kato
        //         .sendFileFromUrl(
        //           from,
        //           `${res.data[0].image}`,
        //           "",
        //           `「 *NEKOPOI* 」\n\n*Judul :* ${res.data[0].title}\n*Link :* ${res.data[0].link}`,
        //           id
        //         )
        //         .catch(() => {
        //           kato.reply(from, "Error !", id);
        //         });
        //     });
        //   break;

        case prefix + "postig":
          if (args.length == 0)
            return kato.reply(
              from,
              `Fitur untuk mendownload postingan dengan banyak dari instagram seseorang\nketik ${prefix}postig url jumlah\ncontoh: ${prefix}postig https://www.instagram.com/p/CPdHEUAHjls/ 3`,
              id
            );
          const jml = args[0];
          const jml2 = args[1];
          kato.reply(from, mess.wait, id);
          try {
            const wall = await axios.get(
              `https://cakrayp.herokuapp.com/api/instagram/feeds?url=${jml}&apikey=${cakrayp}`
            );
            const wall2 = wall.data;
            if (jml2 > 7) return kato.reply(from, "Maksimal 7!", id);
            for (let i = 0; i < jml2; i++) {
              await kato.sendFileFromUrl(
                from,
                wall2.result.link[i].url,
                "",
                "",
                id
              );
            }
          } catch (err) {
            console.log(err);
            kato.reply(
              from,
              "Terjadi kesalahan pada sistem, silahkan coba lagi!",
              id
            );
          }
          break;

        case prefix + "spotifysearch":
        case prefix + "searchspotify":
          if (args.length == 0)
            return kato.reply(
              from,
              `Menampilkan list spotify yang anda cari!\nGunakan ${prefix}spotifysearch judul lagu\nContoh: ${prefix}spotifysearch young`,
              id
            );
          const carispotify = body.slice(15);
          kato.reply(from, mess.wait, id);
          const spotifyapi = await axios.get(
            `https://api.zeks.me/api/spotify?apikey=${apikeyvinz}&q=${carispotify}`
          );
          const spotifydata = spotifyapi.data;
          const spotres = spotifydata.data;
          let spotifytext = `*「 S P O T I F Y 」*\n`;
          for (let i = 0; i < spotres.length; i++) {
            spotifytext += `\n─────────────────\n\n*•Title:* ${spotres[i].title}\n*•Artists:* ${spotres[i].artists}\n*•Album:* ${spotres[i].album}\n*•Url:* ${spotres[i].url}\n`;
          }
          await kato
            .sendFileFromUrl(from, spotres[0].thumb, "img.jpg", spotifytext, id)
            .catch((err) => {
              console.log(err);
              kato.reply(from, "Terjadi kesalahan, silahkan ulangi", id);
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "spotifydown":
          if (args.length == 0)
            return kato.reply(
              from,
              `Mendownload lagu dari spotify menggunakan link spotify\nPenggunaan : ${prefix}spotifydown url track\nContoh : ${prefix}spotifydown https://open.spotify.com/track/3OP8UeYimRl9HCNxMg7Ihl`,
              id
            );
          const linkspot = body.slice(13);
          kato.reply(from, mess.wait, id);
          rugaapi
            .spotify2(linkspot)
            .then(async (res) => {
              if (res.status == 400)
                return kato.reply(
                  from,
                  "Link tidak valid atau rest api sedang error!",
                  id
                );
              kato.sendFileFromUrl(
                from,
                res.thumbnail,
                "thumb.jpg",
                `「 *SPOTIFY* 」\n\n*•Title:* ${res.title}\n*•Artists:* ${res.artists}\n*•Album:* ${res.album}\n*•Release Date:* ${res.release}\n\n${mess.sendfileaudio}`,
                id
              );
              kato.sendFileFromUrl(from, res.mp3, "", "", id).catch((err) => {
                console.log(err);
                kato.reply(from, "Meng-error", id);
              });
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "spotify":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari lagu dari spotify, gunakan ${prefix}spotify2 judul lagu`,
              id
            );
          const carispot2 = body.slice(9);
          const spos2 = await axios.get(
            `https://api.zeks.me/api/spotify?apikey=${apikeyvinz}&q=${carispot2}`
          );
          kato.reply(from, mess.wait, id);
          kato.sendFileFromUrl(
            from,
            spos2.data.data[0].thumb,
            "thumb.jpg",
            `「 *SPOTIFY* 」\n\n*•Title:* ${spos2.data.data[0].title}\n*•Artists:* ${spos2.data.data[0].artists}\n*•Album:* ${spos2.data.data[0].album}\n*•Url:* ${spos2.data.data[0].url}\n\n${mess.sendfileaudio}`,
            id
          );
          rugaapi
            .spotify(spos2.data.data[0].url)
            .then(async (res) => {
              if (res.status == 500)
                return kato.reply(
                  from,
                  "Link tidak valid atau rest api sedang error",
                  id
                );
              kato.sendFileFromUrl(from, res.mp3, "", "", id).catch(() => {
                kato.reply(from, "Meng-error", id);
              });
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "exec":
          if (!isOwner)
            return kato.reply(
              from,
              `Perintah ini hanya bisa di gunakan oleh Owner Bot!`,
              id
            );
          if (!q)
            return await kato.reply(from, `Masukkan kode command prompt`, id);
          //const execute = require("child_process")
          var spawn = require("child_process").exec;
          function os_func() {
            this.execCommand = function (command) {
              return new Promise((resolve, reject) => {
                spawn(command, (error, stdout) => {
                  if (error) {
                    reject(error);
                    return;
                  }
                  resolve(stdout);
                });
              });
            };
          }
          var oz = new os_func();
          oz.execCommand(q)
            .then((res) => {
              kato.reply(from, `> root@4ndrexyz:~ # ${res}`, id);
            })
            .catch((err) => {
              return kato.reply(from, `> root@4ndrexyz:~ # ${err}`, id);
              //console.log("os >>>", err);
            });
          break;

        case prefix + "ytmp4hd":
          if (args.length == 0)
            return kato.reply(
              from,
              `Masukkan link youtube, contoh : ${prefix}ytmp4hd https://www.youtube.com/watch?v=WuWfNapyjKI`,
              id
            );
          axios
            .get(
              `https://api.dapuhy.ga/api/socialmedia/aiovideodl?url=${body.slice(
                9
              )}&apikey=${dapuhyapi}`
            )
            .then(async (res) => {
              if (res.data.status == 500)
                return kato.reply(
                  from,
                  "Link tidak valid atau mungkin Rest Api sedang error",
                  id
                );
              if (res.data.status == 400)
                return kato.reply(from, res.data.message, id);
              kato.sendFileFromUrl(
                from,
                res.data.thumb,
                "img.jpg",
                `「 *YT MP4 HD* 」\n\nTitle: ${res.data.title}\nDuration: ${res.data.duration}\nQuality: ${res.data.medias[2].quality}\nSize: ${res.data.medias[2].formattedSize}\n\n${mess.sendfilevideo}`,
                id
              );
              await kato.sendFileFromUrl(
                from,
                res.data.medias[2].url,
                `${res.data.title}.mp4`,
                `*${res.data.title}`,
                id
              );
            })
            .catch((err) => {
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "play": //silahkan kalian custom sendiri jika ada yang ingin diubah
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari lagu dari youtube\n\nPenggunaan: ${prefix}play judul lagu`,
              id
            );
          //axios.get(`https://cakrayp.herokuapp.com/api/youtube/search?query=${body.slice(6)}&apikey=${cakrayp}`)
          axios
            .get(
              `http://docs-jojo.herokuapp.com/api/yt-search?q=${body.slice(6)}`
            )
            //fetchJson(`https://api.zeks.xyz/api/yts?apikey=${apikeyvinz}&q=${body.slice(6)}`)
            .then(async (res) => {
              if (res.data.status == false)
                return kato.reply(from, "Rest Api sedang error", id);
              console.log(
                color(
                  `Nickname : ${pushname}\nNomor : ${serial.replace(
                    "@c.us",
                    ""
                  )}\nJudul: ${res.data.result.result[0].title}\nDurasi: ${
                    res.data.result.result[0].duration
                  } seconds`,
                  "aqua"
                )
              );
              const thumbnailytHD = res.data.result.result[0].thumbnails[1].url;
              const thumbnailytSD = res.data.result.result[0].thumbnails[0].url;
              if (thumbnailytHD == undefined || thumbnailytHD == "") {
                var changethumb = thumbnailytSD;
              } else {
                var changethumb = thumbnailytHD;
              }
              await kato.sendFileFromUrl(
                from,
                changethumb,
                "thumb.jpg",
                `「 *PLAY* 」\n\nJudul: ${res.data.result.result[0].title}\nDurasi: ${res.data.result.result[0].duration} seconds\nViews: ${res.data.result.result[0].viewCount.text}\nUploaded: ${res.data.result.result[0].publishedTime}\nChannel: ${res.data.result.result[0].channel.name}\nUrl: ${res.data.result.result[0].link}\n\n${mess.sendfileaudio}`,
                id
              );
              //await kato.sendFileFromUrl(from, res.data.result[0].thumbnail, 'thumbnail.jpg', `「 *PLAY* 」\n\n*Title:* ${res.data.result[0].title}\n*Duration:* ${res.data.result[0].timestamp} seconds\n*Views:* ${res.data.result[0].views}\n*Uploaded:* ${res.data.result[0].ago}\n*Channel:* ${res.data.result[0].author.name}\n*Url:* ${res.data.result[0].url}\n\n*_Wait, audio sedang dikirim_*`, id)
              //await kato.sendFileFromUrl(from, res.result[0].video.thumbnail_src, 'thumb.jpg', `「 *PLAY* 」\n\n*Title:* ${res.result[0].video.title}\n*Duration:* ${res.result[0].video.duration} detik\n*Views:* ${res.result[0].video.views}\n*Uploaded:* ${res.result[0].video.upload_date}\n*Channel:* ${res.result[0].uploader.username}\n*Verified Channel:* ${res.result[0].uploader.verified}\n*Url:* ${res.result[0].video.url}\n\n*_Waitt, lagi ngirim Audionyaa_*`, id)
              rugaapi
                .ymp3v2(`https://youtu.be/${res.data.result.result[0].id}`)
                .then(async (res) => {
                  if (res.status == false)
                    return kato.reply(from, "Rest Api sedang error", id);
                  const playlink = res.result.link;
                  kato.sendFileFromUrl(from, playlink, "", "", id);
                });
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "trendingtwit":
        case prefix + "trendtwit":
          await kato.reply(from, mess.wait, id);
          rugaapi
            .trend()
            .then(async ({ result }) => {
              let trend = "-----[ *TRENDING TWITTER* ]-----";
              for (let i = 0; i < result.length; i++) {
                trend += `\n\n➸ *Hashtag :* ${result[i].hastag}\n➸ *Trending Number :* ${result[i].rank}\n➸ *Jumlah Tweets :* ${result[i].tweet}\n➸ *Link :* ${result[i].link}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`;
              }
              await kato.reply(from, trend, id);
              console.log("Success sending Trending Tweets");
            })
            .catch(async (err) => {
              console.error(err);
              await kato.reply(from, "Error!", id);
            });
          break;

        case prefix + "playvid": //silahkan kalian custom sendiri jika ada yang ingin diubah
        case prefix + "play2":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mencari video dari youtube\n\nPenggunaan: ${prefix}play judul video`,
              id
            );
          //axios.get(`https://cakrayp.herokuapp.com/api/youtube/search?query=${body.slice(9)}&apikey=${cakrayp}`)
          axios
            .get(
              `http://docs-jojo.herokuapp.com/api/yt-search?q=${body.slice(9)}`
            )
            //fetchJson(`https://api.zeks.xyz/api/yts?apikey=${apikeyvinz}&q=${body.slice(6)}`)
            .then(async (res) => {
              if (res.data.status == false)
                return kato.reply(from, "Rest Api sedang error", id);
              console.log(
                color(
                  `Nickname : ${pushname}\nNomor : ${serial.replace(
                    "@c.us",
                    ""
                  )}\nJudul: ${res.data.result.result[0].title}\nDurasi: ${
                    res.data.result.result[0].duration
                  } seconds`,
                  "aqua"
                )
              );
              const thumbnailytHD2 =
                res.data.result.result[0].thumbnails[1].url;
              const thumbnailytSD2 =
                res.data.result.result[0].thumbnails[0].url;
              if (thumbnailytHD2 == undefined || thumbnailytHD2 == "") {
                var changethumb2 = thumbnailytSD2;
              } else {
                var changethumb2 = thumbnailytSD2;
              }
              await kato.sendFileFromUrl(
                from,
                changethumb2,
                "thumb.jpg",
                `「 *PLAY* 」\n\nJudul: ${res.data.result.result[0].title}\nDurasi: ${res.data.result.result[0].duration} seconds\nViews: ${res.data.result.result[0].viewCount.text}\nUploaded: ${res.data.result.result[0].publishedTime}\nChannel: ${res.data.result.result[0].channel.name}\nUrl: ${res.data.result.result[0].link}\n\n${mess.sendfilevideo}`,
                id
              );
              //await kato.sendFileFromUrl(from, res.data.result[0].thumbnail, 'thumbnail.jpg', `「 *PLAY* 」\n\n*Title:* ${res.data.result[0].title}\n*Duration:* ${res.data.result[0].timestamp} seconds\n*Views:* ${res.data.result[0].views}\n*Uploaded:* ${res.data.result[0].ago}\n*Channel:* ${res.data.result[0].author.name}\n*Url:* ${res.data.result[0].url}\n\n*_Wait, video sedang dikirim_*`, id)
              //await kato.sendFileFromUrl(from, res.result[0].video.thumbnail_src, 'thumb.jpg', `「 *PLAY* 」\n\n*Title:* ${res.result[0].video.title}\n*Duration:* ${res.result[0].video.duration} detik\n*Views:* ${res.result[0].video.views}\n*Uploaded:* ${res.result[0].video.upload_date}\n*Channel:* ${res.result[0].uploader.username}\n*Verified Channel:* ${res.result[0].uploader.verified}\n*Url:* ${res.result[0].video.url}\n\n*_Waitt, lagi ngirim Audionyaa_*`, id)
              rugaapi
                .ymp4v2(`https://youtu.be/${res.data.result.result[0].id}`)
                .then(async (res) => {
                  if (res.status == false)
                    return kato.reply(from, "Rest Api sedang error", id);
                  kato.sendFileFromUrl(from, res.result.link, "", "", id);
                });
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        // Other Command
        case prefix + "resi":
          if (args.length !== 2)
            return kato.reply(
              from,
              `Maaf, format pesan salah.\nSilahkan ketik pesan dengan ${prefix}resi <kurir> <no_resi>\n\nKurir yang tersedia:\njne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex`,
              id
            );
          const kurirs = [
            "jne",
            "pos",
            "tiki",
            "wahana",
            "jnt",
            "rpx",
            "sap",
            "sicepat",
            "pcp",
            "jet",
            "dse",
            "first",
            "ninja",
            "lion",
            "idl",
            "rex",
          ];
          if (!kurirs.includes(args[0]))
            return kato.sendText(
              from,
              `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(
                ", "
              )} Tolong periksa kembali.`
            );
          console.log(
            "Memeriksa No Resi",
            args[1],
            "dengan ekspedisi",
            args[0]
          );
          cekResi(args[0], args[1]).then((result) =>
            kato.sendText(from, result)
          );
          break;

        case prefix + "tts":
          if (args.length == 0)
            return kato.reply(
              from,
              `Mengubah teks menjadi sound (google voice)\nketik: ${prefix}tts <kode_bahasa> <teks>\ncontoh : ${prefix}tts id halo\nuntuk kode bahasa cek disini : https://anotepad.com/note/read/5xqahdy8\n\nAtau kalian bisa menggunakan command ${prefix}kodebahasa`,
              id
            );
          const ttsGB = require("node-gtts")(args[0]);
          const dataText = body.slice(8);
          if (dataText === "")
            return kato.reply(from, "apa teksnya syg..", id);
          try {
            ttsGB.save("./media/tts.mp3", dataText, function () {
              kato.sendPtt(from, "./media/tts.mp3", id);
              setTimeout(() => {
                fs.unlinkSync("./media/tts.mp3");
              }, 30000);
            });
          } catch (err) {
            kato.reply(from, err, id);
          }
          break;

        case prefix + "bapakfont":
          if (args.length == 0)
            return kato.reply(
              from,
              `Mengubah kalimat menjadi alayyyyy\n\nketik ${prefix}bapakfont kalimat`,
              id
            );
          rugaapi.bapakfont(body.slice(11)).then(async (res) => {
            await kato.reply(from, `${res}`, id);
          });
          break;

        // Group Commands (group admin only)
        case prefix + "add":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Gagal, perintah ini hanya dapat digunakan oleh admin grup!, Member mah gosah sok keras",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Gagal, kalo mau pake fitur ini, jadiin gua admin",
              id
            );
          if (args.length !== 1)
            return kato.reply(
              from,
              `Untuk menggunakan ${prefix}add\nPenggunaan: ${prefix}add <nomor>\ncontoh: ${prefix}add 628xxx`,
              id
            );
          try {
            await kato.addParticipant(from, `${args[0]}@c.us`);
          } catch {
            kato.reply(from, "Target hilang diradar, Enemies Ahead!", id);
          }
          break;
        case prefix + "pkick":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Gagal, fitur ini bakalan work kalo dipake sama admin, member mah gausah sok keras",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Gagal, kalo mau pake fitur ini, jadiin gw admin",
              id
            );
          if (mentionedJidList.length === 0)
            return kato.reply(
              from,
              "Maaf, format pesan salah.\nSilahkan tag satu atau lebih orang yang akan dikeluarkan",
              id
            );
          if (mentionedJidList[0] === botNumber)
            return await kato.reply(
              from,
              "Maaf, format pesan salah.\nTidak dapat mengeluarkan akun bot sendiri",
              id
            );
          await kato.sendTextWithMentions(
            from,
            `Done!, mengeluarkan ${mentionedJidList
              .map((x) => `@${x.replace("@c.us", "")} agar menjadi anak pungut`)
              .join("\n")}`
          );
          for (let i = 0; i < mentionedJidList.length; i++) {
            if (ownerNumber.includes(mentionedJidList[i]))
              return kato.reply(
                from,
                "Kamu siapa ? tidak bisa mengkick Pacar saya",
                id
              );
            if (groupAdmins.includes(mentionedJidList[i]))
              return await kato.reply(
                from,
                "GOBLOK, Mana bisa ngekick admin tolol",
                id
              );
            await kato.removeParticipant(groupId, mentionedJidList[i]);
          }
          break;

        case prefix + "kick":
          var qmid2 = quotedMsgObj.sender.id;
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Gagal, fitur ini bakalan work kalo dipake sama admin, member mah gausah sok keras",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Gagal, kalo mau pake fitur ini, jadiin gw admin",
              id
            );
          try {
            if (ownerNumber.includes(qmid2))
              return kato.reply(from, "Siapa lu mau ngekick Owner gua?", id);
            if (botNumber.includes(qmid2))
              return kato.reply(from, "mau ngekick gua kah akwoakwoo", id);
            await kato.removeParticipant(groupId, qmid2);
          } catch {
            kato.reply(from, "Maaf, terjadi kesalahan", id);
          }
          break;

        case prefix + "opromote":
          var senderx = quotedMsgObj.sender.id;
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya bisa digunakan didalam Grup!",
              id
            );
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh Admin Grup!",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan ketika Bot menjadi Admin",
              id
            );
          await kato.promoteParticipant(groupId, senderx);
          await kato.sendText(from, `Donee!\n\nAsek diangkat derajatnya`);
          break;

        case prefix + "promote":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins)
            return kato.reply(
              from,
              "Gagal, fitur ini hanya bisa dipake oleh admin saja",
              id
            );
          if (!isBotGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Gagal, kalo mau pake fitur ini jadiin gw admin",
              id
            );
          if (mentionedJidList.length !== 1)
            return kato.reply(from, "Maaf, hanya bisa mempromote 1 user", id);
          if (groupAdmins.includes(mentionedJidList[0]))
            return await kato.reply(
              from,
              "GOBLOG, tuh anak udah jadi admin bego.",
              id
            );
          if (mentionedJidList[0] === botNumber)
            return await kato.reply(
              from,
              "Maaf, format pesan salah.\nTidak dapat mempromote akun bot sendiri",
              id
            );
          await kato.promoteParticipant(groupId, mentionedJidList[0]);
          await kato.sendTextWithMentions(
            from,
            `Done, ciee, @${mentionedJidList[0].replace(
              "@c.us",
              ""
            )} Diangkat derajatnyaaa xixi.`
          );
          break;

        case prefix + "demoteme":
          if (!isGroupAdmins)
            return kato.reply(from, "cuman bisa dipake sama Admin!", id);
          if (!isBotGroupAdmins)
            return kato.reply(from, "Jadiin admin dulu", id);
          await kato.demoteParticipant(groupId, serial);
          await kato.sendText(
            from,
            `request diterima, ${pushname} ingin jadi babi karna dia kepengen`
          );
          await kato.promoteParticipant(groupId, serial);
          await kato.sendText(from, `Prank boiss, jadi admin lagi kok`);
          break;

        case prefix + "odemote":
          var sendis = quotedMsgObj.sender.id;
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, fitur ini hanya bisa digunakan didalam Grup!",
              id
            );
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Gagal, fitur ini bakalan work kalo dipake sama Admin",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Silahkan tambahkan bot menjadi admin agar bisa mendemote seseorang",
              id
            );
          await kato.demoteParticipant(groupId, sendis);
          await kato.sendText(from, `Donee!, mampus jadi Babi lu kan`);
          break;

        case prefix + "demote":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Gagal, fitur ini bakalan work kalo dipake sama admin, member mah gausah sok keras",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Gagal, kalo mau pake fitur ini, jadiin gw admin",
              id
            );
          if (mentionedJidList.length !== 1)
            return kato.reply(from, "Maaf, hanya bisa mendemote 1 user", id);
          if (!groupAdmins.includes(mentionedJidList[0]))
            return await kato.reply(
              from,
              "GOBLOG, tuh anak udah belom jadi admin mau lu demote. mana bisa tolol.",
              id
            );
          if (mentionedJidList[0] === botNumber)
            return await kato.reply(
              from,
              "Maaf, format pesan salah.\nTidak dapat mendemote akun bot sendiri",
              id
            );
          await kato.demoteParticipant(groupId, mentionedJidList[0]);
          await kato.sendTextWithMentions(
            from,
            `Done, Mampus lu @${mentionedJidList[0].replace(
              "@c.us",
              ""
            )} Jadi babi lu kan :v`
          );
          break;

        case prefix + "bye":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Gagal, fitur ini bakalan work kalo dipake sama admin, member mah gausah sok keras",
              id
            );
          kato
            .sendText(from, "Jahat kelen sama aku... ( ⇀‸↼‶ )")
            .then(() => kato.leaveGroup(groupId));
          break;

        case prefix + "del":
        case prefix + "delete":
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Gagal, fitur ini bakalan work kalo dipake sama admin, member mah gausah sok keras",
              id
            );
          if (!quotedMsg)
            return kato.reply(
              from,
              `Maaf, format pesan salah silahkan.\nReply pesan bot dengan caption ${prefix}del`,
              id
            );
          if (!quotedMsgObj.fromMe)
            return kato.reply(
              from,
              `Maaf, format pesan salah silahkan.\nReply pesan bot dengan caption ${prefix}del`,
              id
            );
          kato.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
          break;

        case prefix + "sandwriting":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          if (args.length === 0)
            return kato.reply(
              from,
              `Kirim perintah *${prefix}sandwriting [ Teks ]*\nContoh *${prefix}sandwriting Kato Cantik*`,
              id
            );
          const swrt = body.slice(13);
          try {
            const swrt2 = await axios.get(
              "https://api.vhtear.com/sand_writing?text1=" +
                swrt +
                "&apikey=" +
                vhtearkey
            );
            const { imgUrl } = swrt2.data.result;
            const swrt3 = `*「 SAND WRITING 」*
*Text : ${swrt}*`;
            const pictk = await bent("buffer")(imgUrl);
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`;
            kato.sendImage(from, base64, swrt3);
          } catch (err) {
            console.error(err.message);
            await kato.sendFileFromUrl(
              from,
              errorurl2,
              "error.png",
              "💔️ Maaf, User tidak ditemukan"
            );
            kato.sendText(from, "Sand Writing Error : " + err);
          }
          break;

        case prefix + "attp":
          if (args.length == 0)
            return kato.reply(from, "teksnya mana sayang?", id);
          const txtx = body.slice(6);
          const beattp = await axios.get(
            `https://api.xteam.xyz/attp?text=${txtx}`
          );
          const beresult = beattp.data.result;
          kato.sendRawWebpAsSticker(from, beresult);
          break;

        case prefix + "tahta":
          const jreng = body.slice(7);
          if (!jreng)
            return kato.reply(
              from,
              `Kirim perintah *${prefix}tahta [teks]*\n\nContoh *${prefix}tahta elaina*`,
              id
            );
          if (jreng.length > 7)
            return kato.reply(from, "Maksimal 7 Huruf!", id);
          kato.reply(from, "_Sedang diproses, mohon tunggu sebentar!..._", id);
          const tahtuy = `https://api.zeks.xyz/api/hartatahta?text=${jreng}&apikey=${apikeyvinz}`;
          kato.sendFileFromUrl(
            from,
            tahtuy,
            `${jreng}.jpg`,
            `*_Harta_*\n*_Tahta_*\n*_${jreng}_*`,
            id
          );
          kato
            .sendImageAsSticker(from, tahtuy, StickerMetadata)
            .catch(() => {
              kato.reply(from, "Error", id);
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "github":
        case prefix + "githubstalk":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk men-stalk akun Github seseorang\nKetik : ${prefix}github [username]\nContoh : ${prefix}github 4ndrexyz`,
              id
            );
          const gitstalk = await rugaapi.github(args[0]);
          const gitpict = await rugaapi.githubpict(args[0]);
          await kato
            .sendFileFromUrl(from, gitpict, "", gitstalk, id)
            .catch(() => {
              kato.reply(
                from,
                "Username salah, silahkan masukkan username yang benar",
                id
              );
            });
          break;

        case prefix + "prediksicuaca":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk memprediksi cuaca Kota gunakan ${prefix}prediksicuaca [namakota]\nContoh : ${prefix}prediksicuaca Pontianak`,
              id
            );
          const predik = await axios.get(
            `https://api.vhtear.com/weather?city=${body.slice(
              15
            )}&apikey=${vhtearkey}`
          );
          const iksi = predik.data.result;
          const resil = `${iksi.weather}\n\n${iksi.location}`;
          kato.reply(from, resil, id).catch(() => {
            return kato.reply(
              from,
              "Kota yang anda ketik tidak ditemukan...",
              id
            );
          });
          break;

        case prefix + "happymod":
          if (args.length == 0)
            return kato.reply(
              from,
              `Fitur untuk mencari sebuah aplikasi mod dari Happymod\nContoh : ${prefix}happymod pubg`,
              id
            );
          const happymod = await axios.get(
            `https://zekais-api.herokuapp.com/happymodsr?query=${body.slice(
              10
            )}&apikey=${zekais}`
          );
          const hppy = happymod.data;
          const modo = hppy.result;
          if (modo.length == 0)
            return kato.reply(from, "Tidak dapat menemukan hasil", id);
          let resmod = `*「 HAPPY MOD 」*\n`;
          for (let i = 0; i < modo.length; i++) {
            resmod += `\n─────────────────\n\n• *Title:* ${modo[i].name}\n• *Rating:* ${modo[i].rating}\n• *Url:* ${modo[i].url}\n`;
          }
          kato
            .sendFileFromUrl(from, modo[0].thumb, "HAPPYMOD.jpg", resmod, id)
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "burn":
          if (args.length == 0) return kato.reply(from, `textnya mana ?`, id);
          const initextnya = body.slice(6);
          await kato.sendFileFromUrl(
            from,
            `http://zekais-api.herokuapp.com/sbburn?text=${initextnya}&apikey=${zekais}`,
            "",
            "",
            id
          );
          break;

        case prefix + "wame":
          const gethosts = await kato.getProfilePicFromServer(sender.id);
          if (gethosts == undefined) {
            var pfp = errorurl;
          } else {
            var pfp = gethosts;
          }
          await kato.sendFileFromUrl(
            from,
            pfp,
            "",
            `wa.me/${serial.replace(/@c.us/g, "")}`,
            id
          );
          break;

        case prefix + "oedotensei":
          var qmes = quotedMsgObj.sender.id;
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan didalam Grup!",
              id
            );
          if (!isGroupAdmins && !isOwnerB)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh Admin Grup!",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan ketika Bot menjadi Admin",
              id
            );
          try {
            if (ownerNumber.includes(qmes))
              return kato.reply(from, "Siapa lu mau ngekick Owner gua?", id);
            if (botNumber.includes(qmes))
              return kato.reply(from, "mau ngekick gua kah? akwoakwoa", id);
            await kato.removeParticipant(groupId, qmes);
            await sleep(1000);
            await kato.addParticipant(from, qmes);
          } catch {
            kato.reply(from, "Maaf, terjadi kesalahan", id);
          }
          break;

        case prefix + "edotensei":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Fitur ini hanya bisa di gunakan dalam group",
              id
            );
          if (!isGroupAdmins)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan oleh Admin group",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan ketika bot menjadi admin",
              id
            );
          if (mentionedJidList.length === 0)
            return kato.reply(
              from,
              "Fitur untuk menghapus member lalu menambahkan member kembali,kirim perintah ${prefix}edotensei @tagmember",
              id
            );
          for (let i = 0; i < mentionedJidList.length; i++) {
            if (groupAdmins.includes(mentionedJidList[i]))
              return kato.reply(from, mess.error.Ki, id);
            if (ownerNumber.includes(mentionedJidList[i]))
              return kato.reply(from, "Tidak bisa mengeluarkan owner Bot");
            await kato.removeParticipant(groupId, mentionedJidList[i]);
            await sleep(1000);
            await kato.addParticipant(from, `${mentionedJidList}`);
          }
          break;

        case prefix + "infoall":
        case prefix + "everyone":
        case prefix + "tagall":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins & !isOwnerB)
            return kato.reply(
              from,
              "Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
              id
            );
          const textInfo = body.slice(8);
          const namagcnih = name;
          const memchu = chat.groupMetadata.participants.length;
          const groupMem = await kato.getGroupMembers(groupId);
          let hehex = `Name Group : *${namagcnih}*\n\nTotal Members : *${memchu}*\n\n╔══✪〘 Mention All 〙✪══\n╠\n`;
          for (let i = 0; i < groupMem.length; i++) {
            hehex += `╠➥`;
            hehex += ` @${groupMem[i].id.replace(/@c.us/g, "")}\n`;
          }
          hehex += "╠\n╚═〘 *K A T O  B O T* 〙";
          await kato.sendTextWithMentions(
            from,
            `Info dari : @${sender.id.replace(/@c.us/g, "")}\n\n` +
              textInfo +
              "\n\n" +
              hehex
          );
          break;

        case prefix + "mutegrup":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins)
            return kato.reply(
              from,
              "Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Gagal, silahkan tambahkan bot sebagai admin grup!",
              id
            );
          if (args.length !== 1)
            return kato.reply(
              from,
              `Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on --aktifkan\n${prefix}mutegrup off --nonaktifkan`,
              id
            );
          if (args[0] == "on") {
            kato
              .setGroupToAdminsOnly(groupId, true)
              .then(() =>
                kato.sendText(
                  from,
                  "Berhasil mengubah agar hanya admin yang dapat chat!"
                )
              );
          } else if (args[0] == "off") {
            kato
              .setGroupToAdminsOnly(groupId, false)
              .then(() =>
                kato.sendText(
                  from,
                  "Berhasil mengubah agar semua anggota dapat chat!"
                )
              );
          } else {
            kato.reply(
              from,
              `Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on --aktifkan\n${prefix}mutegrup off --nonaktifkan`,
              id
            );
          }
          break;

        case prefix + "seticon":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (!isGroupAdmins)
            return kato.reply(
              from,
              "Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Gagal, silahkan tambahkan bot sebagai admin grup!",
              id
            );
          if ((isMedia && type == "image") || isQuotedImage) {
            const dataMedia = isQuotedImage ? quotedMsg : message;
            const _mimetype = dataMedia.mimetype;
            const mediaData = await decryptMedia(dataMedia, uaOverride);
            const imageBase64 = `data:${_mimetype};base64,${mediaData.toString(
              "base64"
            )}`;
            await kato.setGroupIcon(groupId, imageBase64);
          } else if (args.length === 1) {
            if (!isUrl(url)) {
              await kato.reply(
                from,
                "Maaf, link yang kamu kirim tidak valid.",
                id
              );
            }
            kato
              .setGroupIconByUrl(groupId, url)
              .then((r) =>
                !r && r !== undefined
                  ? kato.reply(
                      from,
                      "Maaf, link yang kamu kirim tidak memuat gambar.",
                      id
                    )
                  : kato.reply(from, "Berhasil mengubah profile group", id)
              );
          } else {
            kato.reply(
              from,
              `Commands ini digunakan untuk mengganti icon/profile group chat\n\n\nPenggunaan:\n1. Silahkan kirim/reply sebuah gambar dengan caption ${prefix}setprofile\n\n2. Silahkan ketik ${prefix}setprofile linkImage`
            );
          }
          break;

        //Owner Group
        case prefix + "kickall": //mengeluarkan semua member
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          let isOwnerGroup = sender.id === chat.groupMetadata.owner;
          if (!isOwnerGroup)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat digunakan oleh Owner Grup!",
              id
            );
          if (!isBotGroupAdmins)
            return kato.reply(
              from,
              "Gagal, silahkan tambahkan bot sebagai admin grup!",
              id
            );
          const allMem = await kato.getGroupMembers(groupId);
          for (let i = 0; i < allMem.length; i++) {
            if (groupAdmins.includes(allMem[i].id)) {
            } else {
              await kato.removeParticipant(groupId, allMem[i].id);
            }
          }
          kato.reply(from, "Success kick all member", id);
          break;

        //Owner Bot
        case prefix + "oblock":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          var qmblock = quotedMsgObj.sender.id;
          kato.contactBlock(qmblock);
          kato.reply(from, "Berhasil blokir kontak", id);
          break;
        case prefix + "oaddprem":
          var qmbann = quotedMsgObj.sender.id;
          if (!isOwnerB)
            return kato.reply(from, "Perintah ini hanya untuk Owner bot!", id);
          try {
            prem.push(qmbann);
            fs.writeFileSync("./lib/database/prem.json", JSON.stringify(prem));
            kato.reply(from, "Success add member to Premium user!", id);
          } catch {
            kato.reply(from, "Maaf, terjadi kesalan", id);
          }
          break;

        case prefix + "unblock":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh owner Bot!",
              id
            );
          var qmunblok = quotedMsgObj.sender.id;
          kato.contactUnblock(qmunblok);
          kato.reply(from, "Berhasil unblock kontak", id);
          break;

        case prefix + "unblocked":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh owner (4ndrexyz) bot!",
              id
            );
          kato.contactUnblock(args[0] + "@c.us");
          kato.reply(from, "Berhasil unblock kontak", id);
          break;

        case prefix + "odelprem":
          var qmban2 = quotedMsgObj.sender.id;
          if (!isOwnerB)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          try {
            let xnxx = prem.indexOf(qmban2);
            prem.splice(xnxx, 1);
            fs.writeFileSync("./lib/database/prem.json", JSON.stringify(prem));
            kato.reply(from, "Success delete Premium member!", id);
          } catch {
            kato.reply(
              from,
              "Maaf, terjadi kesalahan saat membanned member",
              id
            );
          }
          break;

        case prefix + "block":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya bisa digunakan oleh owner bot!",
              id
            );
          kato.contactBlock(args[0] + "@c.us");
          kato.reply(from, "Berhasil memblokir kontak", id);
          break;

        case prefix + "addprem":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk menambah seseorang menjadi member premium`,
              id
            );
          prem.push(args[0] + "@c.us");
          fs.writeFileSync("./lib/database/prem.json", JSON.stringify(prem));
          kato.reply(from, "success add", id);
          break;

        case prefix + "addcecan":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Maaf, fitur ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          if ((isMedia && isImage) || isQuotedImage) {
            await kato.reply(from, mess.wait, id);
            const encryptMedia2 = isQuotedImage ? quotedMsg : message;
            const medta2 = await decryptMedia(encryptMedia2, uaOverride);
            const linkpic2 = await uploadImages(medta2, `${sender.id}_img`);
            const linknyes = linkpic2;
            cecann.push(linknyes);
            fs.writeFileSync("./lib/helper/cecan.json", JSON.stringify(cecann));
            kato.reply(from, "Foto berhasil disimpan didalam database!", id);
          } else {
            kato.reply(
              from,
              "Terjadi kesalahan saat menambahkan foto ke database",
              id
            );
          }
          break;

        case prefix + "addcogan":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Maaf, fitur ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          if ((isMedia && isImage) || isQuotedImage) {
            await kato.reply(from, mess.wait, id);
            const encrypt = isQuotedImage ? quotedMsg : message;
            const medta = await decryptMedia(encrypt, uaOverride);
            const linkpic = await uploadImages(medta, `${sender.id}_img`);
            const linkah = linkpic;
            cogann.push(linkah);
            fs.writeFileSync("./lib/helper/cogan.json", JSON.stringify(cogann));
            kato.reply(from, "Foto berhasil disimpan ke dalam database", id);
          } else {
            kato.reply(
              from,
              "Terjadi kesalahan saat menambahkan foto ke database!",
              id
            );
          }
          break;

        case prefix + "pban":
          if (!isOwnerB)
            return kato.reply(from, "Perintah ini hanya untuk Owner bot!", id);
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk banned seseorang agar tidak bisa menggunakan commands\n\nCaranya ketik: \n${prefix}ban add 628xx --untuk mengaktifkan\n${prefix}ban del 628xx --untuk nonaktifkan\n\ncara cepat ban banyak digrup ketik:\n${prefix}ban @tag @tag @tag`,
              id
            );
          try {
            banned.push(args + "@c.us");
            fs.writeFileSync("./settings/banned.json", JSON.stringify(banned));
            kato.reply(from, "Mampus ke BAN! awkowkowko", id);
          } catch {
            kato.reply(from, "Terjadi kesalahan", id);
          }
          break;

        case prefix + "punban":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh Owner bot & Member Premium",
              id
            );
          try {
            let xnxx = banned.indexOf(args + "@c.us");
            banned.splice(xnxx, 1);
            fs.writeFileSync("./settings/banned.json", JSON.stringify(banned));
            kato.reply(from, "Kasian, makanya ku unban", id);
          } catch {
            kato.reply(from, "Terjadi kesalahan", id);
          }
          break;

        case prefix + "afk":
          if (!isGroupMsg)
            return await kato.reply(
              from,
              "Maaf, fitur ini hanya bisa digunakan didalam Grup!",
              id
            );
          if (isAfkOn)
            return await kato.reply(
              from,
              `${pushname} sekarang sedang *AFK (AWAY FROM KEYBOARD)*\n\nReason: ${reason}`,
              id
            );
          addAfk(sender.id, time, reason);
          kato.sendTextWithMentions(
            from,
            `*@${sender.id.replace(
              /@c.us/g,
              ""
            )} SEKARANG SEDANG AFK! (AWAY FROM KEYBOARD)*\n\n*Alasan: ${reason}*`
          );
          break;

        case prefix + "left":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan didalam Grup!",
              id
            );
          if (!isGroupAdmins)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh Admin Grup!",
              id
            );
          if (args.length === 0)
            return kato.reply(from, "Pilih enable atau disable tod", id);
          if (args[0].toLowerCase() === "enable") {
            left.push(chat.id);
            fs.writeFileSync("./lib/database/left.json", JSON.stringify(left));
            kato.reply(
              from,
              "Fitur left berhasil di aktifkan di group ini!",
              id
            );
          } else if (args[0].toLowerCase() === "disable") {
            var thisgc = left.indexOf(groupId);
            left.splice(thisgc, 1);
            fs.writeFileSync("./lib/database/left.json", JSON.stringify(left));
            kato.reply(
              from,
              "Fitur left berhasil di nonaktifkan di group ini!",
              id
            );
          } else {
            kato.reply(from, "Pilih enable atau disable!", id);
          }
          break;

        case prefix + "deleteleft":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          let index = left.includes(chats);
          left.splice(index);
          fs.writeFileSync("./lib/database/left.json", JSON.stringify(left));
          kato.reply(
            from,
            "berhasil mendelete semua id grup didalam database left.json",
            id
          );
          break;

        case prefix + "deleteban":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          let delban = banned.includes(chats);
          banned.splice(delban);
          fs.writeFileSync("./settings/banned.json", JSON.stringify(banned));
          kato.reply(from, "Berhasil menghapus semua user banned", id);
          break;
        case prefix + "deletewelcome":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          let walcm = welkom.includes(chats);
          welkom.splice(walcm);
          fs.writeFileSync(
            "./lib/database/welcome.json",
            JSON.stringify(welkom)
          );
          kato.reply(
            from,
            "berhasil mendelete semua id didalam database welcome.json",
            id
          );
          break;

        case prefix + "nsfw":
          if (args[0] === "on") {
            if (_nsfw.includes(chatId))
              return kato.reply(from, mess.nsfwalready, id);
            _nsfw.push(chatId);
            fs.writeFileSync(
              "./lib/database/group/nsfw.json",
              JSON.stringify(_nsfw)
            );
            kato.reply(from, mess.nsfwon, id);
          } else if (args[0] === "off") {
            var nsfwsplice = _nsfw.indexOf(chatId);
            _nsfw.splice(nsfwsplice, 1);
            fs.writeFileSync(
              "./lib/database/group/nsfw.json",
              JSON.stringify(_nsfw)
            );
            kato.reply(from, mess.nsfwoff, id);
          } else {
            kato.reply(from, "Pilih on atau off admin", id);
          }
          break;

        case prefix + "welcome":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan didalam Grup!",
              id
            );
          if (!isGroupAdmins)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh Admin Grup!",
              id
            );
          if (args.length === 0)
            return kato.reply(from, "Pilih enable atau disable", id);
          if (args[0].toLowerCase() === "enable") {
            welkom.push(chat.id);
            fs.writeFileSync(
              "./lib/database/welcome.json",
              JSON.stringify(welkom)
            );
            kato.reply(
              from,
              "Fitur welcome berhasil di aktifkan di group ini!",
              id
            );
          } else if (args[0].toLowerCase() === "disable") {
            var thisgc = welkom.indexOf(groupId);
            welkom.splice(thisgc, 1);
            fs.writeFileSync(
              "./lib/database/welcome.json",
              JSON.stringify(welkom)
            );
            kato.reply(
              from,
              "Fitur welcome berhasil di nonaktifkan di group ini!",
              id
            );
          } else {
            kato.reply(from, "Pilih enable atau disable!", id);
          }
          break;

        case prefix + "ban":
          if (!isOwnerB)
            return kato.reply(from, "Perintah ini hanya untuk Owner bot!", id);
          var qmban = quotedMsgObj.sender.id;
          try {
            banned.push(qmban);
            fs.writeFileSync("./settings/banned.json", JSON.stringify(banned));
            kato.reply(from, "Mampus ke BAN! awkowkowko", id);
          } catch {
            kato.reply(
              from,
              "Maaf, terjadi kesalahan saat membanned member",
              id
            );
          }
          break;

        case prefix + "unban":
        case "prefix+odelprem":
          var qmban2 = quotedMsgObj.sender.id;
          if (!isOwnerB)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          try {
            let xnxx = banned.indexOf(qmban2);
            banned.splice(xnxx, 1);
            fs.writeFileSync("./settings/banned.json", JSON.stringify(banned));
            kato.reply(from, "Kasian, makanya ku unban", id);
          } catch {
            kato.reply(
              from,
              "Maaf, terjadi kesalahan saat membanned member!",
              id
            );
          }
          break;

        case prefix + "delprem":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan oleh Owner Bot!",
              id
            );
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk mendelete seseorang menjadi member biasa`,
              id
            );
          let prsl = prem.indexOf(args[0] + "@c.us");
          prem.splice(prsl, 1);
          fs.writeFileSync("./lib/database/prem.json", JSON.stringify(prem));
          kato.reply(from, "Success delete prem member", id);
          break;

        case prefix + "google":
          const googleQuery = body.slice(8);
          if (googleQuery == undefined || googleQuery == " ")
            return kato.reply(
              from,
              `*Hasil Pencarian : ${googleQuery}* tidak ditemukan`,
              id
            );
          google({ query: googleQuery })
            .then((results) => {
              let vars = `_*Hasil Pencarian : ${googleQuery}*_\n`;
              for (let i = 0; i < results.length; i++) {
                vars += `\n═════════════════\n\n*Judul* : ${results[i].title}\n\n*Deskripsi* : ${results[i].snippet}\n\n*Link* : ${results[i].link}\n\n`;
              }
              kato.reply(from, vars, id);
            })
            .catch((e) => {
              console.log(e);
              kato.sendText(ownerNumber, "Google Error : " + e);
            });
          break;

        case prefix + "tickle":
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/tickle").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url);
          });
          break;

        case prefix + "cuddle":
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/cuddle").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url);
          });
          break;

        case prefix + "trapnime":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/trap").then((res) => {
            kato.sendFileFromUrl(from, res.data.url, "img.jpg", "", id);
          });
          break;

        case prefix + "kuni":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/kuni").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "classic":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/classic").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "spank":
          if (!isNsfwOn) return kato.reply(from, mess.nsfwnoton, id);
          if (!isPrem && !isOwnerB) return kato.reply(from, mess.prem, id);
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/spank").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "randompat":
          kato.reply(from, mess.wait, id);
          axios
            .get("https://nekos.life/api/v2/img/pat")
            .then((res) => {
              kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
            })
            .catch((err) => {
              kato.reply(from, `Error`, id);
            });
          break;

        case prefix + "pokegif":
          kato.reply(from, mess.wait, id);
          axios.get("https://nekos.life/api/v2/img/poke").then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "randomhug":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          kato.sendText(from, mess.wait);
          axios.get(`https://nekos.life/api/v2/img/hug`).then((res) => {
            kato.sendStickerfromUrl(from, res.data.url, StickerMetadata);
          });
          break;

        case prefix + "groupicon":
        case prefix + "gcicon":
          if (!isGroupMsg)
            return kato.reply(
              from,
              `Perintah ini hanya bisa digunakan didalam grup!`,
              id
            );
          var groupic = await kato.getProfilePicFromServer(chat.id);
          if (groupic == undefined) {
            var pfp = "https://i.ibb.co/gwWr4z9/kato-chan.jpg";
          } else {
            var pfp = groupic;
          }
          await kato.sendFileFromUrl(from, pfp, "group.jpg", "", id);
          break;

        case prefix + "groupinfo":
        case prefix + "gcinfo":
        case prefix + "grupinfo":
        case prefix + "infogroup":
        case prefix + "infogrup":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          var totalMem = chat.groupMetadata.participants.length;
          var desc = chat.groupMetadata.desc;
          var groupname = name;
          var timestp = chat.groupMetadata.creation;
          var date = moment(timestp * 1000).format("dddd, DD MMMM YYYY");
          var timeh = moment(timestp * 1000).format("HH:mm:ss");
          var ownerwoi = chat.groupMetadata.owner;
          var grplink = antilink.includes(chat.id);
          var botadmin = isBotGroupAdmins ? "Admin" : "Member";
          var grouppic = await kato.getProfilePicFromServer(chat.id);
          if (grouppic == undefined) {
            var pfp = errorurl;
          } else {
            var pfp = grouppic;
          }
          await kato.sendFileFromUrl(
            from,
            pfp,
            "group.png",
            `*「 GROUP INFO 」*
*➸ Name : ${groupname}*

Group ini didirikan sejak *${date}* Pada Pukul *${timeh}* oleh @${ownerwoi.replace(
              "@c.us",
              ""
            )}
*➸ Members : ${totalMem}*
*➸ Antilink Status : ${grplink ? "On" : "Off"}*
*➸ Bot Group Status : ${botadmin}*
*➸ Group Description* 
${desc}
₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋
_Desc di update oleh : @${chat.groupMetadata.descOwner.replace(
              "@c.us",
              ""
            )} pada *${moment(chat.groupMetadata.descTime * 1000).format(
              "dddd, DD MMMM YYYY"
            )}* pukul ${moment(chat.groupMetadata.descTime * 1000).format(
              "HH:mm:ss"
            )}_`
          );
          break;

        case prefix + "dcserver":
          const serverdiscord =
            "https://discord.gg/MFzmzh8k\n\nYuk join Server Discord pake link diatas";
          await kato.sendLinkWithAutoPreview(from, serverdiscord);
          break;

        case prefix + "wagrup":
          const serverwa =
            "https://chat.whatsapp.com/Bnkjk3EMNNx5l4NO3mWsNs\n\nYuk Join Grup WhatsApp pake link diatas";
          await kato.sendLinkWithAutoPreview(from, serverwa);
          break;

        case prefix + "screen":
          {
            if (!isOwnerB)
              return await kato.reply(
                from,
                "Fitur ini hanya dapat digunakan oleh admin bot"
              );
            const snap = await kato.getSnapshot();
            kato.sendImage(from, snap, "snapshot.png", "Session Snapshot");
          }
          break;

        case prefix + "listbacot":
          const bacul = dbcot;
          let bacotanmu = `╔══✪〘 *List Bacot!* 〙✪══\n`;
          for (let i = 0; i < bacul.length; i++) {
            bacotanmu += "╠➥";
            bacotanmu += ` ${bacul[i]}\n`;
          }
          bacotanmu += "╚═〘 *K A T O  B O T* 〙";
          await kato.reply(from, bacotanmu, id);
          break;

        case prefix + "premlist":
          const premlist = prem;
          let kuntul = `╔══✪〘 *Prem Member!* 〙✪══\n╠➥Total Premium user : ${prem.length}\n`;
          for (let i = 0; i < premlist.length; i++) {
            kuntul += `╠➥`;
            kuntul += `${premlist[i].replace(/@c.us/g, "")}\n`;
          }
          kuntul += "╚═〘 *K A T O  B O T* 〙";
          await kato.reply(from, kuntul, id);
          break;

        case prefix + "listcecan":
          const ccn = cecann;
          let xoxi = `List Foto Cecan\n\n`;
          for (let i = 0; i < ccn.length; i++) {
            xoxi += "-";
            xoxi += `${ccn[i]}\n`;
          }
          await kato.reply(from, xoxi, id);
          break;

        case prefix + "listcogan":
          const cgn = cogann;
          let xoxo = `List Foto Cogan\n\n`;
          for (let i = 0; i < cgn.length; i++) {
            xoxo += "-";
            xoxo += `${cgn[i]}\n`;
          }
          await kato.reply(from, xoxo, id);
          break;

        case prefix + "listleft":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh owner (4ndrexyz) bot!",
              id
            );
          const lefting = left;
          let lefs = `List ID Grup\n\n`;
          for (let i = 0; i < lefting.length; i++) {
            lefs += "-";
            lefs += `${lefting[i]}\n`;
          }
          await kato.reply(from, lefs, id);
          break;

        case prefix + "listwelcome":
          if (!isOwnerB)
            return kato.reply(
              from,
              "Fitur ini hanya bisa digunakan oleh owner bot!",
              id
            );
          const wulcum = welkom;
          let wels = `List ID Grup\n\n`;
          for (let i = 0; i < wulcum.length; i++) {
            wels += "-";
            wels += `${wulcum[i]}\n`;
          }
          await kato.reply(from, wels, id);
          break;

        case prefix + "saylist":
          const saylest = dsay;
          let kimtil = `╔══✪〘 *Say List!* 〙✪══\n`;
          for (let i = 0; i < saylest.length; i++) {
            kimtil += "╠➥";
            kimtil += `${saylest[i]}\n`;
          }
          kimtil += "╚═〘 *K A T O  B O T* 〙";
          await kato.sendText(from, kimtil);
          break;

        case prefix + "addsay":
          {
            if (!args.length >= 1)
              return kato.reply(from, "Kalimatnya manaa?", id);
            const say = body.slice(8);
            dsay.push(say);
            fs.writeFileSync("./lib/database/say.json", JSON.stringify(dsay));
            kato.reply(
              from,
              `Done add say ke database\nTotal add say : *${
                dsay.length - 1
              }* ,`,
              id
            );
          }
          break;

        case prefix + "addbacot":
          {
            if (!args.length >= 1)
              return kato.reply(
                from,
                "BACOTAN NYA MANA ANJING?? DASAR BODOH!",
                id
              );
            const bacot = body.slice(10);
            dbcot.push(bacot);
            fs.writeFileSync(
              "./lib/database/bacot.json",
              JSON.stringify(dbcot)
            );
            kato.reply(
              from,
              `Sukses menambahkan Kata bacot ke database\nTotal data bacot sekarang : *${
                dbcot.length - 1
              }*`,
              id
            );
          }
          break;

        case prefix + "delbacot":
          if (!isGroupMsg)
            return kato.reply(
              from,
              `Perintah ini hanya bisa di gunakan didalam grup!`,
              id
            );
          const delbd = dbcot.indexOf(body.slice(12));
          dbcot.splice(delbd, 1);
          fs.writeFileSync("./lib/database/bacot.json", JSON.stringify(dbcot));
          kato.reply(from, `Success Menghapus Bacot!`, id);
          break;

        case prefix + "bacot":
          if (args.length == 1) {
            const no = args[0];
            const cekdb = dbcot.length;
            if (cekdb <= no)
              return await kato.reply(
                from,
                `Total data saat ini hanya sampai *${cekdb - 1}*`,
                id
              );
            const res = dbcot[Math.floor(Math.random() * dbcot.length)];
            kato.sendreply(from, res, id);
          } else {
            const kata = dbcot[Math.floor(Math.random() * dbcot.length)];
            kato.reply(from, kata, id);
          }
          break;

        case prefix + "say":
          if (args.length == 1) {
            const wuh = args[0];
            const sayur = dsay.length;
            if (sayur <= wuh)
              return await kato.reply(
                from,
                `Total database saat ini hanya sampe *${sayur - 1}`,
                id
              );
            const lahs = dsay[wuh];
            kato.sendText(from, lahs);
          } else {
            const kata = dsay[Math.floor(Math.random() * dsay.length)];
            kato.reply(from, kata, id);
          }
          break;

        case prefix + "delprem":
          if (!isOwnerB)
            return kato.reply(
              from,
              `Perintah ini hanya bisa digunakan oleh Owner Bot`,
              id
            );
          const delprem = prem.indexOf(body.slice(9) + "@c.us");
          prem.splice(delprem, 1);
          fs.writeFileSync("./lib/database/prem.json", JSON.stringify(prem));
          kato.reply(from, `Success delete premium member`, id);
          break;

        case prefix + "delsay":
          if (!isGroupMsg)
            return kato.reply(
              from,
              `Perintah ini hanya bisa di gunakan didalam grup!`,
              id
            );
          const delsay = dsay.indexOf(body.slice(8));
          dsay.splice(delsay, 1);
          fs.writeFileSync("./lib/database/say.json", JSON.stringify(dsay));
          kato.reply(from, `Success Menghapus Say!`, id);
          break;

        case prefix + "iplocation":
          if (args.length == 0)
            return kato.reply(
              from,
              `Tidak ada ip Address, silahkan masuk ip address anda\nContoh : ${prefix}iplocation 180.242.215.107`,
              id
            );
          axios
            .get(`https://ipapi.co/${body.slice(12)}/json/`)
            .then(async (res) => {
              const addr = `• *Ip :* ${res.data.ip}\n• *Ip Version :* ${res.data.version}\n• *Negara :* ${res.data.country_name}\n• *Kode Negara :* ${res.data.country_code}\n• *Ibu Kota :* ${res.data.country_capital}\n• *Wilayah :* ${res.data.region}\n• *Kode Wilayah :* ${res.data.region_code}\n• *Postal :* ${res.data.postal}\n• *Latitude :* ${res.data.latitude}\n• *Longitude :* ${res.data.longitude}\n• *Timezone :* ${res.data.timezone}\n• *Utc Offset :* ${res.data.utc_offset}\n• *Kode Panggilan Negara :* ${res.data.country_calling_code}\n• *Mata Uang :* ${res.data.currency_name}\n• *Kode Mata Uang :* ${res.data.currency}\n• *Bahasa :* ${res.data.languages}\n• *Jumlah Wilayah :* ${res.data.country_area}\n• *Populasi Negara :* ${res.data.country_population}\n• *ASN :* ${res.data.asn}\n• *Provider :* ${res.data.org}`;
              kato.reply(from, addr, id);
            });
          break;

        case prefix + "matauang":
          const matung = `List Currency : btc, usd, eur, gbp, aud, cad, chf, cny, jpy, sgd, nzd, pkr, hkd, krw, mxn, nok, egp, clp, ngn, brl, rub, uah, thb, pln, inr, eth, xmr, dash, doge, ltc, str, xrp`;
          kato.reply(from, matung, id);
          break;

        case prefix + "translate":
          if (args.length == 0)
            return kato.reply(
              from,
              `Untuk translate kata gunakan ${prefix}translate [kode bahasa]|Kata kata\n\nContoh : ${prefix}translate en|Bagaimana kabarmu?`,
              id
            );
          const suway1 = arg.split("|")[0];
          const suway2 = arg.split("|")[1];
          await axios
            .get(
              `https://amm-api-translate.herokuapp.com/translate?engine=google&text=${suway2}&to=${suway1}`
            )
            .then((res) => {
              const texttr = res.data.data.result;
              kato.reply(from, texttr, id);
            });
          break;

        case prefix + "santet": //work
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          if (mentionedJidList.length === 0)
            return kato.reply(
              from,
              "Tag member yang mau disantet, contoh : */santet @budi | karena gay*",
              id
            );
          if (args.length === 1)
            return kato.reply(
              from,
              "Masukkan alasan kenapa menyantet dia!!",
              id
            );
          const target = arg.split("|")[0];
          const alasan = arg.split("|")[1];
          await kato.sendTextWithMentions(
            from,
            `Santet terkirim ke ${target}, Dengan alasan : ${alasan}`
          );
          break;

        case prefix + "doggo":
          const list = [
            "https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg",
            "https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg",
            "https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg",
            "https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg",
            "https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg",
            "https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg",
            "https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg",
            "https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg",
            "https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg",
            "https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg",
            "https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg",
            "https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg",
            "https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg",
            "https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg",
            "https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg",
            "https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg",
            "https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg",
            "https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg",
            "https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg",
            "https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg",
            "https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg",
            "https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg",
            "https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg",
            "https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg",
            "https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg",
            "https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg",
            "https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg",
            "https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg",
            "https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg",
            "https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg",
            "https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg",
            "https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg",
            "https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg",
            "https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg",
            "https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg",
            "https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg",
            "https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg",
            "https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg",
            "https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg",
            "https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg",
            "https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg",
            "https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg",
            "https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg",
            "https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg",
            "https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg",
            "https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg",
            "https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg",
            "https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg",
            "https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg",
            "https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg",
            "https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg",
            "https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg",
            "https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg",
            "https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg",
            "https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg",
            "https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg",
            "https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg",
            "https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg",
            "https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg",
            "https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg",
            "https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg",
            "https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg",
            "https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg",
            "https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg",
            "https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg",
            "https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg",
            "https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg",
            "https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg",
            "https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg",
            "https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg",
            "https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg",
            "https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg",
            "https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg",
            "https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg",
            "https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg",
            "https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg",
            "https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg",
            "https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg",
            "https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg",
            "https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg",
            "https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg",
            "https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg",
            "https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg",
            "https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg",
            "https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg",
            "https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg",
            "https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg",
            "https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg",
            "https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg",
            "https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg",
            "https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg",
            "https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg",
            "https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg",
            "https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg",
            "https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg",
            "https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg",
            "https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg",
            "https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg",
            "https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg",
            "https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg",
          ];
          let kya = list[Math.floor(Math.random() * list.length)];
          kato.sendFileFromUrl(from, kya, "Dog.jpeg", "Doggo sparkles", id);
          break;

        case prefix + "aiquote":
          const aiquote = await axios.get(
            "http://inspirobot.me/api?generate=true"
          );
          await kato.sendFileFromUrl(
            from,
            aiquote.data,
            "quote.jpg",
            "FOLLOW NGAB  :V https://www.instagram.com/_l_.lawliet_/",
            id
          );
          break;

        case prefix + "ttp":
          if (args.length == 0) return kato.reply(from, "textnya mana?", id);
          const beword = body.slice(5);
          axios
            .get(`https://api.xteam.xyz/ttp?text=${beword}`)
            .then(async (res) => {
              if (res.data.status == false || res.data.status == 500)
                return kato.reply(from, "Rest api sedang error", id);
              kato
                .sendImageAsSticker(from, res.data.result, StickerMetadata)
                .then(async () => {
                  console.log(
                    color(
                      `Text To Picture processed for ${processTime(
                        t,
                        moment()
                      )} seconds`,
                      "aqua"
                    )
                  );
                });
            })
            .catch((err) => {
              console.log(err);
              kato.reply(from, err.message, id);
            });
          break;

        case prefix + "mabar":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          if (mentionedJidList.length === 0)
            return kato.reply(
              from,
              "Tag orang yang mau di ajak Mabar \n\n Contoh: */mabar @martien|[game]*",
              id
            );
          if (args.length == 0)
            return kato.reply(
              from,
              `Mau Mabar apa ? \n Contoh: Mobile Legend`,
              id
            );
          const membermabar = arg.split("|")[0];
          const mabarapa = arg.split("|")[1];
          await kato.sendTextWithMentions(
            from,
            `Pesan terkirim ke ${membermabar}, kamu ngajak mabar ${mabarapa}\n\n ${membermabar} jika kamu ingin membalasnya ketik */jwbmabar*`
          );
          break;

        case prefix + "jwbmabar":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          const tnymbr = args.join(" ");
          const jwbmbr = jwbmabar[Math.floor(Math.random() * jwbmabar.length)];
          if (!tnymbr)
            kato.reply(
              from,
              "⚠️ Format salah! Ketik */menu* untuk penggunaan."
            );
          await kato.sendText(from, `Jawaban: *${jwbmbr}*`);
          break;

        case prefix + "kapan":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          if (args.length == 0)
            return kato.reply(
              from,
              `Tidak ada Kata!\n Contoh : ${prefix}kapan kamu mati?`,
              id
            );
          const when = args.join(" ");
          const ans = kapan[Math.floor(Math.random() * kapan.length)];
          if (!when)
            kato.reply(
              from,
              `⚠️ Format salah! Ketik *${prefix}menu* untuk penggunaan.`
            );
          await kato.sendText(
            from,
            `Pertanyaan: *${when}* \n\nJawaban: ${ans}`
          );
          break;

        case prefix + "nilai":
        case prefix + "rate":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          if (args.length == 0)
            return kato.reply(
              from,
              `Fitur untuk menilai yang kalian katakan\n Contoh : ${prefix}rate kegantenganku`,
              id
            );
          const rating = args.join(" ");
          const awr = rate[Math.floor(Math.random() * rate.length)];
          if (!rating)
            kato.reply(
              from,
              `⚠️ Format salah! Ketik *${prefix}menu* untuk penggunaan.`
            );
          await kato.sendText(
            from,
            `Pertanyaan: *${rating}* \n\nJawaban: ${awr}`
          );
          break;

        case prefix + "apakah":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          if (args.length == 0)
            return kato.reply(
              from,
              `Tidak ada Kata!\nContoh : ${prefix}apakah dia cantik?`,
              id
            );
          const nanya = args.join(" ");
          const jawab = apakah[Math.floor(Math.random() * apakah.length)];
          if (!nanya)
            kato.reply(
              from,
              "⚠️ Format salah! Ketik */menu* untuk penggunaan."
            );
          await kato.sendText(
            from,
            `Pertanyaan: *${nanya}* \n\nJawaban: ${jawab}`
          );
          break;

        case prefix + "bisakah":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          if (args.length == 0)
            return kato.reply(
              from,
              `Tidak ada Kata!\nContoh : ${prefix}bisakah dia mencintaiku?`,
              id
            );
          const bsk = args.join(" ");
          const jbsk = bisakah[Math.floor(Math.random() * bisakah.length)];
          if (!bsk)
            kato.reply(
              from,
              "⚠️ Format salah! Ketik */menu* untuk penggunaan."
            );
          await kato.sendText(
            from,
            `Pertanyaan: *${bsk}* \n\nJawaban: ${jbsk}`
          );
          break;

        case prefix + "listmuted":
        case prefix + "listmute":
          let inmuted = `This is list of Muted grup\nTotal : ${muted.length}\n`;
          for (let i of muted) {
            inmuted += `-\n`;
          }
          await kato.reply(from, inmuted, id);
          break;

        case prefix + "listban":
          let bened = `This is list of banned number\nTotal : ${banned.length}\n`;
          for (let i of banned) {
            bened += `➸ ${i.replace(/@c.us/g, "")}\n`;
          }
          await kato.reply(from, bened, id);
          break;

        case prefix + "me":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Fitur ini hanya bisad digunakan didalam Grup!",
              id
            );
          if (isBanned) return false;
          if (isGroupMsg) {
            if (!quotedMsg) {
              var pic = await kato.getProfilePicFromServer(author);
              var namae = pushname;
              var sts = await kato.getStatus(author);
              var adm = isGroupAdmins;
              const userLevel = level.getLevelingLevel(sender.id, _level);
              const myXp = level.getLevelingXp(sender.id, _level);
              const reqXp = 5 * Math.pow(userLevel, 2) + 50 * 1 + 100;
              const { status } = sts;
              if (pic == undefined) {
                var pfp = errorImg;
              } else {
                var pfp = pic;
              }
              await kato.sendFileFromUrl(
                from,
                pfp,
                "pfp.jpg",
                `*User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *Level: ${userLevel}*\n\n➸ *Xp : ${myXp} / ${reqXp}*\n\n➸ *User Info: ${status}*\n\n➸ *Admin Group: ${adm}*\n\n`
              );
            } else if (quotedMsg) {
              var qmid = quotedMsgObj.sender.id;
              var pic = await kato.getProfilePicFromServer(qmid);
              var namae = quotedMsgObj.sender.name;
              var sts = await kato.getStatus(qmid);
              var adm = isGroupAdmins;
              const userLevel = level.getLevelingLevel(qmid, _level);
              const myXp = level.getLevelingXp(qmid, _level);
              const reqXp = 5 * Math.pow(userLevel, 2) + 50 * 1 + 100;
              const { status } = sts;
              if (pic == undefined) {
                var pfp = errorImg;
              } else {
                var pfp = pic;
              }
              await kato.sendFileFromUrl(
                from,
                pfp,
                "pfp.jpg",
                `*User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *Level: ${userLevel}*\n\n➸ *Xp : ${myXp} / ${reqXp}*\n\n➸ *User Info: ${status}*\n\n➸ *Admin Group: ${adm}*\n\n`
              );
            }
          }
          break;

        case prefix + "listblock":
          let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`;
          for (let i of blockNumber) {
            hih += `➸ ${i.replace(/@c.us/g, "")}\n`;
          }
          await kato.reply(from, hih, id);
          break;

        case prefix + "bcgrup":
          if (!isOwnerB)
            return kato.reply(
              from,
              `Command ini hanya bisa digunakan oleh Owner Bot`,
              id
            );
          bcgruptxt = body.slice(8);
          txtbcgrp = `${bcgruptxt}\n\n〘 *K A T O  B O T* 〙`;
          const semuagrup2 = await kato.getAllGroups();
          if (quotedMsg && quotedMsg.type == "image") {
            const mediaData = await decryptMedia(quotedMsg);
            const imageBase6444 = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            for (let allgroupbc of semuagrup2) {
              var cekgrup = await kato.getChatById(allgroupbc);
              if (!cekgrup.isReadOnly)
                kato.sendImage(allgroupbc, imageBase6444, "img.jpg", txtbcgrp);
            }
            kato.reply(
              from,
              "Broadcast type image for All Groups was Successfully",
              id
            );
          } else if (
            (quotedMsg && quotedMsg.type == "audio") ||
            (quotedMsg && quotedMsg.type == "ptt")
          ) {
            const mediaData = await decryptMedia(quotedMsg);
            const audiobase6444 = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            for (let allgroupbc of semuagrup2) {
              var cekgrup = await kato.getChatById(allgroupbc);
              if (!cekgrup.isReadOnly)
                kato.sendPtt(allgroupbc, audiobase6444, "audio.mp3");
            }
            kato.reply(
              from,
              "Broadcast type Audio for All Groups was Successfully",
              id
            );
          } else if (quotedMsg && quotedMsg.type == "sticker") {
            const mediaData = await decryptMedia(quotedMsg);
            const stickbase6444 = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            for (let allgroupbc of semuagrup2) {
              var cekgrup = await kato.getChatById(allgroupbc);
              if (!cekgrup.isReadOnly)
                kato.sendImageAsSticker(
                  allgroupbc,
                  stickbase6444,
                  StickerMetadata
                );
            }
            kato.reply(
              from,
              "Broadcast type Sticker for All Groups was successfully"
            );
          } else {
            for (let allgroupbc of semuagrup2) {
              var cekgrup = await kato.getChatById(allgroupbc);
              if (!cekgrup.isReadOnly) kato.sendText(allgroupbc, txtbcgrp);
            }
            kato.reply(from, "Broadcast was successfully", id);
          }
          break;

        case prefix + "bc":
          if (!isOwnerB)
            return kato.reply(
              from,
              `Command ini hanya bisa digunakan oleh Owner (4ndrexyz)`,
              id
            );
          bctxt = body.slice(4);
          txtbc = `〘 *K A T O  B O T* 〙\n\n${bctxt}`;
          const semuagrup = await kato.getAllChatIds();
          if (quotedMsg && quotedMsg.type == "image") {
            const mediaData = await decryptMedia(quotedMsg);
            const imageBase64 = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            for (let grupnya of semuagrup) {
              var cekgrup = await kato.getChatById(grupnya);
              if (!cekgrup.isReadOnly)
                kato.sendImage(grupnya, imageBase64, "gambar.jpeg", txtbc);
            }
            kato.reply("Broadcast sukses!");
          } else if (
            (quotedMsg && quotedMsg.type == "audio") ||
            (quotedMsg && quotedMsg.type == "ptt")
          ) {
            const mediaData = await decryptMedia(quotedMsg);
            const audiobase64 = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            for (let grupnya of semuagrup) {
              var cekgrup = await kato.getChatById(grupnya);
              if (!cekgrup.isReadOnly)
                kato.sendPtt(grupnya, audiobase64, "audio.mp3");
            }
            kato.reply(from, "Broadcast audio sukses", id);
          } else if (quotedMsg && quotedMsg.type == "sticker") {
            const mediaData = await decryptMedia(quotedMsg);
            const stickbase = `data:${
              quotedMsg.mimetype
            };base64,${mediaData.toString("base64")}`;
            for (let grupnya of semuagrup) {
              var cekgrup = await kato.getChatById(grupnya);
              if (!cekgrup.isReadOnly)
                kato.sendImageAsSticker(grupnya, stickbase, StickerMetadata);
            }
            kato.reply(from, "Broadcast stiker berhasil", id);
          } else {
            for (let grupnya of semuagrup) {
              var cekgrup = await kato.getChatById(grupnya);
              if (!cekgrup.isReadOnly && isMuted(grupnya))
                kato.sendText(grupnya, txtbc);
            }
            kato.reply("Broadcast Success!");
          }
          break;

        case prefix + "leaveall": //mengeluarkan bot dari semua group serta menghapus chatnya
          if (!isOwnerB)
            return kato.reply(from, "Perintah ini hanya untuk Owner bot", id);
          const allChatso = await kato.getAllChatIds();
          const loadedx = await kato.getAmountOfLoadedMessages();
          const allGroupq = await kato.getAllGroups();
          for (let gclist of allGroupq) {
            await kato.sendText(
              gclist.contact.id,
              `Maaf bot sedang pembersihan, Total Grup yang Bot join saat ini sebanyak: *${allGroupq.length}*\n\nSilahkan invite bot lagi jika dibutuhkan`
            );
            sleep(1000);
            awaitkato.leaveGroup(gclist.contact.id);
          }
          kato.reply(from, "Success leave all group!", id);
          break;

        case prefix + "clearall": //menghapus seluruh pesan diakun bot
          if (!isOwnerBot)
            return kato.reply(from, "Perintah ini hanya untuk Owner bot", id);
          const allChatx = await kato.getAllChats();
          for (let dchat of allChatx) {
            awaitkato.deleteChat(dchat.id);
          }
          kato.reply(from, "Success clear all chat!", id);
          break;

        default:
          if (isCmd) {
            const slh = body.trim().split(" ");
            kato.reply(
              from,
              `Maaf *_${pushname}_*, Command *${slh[0]}* tidak ada didalam menu!\n\nSilahkan ketik *${prefix}menu* Untuk menampilkan command`,
              id
            );
          }
          break;

        case prefix + "adminlist":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          let mimin = `*LIST ADMIN FROM ${name}*\n`;
          for (let admon of groupAdmins) {
            mimin += `➸ @${admon.replace(/@c.us/g, "")}\n`;
          }
          await kato.sendTextWithMentions(from, mimin, id);
          break;

        case prefix + "howmuch":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa digunakan dalam Grup"
            );
          const tulul = name;
          const yaelah = chat.groupMetadata.participants.length;
          await kato.sendText(
            from,
            `Total Member in *${tulul}* is : *${yaelah}*`
          );
          break;

        case prefix + "ownergc":
          if (!isGroupMsg)
            return kato.reply(
              from,
              "Perintah ini hanya bisa di gunakan dalam group!",
              id
            );
          const Owner_ = chat.groupMetadata.owner;
          await kato.sendTextWithMentions(from, `Owner Group : @${Owner_}`);
          break;
      }
      
    }
  } catch (err) {
    console.log(color("[EROR]", "red"), err);
  }
};

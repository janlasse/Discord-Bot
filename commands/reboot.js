//Required die discord.js Library, permission-level und file-system
const enums = require("../modules/enums.js");
const Discord = require("discord.js");
const fs = require("fs");

//Diese function startet den bot neu.
exports.run = async (client, msg, args, flags) => {
	
	//Erstellt eine Embedded message.
	const embed = new Discord.RichEmbed();
	embed.setTimestamp();
	
	//Setzt den Ersteller dieses Embeds zu dem der die function gecallt hat.
	embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL);
	
	embed.setTitle("Rebooting...");
	
	embed.setColor(1);

	//Schreibt eine Nachricht in den Discord-Chat, dass der bot neustartet
	const m = await msg.channel.send({ embed: embed });


	var obj = { id: m.id, channel: m.channel.id }

	//Erstellt eine Datei mit den Informationen, der obrigen gesendeten Reboot-Message.
	fs.writeFileSync("./reboot.json", JSON.stringify(obj, null, 4));

	//Schließt den Prozess(PM2 startet den Bot automatisch neu, läuft auf dem Server ausserhalb von dem Bot.)
	process.exit(1);
};

//Gibt die Info für den Help-Command frei.
exports.help = {
	name: "reboot",
	description: "Reboot bot",
	usage: "reboot"
};


//Erklärt, dass dieser command nur von dem Besitzer des Bot's benutzt werden darf.
exports.config = {
	flags: [],
	permissionLevel: enums.Permissions.OWNER
};

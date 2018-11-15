
const enums = require("../modules/enums.js");
const Discord = require("discord.js");


//Um javascript code über eine Discord message auszuführen.
exports.run = async (client, msg, args, flags) => {
	const startTime = new Date().getTime();

	//Erstellt eine embedded Nachricht
	const embed = new Discord.RichEmbed();
	embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL);
	embed.setTimestamp();
	embed.setColor(1);

	//Formatted den array, in welcher die Nachricht ist und setzt sie in eine Variable
	const code = args.join(" ");
	var showCode = code.length > 1014 ? code.substring(0, 1014 - 3) + "..." : code;

	embed.addField("📥 Code to execute", "```js\n" + showCode + "```");

	var m = await msg.channel.send({embed: embed});
	
	try {
		//Führt den JS-Code aus
		const evaled = client.clean(await eval(code));
		
		//Statistiken
		const endTime = new Date().getTime() - startTime;
		embed.setFooter("Took " + endTime + "ms to execute");

		var showEvaled = evaled.length > 1014 ? evaled.substring(0, 1014 - 3) + "..." : evaled;

		//Zeigt den ausgeführten code
		embed.addField("📤 Successfully evaluated", "```js\n" + showEvaled + "```");

		m.edit({ embed: embed });

		//Debugging, gibt den Fehler aus
	} catch(err) {
		const endTime = new Date().getTime() - startTime;
		embed.setFooter("Took " + endTime + "ms to execute");

		err = client.clean(err);

		var showErr = err.length > 1014 ? err.substring(0, 1014 - 3) + "..." : err;

		embed.addField("📤 Failed to evaluate", "```js\n" + showErr + "```");

		m.edit({ embed: embed });
	}
};

exports.help = {
	name: "eval",
	description: "Evaluate JavaScript code",
	usage: "eval <JavaScript>"
};

exports.config = {
	flags: [],
	permissionLevel: enums.Permissions.OWNER
};

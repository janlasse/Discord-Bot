//Required die Permission-level, discord.js library und serializeError(NPM-Library)
const enums = require("../modules/enums.js");
const Discord = require("discord.js");
const serializeError = require("serialize-error");


//Diese Funktion listened nach neuen Messages.
module.exports = async (client, message) => {
	if (!message.guild || message.author.bot || message.content.indexOf(client.config.prefix) !== 0) return;

	//Teilt die message in einen Array, f+r die Arguments/Parameter eines Commands
	const args = message.content.split(/ +/g);

	//Entfernt den Prefix und setzt den command in eine eigene Variable
	const cmd = args.shift().slice(client.config.prefix.length).toLowerCase();

	//Holt den command aus der Command-Liste
	const command = client.commands.get(cmd);

	if (command) {

		//Parsed den Input
		const parsed = client.parseInput(command.config.flags, args.join(" "));
		var actualArgs = parsed.args;
		var flags = parsed.output;

		//Normalized die input-variablen
		if (actualArgs === undefined) actualArgs = [];
		if (flags === undefined) flags = {};

		//Checkt die permission-level
		var permissionLevel = command.config.permissionLevel || enums.Permissions.NORMAL;
		if (permissionLevel === enums.Permissions.STAFF && !(await client.isStaff(message.author))) return;
		if (permissionLevel === enums.Permissions.OWNER && !(await client.isOwner(message.author))) return;

		//Führt den Command aus, die command-file macht bei erfolg weiter, falls er es nicht schafft erstellt und schickt er eine Error-Message.
		command.run(client, message, actualArgs, flags).catch((err) => { 
			console.error(err)
			const embed = new Discord.RichEmbed();
			embed.setTimestamp();
			embed.setColor("#A00000");
			embed.setAuthor(message.author.tag + " (" + message.author.id + ")", message.author.displayAvatarURL);
			embed.setTitle("Command \"" + command.help.name + "\" failed");
			embed.setDescription(message.content + client.zws(true));

			//Macht den error zu einer richtigen json, einfacheres Debugging
			var serializedError = serializeError(err);
			delete serializedError.stack;
			
			//Falls der error zu lang ist, teilt er ihn auf.
			var messages = Discord.Util.splitMessage(Discord.Util.escapeMarkdown(JSON.stringify(serializedError, null, 4), true), {
				maxLength: 1000,
				char: "\n",
				prepend: "",
				append: ""
			});
			//Macht die message zu einem Array.
			if (typeof messages === "string") messages = [ messages ];

			//Formatted den error für schöneres lesen.
			var firstMsg = messages.shift();
			embed.addField("Error", "```JSON\n" + firstMsg + "\n```");

			for (let msg of messages) {
				embed.addField(client.zws(), "```JSON\n" + msg + "\n```");
			}

			message.channel.send({ embed: embed }).catch((e) => {
				console.error(e);
			});
		});
	}
};

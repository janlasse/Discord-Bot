//Required die permission-level, discord.js und eine npm-library
const enums = require("../modules/enums.js");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");


exports.run = async (client, msg, args, flags) => {
	//Erstellt eine embedded-nachricht mit den momentanen statistics des bots.
	const embed = new Discord.RichEmbed();
	embed.setTimestamp();
	embed.setColor(1);
	embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL);
	embed.setTitle("Statistics");

	
	var description = "```asciidoc\n";
	description += "•  Mem Usage :: " + (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB\n";
	description += "•     Uptime :: " + moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]") + "\n";
	description += "•      Users :: " + client.users.size.toLocaleString() + "\n";
	description += "•    Servers :: " + client.guilds.size.toLocaleString() + "\n";
	description += "•   Channels :: " + client.channels.size.toLocaleString() + "\n";
	description += "• Discord.js :: v" + Discord.version + "\n";
	description += "•       Node :: " + process.version + "\n";
	description += "```";
	embed.addField("Bot Process", description);

	await msg.channel.send({ embed: embed });
};

exports.help = {
	name: "stats",
	description: "Get stats about this bot",
	usage: "stats"
};

exports.config = {
	flags: [],
	permissionLevel: enums.Permissions.NORMAL
};

//Required die discord.js Library und permission-level
const enums = require("../modules/enums.js");
const Discord = require("discord.js");

exports.run = async (client, msg, args, flags) => {
  

    //Schaut ob es genug args gibt, wenn nicht returned er eine Nachricht.
    if (args.length < 3 ){
        return msg.channel.send("Please specify your title, color and Description.")
    }

    //Setzt die args in eigene variablen
    const title = args.shift()
    const color = args.shift()
    const description = args.join(" ")

    //Erstellt eine embedded Nachricht mit der RichEmbed funktion der Discord API (Beispiel in der Dokumentation)
  const embed = new Discord.RichEmbed()

    //Titel des embed's
    .setTitle(title)

    //Farbe des embed's
    .setColor(color)

    //Beschreibung des embed's
    .setDescription(description);
    
  //Schickt das embed in den selben channel zurück
  msg.channel.send(embed);
  }

exports.help = {
	name: "embed",
	description: "Embeds a msg you define",
	usage: "embed <Title> <Colour> <Description>"
};

exports.config = {
	flags: [],
	permissionLevel: enums.Permissions.NORMAL
};

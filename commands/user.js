
//required die permission.level, discord.js und eine npm library
const enums = require("../modules/enums.js");
const Discord = require("discord.js");
const moment = require("moment");

exports.run = async (client, msg, args, flags) => {
    if (args.length < 1){
        //Falls kein user angegeben wurde, führt er den command bei dem user selber aus.
        args[0] = msg.author.id
    }
    //Holt sich die Memberinformation
    var user = await client.getUser(msg, args[0], true).catch((err) => console.error(err));

    //Wenn er kein Member in der Discord-Gilde ist holt er die direkt von discord
    if(!user){
        user = await client.getUser(msg, args[0], false).catch((err) => console.error(err));
    }
    if(!user){
        msg.channel.send("Could'nt fetch the user")
        return
    }
    const embed = new Discord.RichEmbed();

	    embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL);
	    embed.setTimestamp();
        embed.setColor(1);
        
    if(user instanceof Discord.GuildMember){
        embed.addField(`Member Information`, `**Nickname:** ${user.nickname ? user.nickname : "*None*"}\n **Joined:** ${moment.utc(user.joinedTimestamp).format("DD/MM/YYYY - HH:mm:ss")} UTC\n **Highest Role:** ${user.highestRole.toString()}`)
        user = user.user;
    }
    
    embed.addField("User Information", `**Username:** ${user.username}\n **Discriminator:** ${user.discriminator}\n **ID** ${user.id}\n **Created:** ${moment.utc(user.createdTimestamp).format("DD/MM/YYYY - HH:mm:ss")}UTC`)
    embed.setThumbnail(user.displayAvatarURL)

    await msg.channel.send({ embed: embed });
};



exports.help = {
	name: "user",
	description: "Shows you information about a specific user",
	usage: "user <mention>"
};

exports.config = {
	flags: [],
	permissionLevel: enums.Permissions.ELEVATEDSTAFF
};

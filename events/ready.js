//required file-system
const fs = require("fs");

//Diese function ist für den reboot-command.
module.exports = async (client) => {
	// Editiert die reboot-message, dass der reboot vollständig durchgeführt wurde und löscht danach reboot.json
	if (fs.existsSync("./reboot.json")) {
		const json = JSON.parse(fs.readFileSync("./reboot.json"));
		client.channels.get(json.channel).messages.fetch(json.id).then(async (m) => {
			m.embeds[0].title = "Rebooted!";

			var m2 = await m.edit({ embed: m.embeds[0] });

			m.embeds[0].title  = "Rebooted! (took: " + parseInt(m2.editedTimestamp - m2.createdTimestamp) + "ms)";
			await m2.edit({ embed: m.embeds[0] });

			fs.unlink("./reboot.json", () => {});
		}).catch(() => {
			fs.unlink("./reboot.json", () => {});
		});
	}

	//Loggt, dass der bot sich erfolgreich eingeloggt hat.
	console.log("Ready to spy on " + client.users.size + " users, in " + client.channels.size + " channels of " + client.guilds.size + " servers as " + client.user.tag + ".")
};

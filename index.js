const fs = require("fs");
const Discord = require("discord.js");

// Create the client and setup all required variables
const client = new Discord.Client();
client.config = require("./config.json");

// Require the custom functions and extends
require("./modules/functions.js")(client);

// Load commands
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);

	// Remove 1, as it is the template which doesnt count
	console.log("Loading a total of " + (files.length - 1) + " commands");

	files.forEach((file) => {
		if (file === "_template.js") return;
		if (file.split(".").slice(-1)[0] !== "js") return;

		try {
			var props = require("./commands/" + file);
			client.commands.set(props.help.name, props);

			if (props.init) props.init(client);
		} catch(err) {
			console.log("Failed to load " + file + " with exception: ", err);
		}
	});
});

// Load events
fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);

	console.log("Loading a total of " + files.length + " events (" + files.filter(file => file.startsWith("once_")).length + " onces)");

	files.forEach((file) => {
		const eventName = file.split(".")[0];
		const event = require("./events/" + file);

		if (eventName.startsWith("once_")) {
			client.once(eventName.replace("once_", ""), event.bind(null, client));
		} else {
			client.on(eventName, event.bind(null, client));
		}

		delete require.cache[require.resolve("./events/" + file)];
	});
});

// Login!
client.login(client.config.token);

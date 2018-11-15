const util = require("util");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = (client) => {
	/**
	 * Clean the text and remove things like token
	 * @param {String} text Text to clean
	 * @returns {String} Cleaned text
	 */
	client.clean = (text) => {
		if (typeof text !== "string") text = util.inspect(text, {depth: 0});
		text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)).replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");
		return text;
	};

	/**
	 * Zero-Width-Space
	 * @param {Boolean} newline If we should prepend a newline (\n)
	 * @returns {String} Zero-Width-Space with newline prepended if specified
	 */
	client.zws = (newline = false) => {
		return ((newline === true) ? ("\n" + String.fromCodePoint(0x200B)) : (String.fromCodePoint(0x200B)));
	};

	/**
	 * Get the user of a message
	 * @param {Object} msg Message context
	 * @param {String} arg Argument we check from
	 * @param {Boolean} member If we should return member object instead of user object
	 * @returns {Object} Member or User object
	 */
	client.getUser = (msg, arg, member = false) => {
		return new Promise((resolve, reject) => {
			if (/^<@!?(\d{17,19})>$/.test(arg)) { // Is a direct mention
				var user = arg.match(/(?<=^<@!?)(\d{17,19})(?=>$)/);
				if (!user) { // Should never happen
					reject("Failed to match");
					return;
				}

				if (member === false) {
					client.fetchUser(user[0]).then((user) => {
						resolve(user);
					}).catch((err) => {
						reject(err);
					});
				} else {
					msg.guild.fetchMember(user[0]).then((member) => {
						resolve(member);
					}).catch((err) => {
						reject(err);
					});
				}
				return;
			}

			if (/^\d{17,19}$/.test(arg)) {
				var user = arg.match(/^\d{17,19}$/);
				if (!user) { // Should never happen
					reject("Failed to match");
					return;
				}

				if (member === false) {
					client.fetchUser(user[0]).then((user) => {
						resolve(user);
					}).catch((err) => {
						reject(err);
					});
				} else {
					msg.guild.fetchMember(user[0]).then((member) => {
						resolve(member);
					}).catch((err) => {
						reject(err);
					});
				}
				return;
			}

			reject("Failed to match");
		});
	};

	/**
	 * Parse duration
	 * @param {String} text String to parse into text
	 * @returns {Unknown} Parsed duration
	 */
	client.parseDuration = (text) => {
		var duration = moment.duration();

		if (/([0-9]+) ?(years|year|y)/i.test(text)) {
			duration.add(parseInt(text.match(/([0-9]+) ?(years|year|y)/i)[1]) || 0, "y");
		}

		if (/([0-9]+) ?(months|month|mon)/i.test(text)) {
			duration.add(parseInt(text.match(/([0-9]+) ?(months|month|mon)/i)[1]) || 0, "M");
		}

		if (/([0-9]+) ?(week|weeks|w)/i.test(text)) {
			duration.add(parseInt(text.match(/([0-9]+) ?(week|weeks|w)/i)[1]) || 0, "w");
		}

		if (/([0-9]+) ?(day|days|d)/i.test(text)) {
			duration.add(parseInt(text.match(/([0-9]+) ?(day|days|d)/i)[1]) || 0, "d");
		}

		if (/([0-9]+) ?(hours|hour|h)/i.test(text)) {
			duration.add(parseInt(text.match(/([0-9]+) ?(hours|hour|h)/i)[1]) || 0, "h");
		}

		if (/([0-9]+) ?(minutes|minute|mins|min|m)/i.test(text)) {
			duration.add(parseInt(text.match(/([0-9]+) ?(minutes|minute|mins|min|m)/i)[1]) || 0, "m");
		}

		if (/([0-9]+) ?(seconds|second|secs|sec|s)/i.test(text)) {
			duration.add(parseInt(text.match(/([0-9]+) ?(seconds|second|secs|sec|s)/i)[1]) || 0, "s");
		}

		if (/([0-9]+) ?(milliseconds|millisecond|milli|mill|ms)/i.test(text)) {
			duration.add(parseInt(text.match(/([0-9]+) ?(milliseconds|millisecond|milli|mill|ms)/i)[1]) || 0, "ms");
		}

		return duration;
	};

	/**
	 * Parse the given input
	 * @param {Array} map Array of flags
	 * @param {String} text Text to parse
	 * @returns {Object} Object containing the arguments and the flags
	 */
	client.parseInput = (map, text) => {
		var words = text.match(/[^\s"]+|"([^"]*)"/g);

		if (words === null) {
			var empty1 = [];
			var empty2 = {};
			return { empty1, empty2 };
		}

		var output = {
			undefined: []
		};
		var currentFlag = "";

		for (let i = 0; i < words.length; i++) {
			var pushFlag = true;

			if (words[i].startsWith("--")) {
				if (words[i].length > 2) {
					var flags = map.filter(f => f.word == words[i].substring(2).toLowerCase());

					if (flags.length > 0) {
						currentFlag = flags[0].flag;
						output[currentFlag] = [];
						pushFlag = false;
					}
				} else {
					currentFlag = "";
					pushFlag = false;
				}
			} else if (words[i].startsWith("-")) {
				if (words[i].length > 1) {
					var tempFlag = words[i].substring(1);

					for (let char of tempFlag) {
						currentFlag = char;
						output[currentFlag] = [];
					}
					pushFlag = false;
				}
			} else if (words[i].startsWith("\\-")) {
				words[i] = words[i].substring(1);
			}

			if (pushFlag) {
				if (currentFlag != "") {
					output[currentFlag].push(words[i]);
				} else {
					output["undefined"].push(words[i]);
				}
			}
		}

		const args = output["undefined"];
		delete output["undefined"];
		return { args, output };
	};

	/**
	 * Check if a user is a staff member in our bot-guild
	 * @param {User} user User object of the user we want to check
	 * @returns {Promise} Resolves in whether or not the user is a staff member
	 */
	client.isStaff = (user) => {
		if (user instanceof Discord.GuildMember) {
			user = user.user.id;
		} else if (user instanceof Discord.User) {
			user = user.id;
		}

		return new Promise((resolve, reject) => {
			if (client.guilds.get(client.config.staffGuild)) {
				client.guilds.get(client.config.staffGuild).members.fetch(user).then((member) => {
					resolve(member.roles.has(client.config.staffRole));
				}).catch((err) => {
					reject(err);
				});
			} else {
				reject("Failed to get guild. Discord broke.");
			}
		});
	};
	
	/**
	 * Check if a user is the owner of the bot
	 * @param {User} user User object of the user we want to check
	 * @returns {Promise} Resolves in whether or not the user is the owner of the bot
	 */
	client.isOwner = (user) => {
		if (user instanceof Discord.GuildMember) {
			user = user.user.id;
		} else if (user instanceof Discord.User) {
			user = user.id;
		}

		return new Promise((resolve, reject) => {
			client.fetchApplication().then((app) => {
				if (!app.owner || !app.owner.id) {
					resolve(false);
				} else {
					resolve(app.owner.id === user);
				}
			}).catch((err) => {
				reject(err);
			});
		});
	};

	process.on("uncaughtException", (err) => console.error(err));
	process.on("unhandledRejection", (err, promise) => console.log(err));
};

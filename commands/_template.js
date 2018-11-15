//Template für einfache command-erstellung

const enums = require("../modules/enums.js");

exports.run = async (client, msg, args, flags) => {
};

exports.help = {
	name: "Template",
	description: "Template",
	usage: "Template"
};

exports.config = {
	flags: [
		{
			flag: "t",
			word: "temp",
			desc: "Template"
		}
	],
	permissionLevel: enums.Permissions.ELEVATEDSTAFF
};

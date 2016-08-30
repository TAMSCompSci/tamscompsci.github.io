var linkify = function(text, url) {
	return "<a target='_blank' href='" + url + "'>" + text + "</a>";
};

var specialify = function(text) {
	return "<span class='special'>" + text + "</span>";
};

var data = {
	hello: "TAMS Computer Science Organization aims to " + specialify("promote Computer Science") + "\n\tin the TAMS community by providing " + specialify("mentorship") + " to those interested in\n\tfurther pursuing Computer Science and attending " + specialify("competitions") + " ranging\n\tfrom " + specialify("major hackathons") + " to " + specialify("algorithm contests") + ".",
	help: [{
		name: specialify("help"),
		description: "Display all commands"
	}, {
		name: specialify("hello"),
		description: "Display introduction message"
	}, {
		name: specialify("team"),
		description: "See the club executives"
	}, {
		name: specialify("competitions"),
		description: "Show upcoming algorithm competitions and hackathons"
	}, {
		name: specialify("links"),
		description: "Displays links to permission slips, resources, and more"
	}, {
		name: specialify("showcase"),
		description: "TAMS students\' cool projects"
	}, {
		name: specialify("contact"),
		description: "Contact TAMS Computer Science Organization club executives"
	}, {
		name: specialify("facebook"),
		description: "Go to the CSO Facebook group"
	}],
	contact: "Feel free to send us an email (<a href='mailto:TAMSComputerScience@gmail.com'>TAMSComputerScience@gmail.com</a>) or contact a club executive (type <span class='special'>team</span>) individually via Facebook.",
	team: [{
		name: specialify("Nimit") + " Kalra",
		position: "Hackathon Coach + Webmaster"
	}, {
		name: specialify("Dylan") + " Macalinao",
		position: "Hackathon Coordinator"
	}, {
		name: specialify("Nathan") + " Contreras",
		position: "Club Coordinator"
	}, {
		name: specialify("Jagath") + " Vytheeswaran",
		position: "Competition Coach"
	}, {
		name: specialify("David") + " Yuan",
		position: "Competition Coordinator"
	}],
	competitions: "Competition schedule coming soon!",
	links: "Nothing here... yet!",
	showcase: [{
		name: linkify("Scheduler", "http://schedulerapp.net"),
		authors: "By Thomas Hobohm, Jeffrey Wang, Garrett Gu"
	}, {
		name: linkify("TAMS Translator", "https://chrome.google.com/webstore/detail/tams-translator/nbgijihbcldodkahfdpldfdacpecbkci"),
		authors: "By Nimit Kalra"
	}, {
		name: linkify("Fortify", "http://getfortify.com"),
		authors: "By Shashank Bhavimane, Thomas Hobohm"
	}, {
		name: linkify("Scheme", "http://getsche.me"),
		authors: "By Thomas Hobohm, Zain Khoja, Leanne Joseph, Michelle Ya"
	}, {
		name: linkify("PocketBox", "http://pocketbox.net"),
		authors: "By Thomas Hobohm"
	}, {
		name: specialify("Cool Project"),
		authors: "By <span class='special'>you</span>? Contact us if you've made a cool project you'd like featured!"
	}],
	invalid: "That's not a valid command! Type <span class='special'>help</span> for a list of commands."
};

var describify = function(obj) {
	var output = "";

	properties = [];
	for (var property in obj) {
		if (obj.hasOwnProperty(property)) {
			properties.push(obj[property]);
		}
	}

	output += properties.join(" | ");
	return output;
};

var listify = function(list) {
	var output = "";

	for (var i = 0; i < list.length; i++) {
		output += "\t• ";

		var described = describify(list[i]);
		output += described;

		output += "\n";
	}

	return output;
};

var format = function(field) {
	var unformatted = data[field];

	if (typeof unformatted == 'string') {
		return "\n\t" + unformatted + "\n\n";
	}

	return "\n" + listify(unformatted) + "\n";
};

var lambdify = function(format_string) {
	return function() { return format(format_string) }
}

var options = {
	include: ["score"],
	shouldSort: true,
	threshold: 0.3,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	keys: ['command']
};

var search = function(list, searchitem) {
	options.distance = (searchitem.length<=2? 0 : 100)
	return new Fuse(list, options).search(searchitem)
}

$(function() {
	var intro = "Welcome to the Computer Science Organization (CSO) at TAMS!\nType 'hello' below to learn what we're all about! Try '?' for more.\n\n";
	var jqconsole = $('#console').jqconsole(intro, 'cso> ');
	function process(input) {
		var parsed = input.split(" ");
		var commands = [
			[["help", "?", "ls"], lambdify('help')],
			[["hello", "mission", "description", "why"], lambdify('hello')],
			[["team", "execs", "executives", "officers"], lambdify('team')],
			[["competitions", "hackathons", "events"], lambdify('competitions')],
			[["links", "forms", "info"], lambdify('links')],
			[["projects", "showcase"], lambdify('showcase')],
			[["contact"], lambdify('contact')],
			[["clear", "cls"], function() { jqconsole.Clear(); return ' '; }],
			[["fb", "facebook"], function() { window.location.href = "https://www.facebook.com/groups/TAMSCompSci2016"; return ' ' }],
			[["nimit"], function() { return specialify("\n\nHi!\n\n") }]
		];
		var response = null;
		commands.forEach(function(key, index, commands) {
			key[0].forEach(function(term, tindex) {
				if (term === parsed[0]) {
					response = key[1]();
				}
			});
		});
		if (response) {
			return response;
		} else {
			var commands_list = [];
			commands.forEach(function(key, index, commands) {
				key[0].forEach(function(term, tindex) {
					commands_list.push({
						'command': term,
						'callback': key[1]
					});
				})
			});
			var results = search(commands_list, parsed[0]);
			if (results.length > 0 && parsed[0].length > 1) {
				response = '\nThat command doesn\'t exist. Did you mean ';
				results.forEach(function(result, index) {
					if (index === results.length - 1 && results.length == 2) {
						response = response.substring(0, response.length - 2);
						response += ' or ' + specialify(result['item']['command']) + ', ';
					} else if (index === results.length - 1 && results.length > 1) {
						response = response.substring(0, response.length - 2);
						response += ', or ' + specialify(result['item']['command']) + ', ';
					} else {
						response += specialify(result['item']['command']) + ', ';
					}
				});
				response = response.substring(0, response.length - 2);
				response += '?\n\n';
				return response;
			} else {
				return '\nThat command doesn\'t exist. Here is a list of commands you can use:\n' + format('help');
			}
		}
	}	;

	var startPrompt = function() {
		jqconsole.Prompt(true, function(input) {
			if (input) {
				jqconsole.Write(process(input), 'jqconsole-output', false);
			} else {
				jqconsole.Write(text.notRight, 'jqconsole-output');
			}

			startPrompt();
		});
	};

	startPrompt();
});

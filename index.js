const express = require('express');

const app = express();

app.listen(() => console.log('Atomico Ready !'));

app.use('/ping', (req, res) => {

	res.send(new Date());});

const Discord = require('discord.js');

const fs = require('fs');

const client = new Discord.Client();

const config = require('./config.js');

client.config = config;

client.queue = new Map();

fs.readdir('./events/', (err, files) => {

	if (err) return console.error(err);

	files.forEach(file => {

		const event = require(`./events/${file}`);

		let eventName = file.split('.')[0];

		client.on(eventName, event.bind(null, client));

	});

});

client.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {

	if (err) return console.error(err);

	files.forEach(file => {

		if (!file.endsWith('.js')) return;

		let props = require(`./commands/${file}`);

		let commandName = file.split('.')[0];

		console.log(`${commandName} Is Ready Now..`);

		client.commands.set(commandName, props);

	});

});

client.on('message', message => {

	if (message.content === '<@831394061285851168>') {

		message.channel.send(

			`HI!,I am Atomico, my prefix is \`>\`, you can start by \`>help\`!`

		);

	}

});

const axios = require('axios');

client.on('message', message => {

	if (message.author.id === client.user.id) return;

	if (

		message.channel.id === '831396431650619403' ||

		message.channel.id === '831954631793442887'

	) {

		axios

			.get(

				`https://api.fc5570.ml/chatbot?text=${message.content

					.trim()

					.split(/ +/g)

					.join('+')

					.toLowerCase()}`

			)

			.then(response => {

				message.reply(response.data.response);

			})

			.catch(err => {

				// catch all potential errors

				message.reply(`${err}`);

				console.error(err);

			});

	}

});

process.on('unhandledRejection', error => {

	if (error.code === 'ENOTFOUND') {

		console.log('No internet connection');

	}

	if (error.code === 'ECONNREFUSED') {

		console.log('Connection refused');

	}

});

client.on('message', message => {

	if (message.guild.id === '831393942494117920') {

		if (

			message.content.includes(

				'discord.gg/' || 'discordapp.com/invite/' || 'https://'

			)

		) {

			//if it contains an invite link

			message

				.delete() //delete the message

				.then(

					message.reply(

						'Link Deleted: \n**Invite links are not permitted on this server**'

					)

				);

		}

	}

});

client.login(process.env.TOKEN);

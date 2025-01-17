
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');

const { BotFrameworkAdapter, ChannelServiceRoutes, SkillHandler, SkillHttpClient } = require('botbuilder');
const { MyConversationIdFactory } = require('./myConversationIdFactory');
const { ParentBot } = require('./parentBot');
const { AuthenticationConfiguration, SimpleCredentialProvider } = require('botframework-connector');

dotenv.config({ path: path.join(__dirname, '.env') });

// Create HTTP server
const server = restify.createServer();
server.name = `[${process.env.ParentAppName}]` || '[Skill Parent]';

const factory = new MyConversationIdFactory();

const credentialProvider = new SimpleCredentialProvider(process.env.MicrosoftAppId, process.env.MicrosoftAppPassword);
const authConfig = new AuthenticationConfiguration();

const skillClient = new SkillHttpClient(credentialProvider, factory);
const bot = new ParentBot(skillClient);

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const skillHandler = new SkillHandler(adapter, bot, factory, credentialProvider, authConfig);
// Forward

const toUrl = process.env.SkillEndpoint || 'http://localhost:3978/api/messages';
const serviceUrl = process.env.ServiceUrl || 'http://localhost:3428/api/connector';

server.post('/api/messages', (req, res) => { 
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    }).catch(err => {
        console.error(`[${process.env.ParentAppName}] ran into an error:`);
        console.error(err);
    });
});

// Backward

const controller = new ChannelServiceRoutes(skillHandler);
controller.register(server, '/api/connector');

server.listen(process.env.port || process.env.PORT || 3428, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
});
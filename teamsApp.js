
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');

const { BotFrameworkAdapter, ChannelServiceRoutes, SkillHandler, SkillHttpClient } = require('botbuilder');
const { MyConversationIdFactory } = require('./myConversationIdFactory');
const { TeamsParentBot } = require('./teamsParentBot');
const { AuthenticationConfiguration, SimpleCredentialProvider } = require('botframework-connector');

dotenv.config({ path: path.join(__dirname, '.env') });

// Create HTTP server
const server = restify.createServer();
server.name = `[${process.env.TeamsAppName}]` || '[Skill Parent #2]';

const factory = new MyConversationIdFactory();

const credentialProvider = new SimpleCredentialProvider(process.env.TeamsAppId, process.env.TeamsAppPassword);
const authConfig = new AuthenticationConfiguration();

const skillClient = new SkillHttpClient(credentialProvider, factory);
const bot = new TeamsParentBot(skillClient);

const adapter = new BotFrameworkAdapter({
    appId: process.env.TeamsAppId,
    appPassword: process.env.TeamsAppPassword
});

const skillHandler = new SkillHandler(adapter, bot, factory, credentialProvider, authConfig);

// Forward

const toUrl = process.env.SkillEndpoint || 'http://localhost:3978/api/messages';
const serviceUrl = process.env.TeamsAppServiceUrl || `http://localhost:${process.env.TeamsAppPort}/api/connector`;


server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    }).catch(err => {
        console.error(`[${process.env.ParentAppName}] ran into an error:`);
        console.error(err);
    });
});

/*
server.post('/api/messages', (req, res) => { 
    ChannelServiceRoutes.readActivity(req)
        .then((activity) => {

            const currentConversationId = activity.conversation.id;
            const currentServiceUrl = activity.serviceUrl;

            const conversationId = factory.createConversationId(currentConversationId, currentServiceUrl);

            botFrameworkHttpClient.postActivity(process.env.TeamsAppId, process.env.SkillId, toUrl, serviceUrl, conversationId, activity)
                .then((invokeResponse) => {
                    console.log('done');

                    res.status(200);
                    res.end();
                });
        });
});
*/
// Backward

const controller = new ChannelServiceRoutes(skillHandler);
controller.register(server, '/api/connector');

server.listen(process.env.TeamsAppPort || 3999, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
});
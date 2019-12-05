
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkHttpClient, ChannelServiceRoutes } = require('botbuilder');
const { RoutingHandler } = require('./routingHandler');
const { MyConversationIdFactory } = require('./myConversationIdFactory');
const { AuthenticationConfiguration, SimpleCredentialProvider, MicrosoftAppCredentials } = require('botframework-connector');


// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3428, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

const credentials = new MicrosoftAppCredentials('', '');
const factory = new MyConversationIdFactory();

const credentialProvider = new SimpleCredentialProvider('', '');
const authConfig = new AuthenticationConfiguration();
const handler = new RoutingHandler(credentialProvider, authConfig, null, credentials, factory);

const botFrameworkHttpClient = new BotFrameworkHttpClient(credentialProvider, null);

// Forward

const toUrl = 'http://localhost:3978/api/messages';
const serviceUrl = 'http://localhost:3428/api/connector';

server.post('/api/messages', (req, res) => {

    ChannelServiceRoutes.readActivity(req)
        .then((activity) => {

            const currentConversationId = activity.conversation.id;
            const currentServiceUrl = activity.serviceUrl;

            const conversationId = factory.createConversationId(currentConversationId, currentServiceUrl);

            botFrameworkHttpClient.postActivity('', '', toUrl, serviceUrl, conversationId, activity)
                .then((invokeResponse) => {
                    console.log('done');

                    res.status(200);
                    res.end();
                });
        });
});

// Backward

const controller = new ChannelServiceRoutes(handler);
controller.register('/api/connector', server);

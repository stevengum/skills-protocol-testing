
const { ChannelServiceHandler } = require('botbuilder');
const { ConnectorClient } = require('botframework-connector');

class RoutingHandler extends ChannelServiceHandler {

    constructor(credentialProvider, authConfig, channelService, credentials, factory) {
        super(credentialProvider, authConfig, channelService);
        this.credentials = credentials;
        this.factory = factory;
    }

    async onSendToConversation(claimsIdentity, conversationId, activity) {

        console.log('onSendToConversation');

        return { id: '1234' };
    }

    async onReplyToActivity(claimsIdentity, conversationId, activityId, activity) {

        console.log(`onReplyToActivity ${activity.text}`);

        const conversationInfo = this.factory.getConversationInfo(activity.conversation.id);

        activity.conversation.id = conversationInfo.conversationId;
        activity.serviceUrl = conversationInfo.serviceUrl;

        const connectorClient = new ConnectorClient(this.credentials, { baseUri: activity.serviceUrl } );

        const resourceResponse = await connectorClient.conversations.replyToActivity(activity.conversation.id, activity.replyToId, activity);
    }
}

module.exports = { RoutingHandler: RoutingHandler };

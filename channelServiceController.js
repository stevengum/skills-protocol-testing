
class ChannelServiceController {

    constructor(channelServiceHandler) {
        this.channelServiceHandler = channelServiceHandler;
    }

    startUp(baseAddress, server) {
        server.post(baseAddress + '/v3/conversations/:conversationId/activities', this.processSendToConversation.bind(this));
        server.post(baseAddress + '/v3/conversations/:conversationId/activities/:activityId', this.processReplyToActivity.bind(this));
        server.put(baseAddress + '/v3/conversations/:conversationId/activities/:activityId', this.processUpdateActivity.bind(this));
        server.del(baseAddress + '/v3/conversations/:conversationId/activities/:activityId', this.processDeleteActivity.bind(this));
        server.get(baseAddress + '/v3/conversations/:conversationId/activities/:activityId/members', this.processGetActivityMembers.bind(this));
        server.post(baseAddress + '/v3/conversations', this.processCreateConversation.bind(this));
        server.get(baseAddress + '/v3/conversations', this.processGetConversations.bind(this));
        server.get(baseAddress + '/v3/conversations/:conversationId/members', this.processGetConversationMembers.bind(this));
        server.get(baseAddress + '/v3/conversations/:conversationId/pagedmembers', this.processGetConversationPagedMembers.bind(this));
        server.del(baseAddress + '/v3/conversations/:conversationId/members/:memberId', this.processDeleteConversationMember.bind(this));
        server.post(baseAddress + '/v3/conversations/:conversationId/activities/history', this.processSendConversationHistory.bind(this));
        server.post(baseAddress + '/v3/conversations/:conversationId/attachments', this.processUploadAttachment.bind(this));
    }

    processSendToConversation(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceController.readActivity(req)
            .then((activity) => {
                this.channelServiceHandler.handleSendToConversation(authHeader, req.params.conversationId, activity)
                    .then((resourceResponse) => {
                        res.status(200);
                        if (resourceResponse) {
                            res.send(resourceResponse);
                        }
                        res.end();
                    })
            });
    }

    processReplyToActivity(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceController.readActivity(req)
            .then((activity) => {
                this.channelServiceHandler.handleReplyToActivity(authHeader, req.params.conversationId, req.params.activityId, activity)
                    .then((resourceResponse) => {
                        res.status(200);
                        if (resourceResponse) {
                            res.send(resourceResponse);
                        }
                        res.end();
                    })
            });
    }

    processUpdateActivity(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceController.readActivity(req)
            .then((activity) => {
                this.channelServiceHandler.handleUpdateActivity(authHeader, req.params.conversationId, req.params.activityId, activity)
                    .then((resourceResponse) => {
                        res.status(200);
                        if (resourceResponse) {
                            res.send(resourceResponse);
                        }
                        res.end();
                    })
            });
    }

    processDeleteActivity(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleUpdateActivity(authHeader, req.params.conversationId, req.params.activityId)
            .then((resourceResponse) => {
                res.status(200);
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.end();
            });
    }

    processGetActivityMembers(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleGetActivityMembers(authHeader, req.params.conversationId, req.params.activityId)
            .then((resourceResponse) => {
                res.status(200);
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.end();
            });
    }

    processCreateConversation(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        ChannelServiceController.readConversationParameters(req)
            .then((parameters) => {
                this.channelServiceHandler.handleCreateConversation(authHeader, req.params.conversationId, req.params.activityId, parameters)
                    .then((resourceResponse) => {
                        res.status(201);
                        if (resourceResponse) {
                            res.send(resourceResponse);
                        }
                        res.end();
                    })
            });
    }

    processGetConversations(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleGetConversations(authHeader, req.params.conversationId, req.params.continuationToken)
            .then((resourceResponse) => {
                res.status(200);
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.end();
            });
    }

    processGetConversationMembers(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleGetConversationMembers(authHeader, req.params.conversationId)
            .then((resourceResponse) => {
                res.status(200);
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.end();
            });
    }

    processGetConversationPagedMembers(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleGetConversationPagedMembers(
            authHeader,
            req.params.conversationId,
            req.params.pageSize,
            req.params.continuationToken)
            .then((resourceResponse) => {
                res.status(200);
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.end();
            });
    }

    processDeleteConversationMember(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        this.channelServiceHandler.handleUpdateActivity(authHeader, req.params.conversationId, req.params.memberId)
            .then((resourceResponse) => {
                res.status(200);
                if (resourceResponse) {
                    res.send(resourceResponse);
                }
                res.end();
            });
    }

    processSendConversationHistory(req, res) {

    }

    processUploadAttachment(req, res) {

    }

    static readActivity(req) {
        return new Promise((resolve, reject) => {
            function returnActivity(activity) {
                if (typeof activity !== 'object') { throw new Error(`BotFrameworkAdapter.parseRequest(): invalid request body.`); }
                if (typeof activity.type !== 'string') { throw new Error(`BotFrameworkAdapter.parseRequest(): missing activity type.`); }
                if (typeof activity.timestamp === 'string') { activity.timestamp = new Date(activity.timestamp); }
                if (typeof activity.localTimestamp === 'string') { activity.localTimestamp = new Date(activity.localTimestamp); }
                if (typeof activity.expiration === 'string') { activity.expiration = new Date(activity.expiration); }
                resolve(activity);
            }
    
            if (req.body) {
                try {
                    returnActivity(req.body);
                } catch (err) {
                    reject(err);
                }
            } else {
                let requestData = '';
                req.on('data', (chunk) => {
                    requestData += chunk;
                });
                req.on('end', () => {
                    try {
                        req.body = JSON.parse(requestData);
                        returnActivity(req.body);
                    } catch (err) {
                        reject(err);
                    }
                });
            }
        });
    }

    static readConversationParameters(req) {
        return new Promise((resolve, reject) => {
            if (req.body) {
                try {
                    resolve(req.body);
                } catch (err) {
                    reject(err);
                }
            } else {
                let requestData = '';
                req.on('data', (chunk) => {
                    requestData += chunk;
                });
                req.on('end', () => {
                    try {
                        req.body = JSON.parse(requestData);
                        resolve(req.body);
                    } catch (err) {
                        reject(err);
                    }
                });
            }
        });
    }
   
}

module.exports = { ChannelServiceController: ChannelServiceController };

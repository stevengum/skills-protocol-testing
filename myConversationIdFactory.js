
class MyConversationIdFactory
{
    constructor() {
        this.forwardXref = {};
        this.backwardXref = {};
        this.nextId = 0;
    }

    createConversationId(currentConversationId, currentServiceUrl) {
        let result = '';
        if (this.forwardXref.hasOwnProperty(currentConversationId)) {
            result = this.forwardXref[currentConversationId];
        } else {
            result = `conversationId_${ this.nextId }`;
            this.forwardXref[currentConversationId] = result;
            this.nextId++;
        }
        this.backwardXref[result] = { conversationId: currentConversationId, serviceUrl: currentServiceUrl };
        return result;
    }

    getConversationInfo(nextConversationId) {

        return this.backwardXref[nextConversationId];
    }
}

module.exports = { MyConversationIdFactory : MyConversationIdFactory };

const { SkillConversationIdFactoryBase } = require('botbuilder');

class MyConversationIdFactory extends SkillConversationIdFactoryBase {
    constructor() {
        super();
        this.forwardXref = {};
        this.backwardXref = {};
        this.nextId = 0;
    }

    async createSkillConversationId(ref) {
        const convId = ref.conversation.id;
        let result = '';
        if (this.forwardXref.hasOwnProperty(convId)) {
            result = this.forwardXref[convId];
        } else {
            result = `conversationId_${ this.nextId }`;
            this.forwardXref[convId] = result;
            this.nextId++;
        }
        this.backwardXref[result] = ref;
        return result;
    }

    async getConversationReference(convId) {
        return this.backwardXref[convId];
    }

    async deleteConversationReference(convId) {
        delete this.forwardXref[convId];
        delete this.backwardXref[convId];
    }
}

module.exports = { MyConversationIdFactory : MyConversationIdFactory };

const { ActivityHandlerBase, SkillHttpClient } = require('botbuilder');

class ParentBot extends ActivityHandlerBase {
    /**
     * 
     * @param {SkillHttpClient} skillClient 
     */
    constructor(skillClient) {
        super();
        this.skillClient = skillClient;
    }

    async onMessageActivity(context) {
        const skill = {
            id: process.env.SkillAppName,
            appId: process.env.SkillId,
            skillEndpoint: process.env.SkillEndpoint
        };
        console.log(`[${process.env.ParentAppName}] forwarding Message Activity to [${process.env.SkillAppName}]`);
        await this.skillClient.postToSkill(process.env.MicrosoftAppId, skill, process.env.ServiceUrl, context.activity);
    }

    async onMembersAddedActivity(membersAdded, context) {
        await context.sendActivity(`Hi there, you joined a conversation with the [${process.env.ParentAppName}]`);
    }
}

module.exports.ParentBot = ParentBot;

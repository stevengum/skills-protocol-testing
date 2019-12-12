const { ActivityHandlerBase, SkillHttpClient } = require('botbuilder');

class TeamsParentBot extends ActivityHandlerBase {
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
        console.log(`[${process.env.TeamsAppName}] forwarding Message Activity to [${process.env.SkillAppName}]`);
        await this.skillClient.postToSkill(process.env.TeamsAppId, skill, process.env.TeamsAppServiceUrl, context.activity);
    }

    async onMembersAddedActivity(membersAdded, context) {
        await context.sendActivity(`Greetings citizen. You joined a conversation with the [${process.env.TeamsAppName}]`);
    }
}

module.exports.TeamsParentBot = TeamsParentBot;

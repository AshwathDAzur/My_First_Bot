/* eslint-disable no-unused-vars */
const { default: axios } = require('axios');
const { ActivityHandler, MessageFactory, ActivityTypes, ActionTypes } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            if (context.activity.text === 'wait') {
                await context.sendActivities([
                    { type: ActivityTypes.Typing },
                    { type: 'delay', value: 3000 },
                    { type: ActivityTypes.Message, text: 'Finished typing' }
                ]);
            } else if (context.activity.text === 'Create User') {
                await this.apicall(context);
            } else {
                await context.sendActivity(`Bot : ${ context.activity.text }`);
            }
            await next();
        });
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(
                        MessageFactory.text(welcomeText, welcomeText)
                    );
                    await this.sendsuggestedActions(context);
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async sendsuggestedActions(context) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Create User',
                value: 'Create User'
            }
        ];
        var reply = MessageFactory.suggestedActions(cardActions, 'Do you want to create a user?');
        await context.sendActivity(reply);
    }

    async apicall(context) {
        const reqbody = {
            name: 'Ashwath',
            job: 'Software Engineer'
        };
        try {
            const repsonse = await axios.post('https://reqres.in/api/users', reqbody);
            await context.sendActivity(`User created with user name : ${ repsonse.data.name } and job  ${ repsonse.data.job } at  ${ repsonse.data.createdAt } `);
            await context.sendActivity(`User id :  ${ repsonse.data.id }`);
        } catch (error) {
            await context.sendActivity(`The error is : ${ error }`);
        }
    }
}

module.exports.EchoBot = EchoBot;

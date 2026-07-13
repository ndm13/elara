import {Command, CommandContext, createStringOption, Declare, Options} from 'npm:seyfert';
import {ApplicationCommandType} from "npm:seyfert@3.2.6/lib/types/index.js";

const greetings = [
    "👋 Hi!",
    "*peeks nervously around corner*",
    "Oh, hey [user]!",
    "Aww, hi there! 😊",
    "So polite! 🤩 Hello to you too!"
];

const options = {
    topic: createStringOption({
        description: "I want to know...",
        choices: [
            {
                name: "who are you?",
                value: "who"
            },
            {
                name: "where did you come from?",
                value: "where"
            },
            {
                name: "what can you do?",
                value: "what"
            }
        ]
    })
};

@Declare({
    name: 'hi',
    description: 'Say hi to me!',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
@Options(options)
export default class HiCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        switch (ctx.options.topic) {
            case "who":
                return ctx.write({
                    content: `I'm Elara, nice to meet you!

I'm mostly here to help with AI Dungeon things: looking up scenarios/adventures/profiles, verifying accounts, stuff like that. I can browse the site just like any other user, but I do it a bit faster 🤭`
                });
            case "where":
                return ctx.write({
                    content: `If you look above my message, you'll see a little reply marker. That'll show who used the command... unless I'm replying to myself 🙃

As a Discord app, I can be added to a specific user or to a whole server. The difference is how many people can ask me for help at once! If you're seeing my messages and I haven't been added to the server, it's because I've been added by a user.

In a more metaphysical sense... I "came from" frustrations around accessing AI Dungeon content. Needing to load the site for everything is such a pain, and some things like downloading adventures are pretty much impossible in the normal website! But I'm here to help with all of that.

-# But if you're asking if I'm open source, [the answer is yes](<https://elara.help/>) 😆`
                });
            case "what":
                return ctx.write({
                    content: `I'm currently set up to do the following:\n` + ctx.client.commands.values.sort((a,b) => a.type - b.type).map(command => {
                        switch (command.type) {
                            case ApplicationCommandType.ChatInput:
                                return `- **\`/${command.name}\`**: ${command.description}`;
                            case ApplicationCommandType.Message:
                                return `- **${command.name}**: Right-click a message to activate this command!`;
                            case ApplicationCommandType.User:
                                return `- **${command.name}**: Right-click a user to activate this command!`;
                        }
                    }).join('\n')
                })
            default:
                return ctx.write({
                    content: greetings[Math.floor(Math.random() * greetings.length)]
                        .replaceAll('[user]',`<@${ctx.interaction.user.id}>`)
                });
        }
    }
}
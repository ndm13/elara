import {Command, CommandContext, Declare} from 'npm:seyfert';
import {MessageFlags} from "seyfert/lib/types/index.js";

@Declare({
    name: 'dm',
    description: 'Ask me for things privately!',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
export default class DMCommand extends Command {
    async run(ctx: CommandContext<any>) {
        const channel = await ctx.interaction.user.dm();
        if (ctx.interaction.channel.id === channel.id) {
            return ctx.write({
                content: "*looks around, confused*\n...are we not already here?"
            });
        }

        await ctx.client.messages.write(channel.id, {
            content: "You wanted to ask me something?\n-# Don't worry, all the normal commands should work here!"
        });

        return ctx.write({
            content: `Check your DMs! ${channel.url}`,
            flags: MessageFlags.Ephemeral
        });
    }
}
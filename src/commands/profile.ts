import {
    Command,
    Declare,
    Options,
    createStringOption,
    ExtendContext
} from 'npm:seyfert';
import BodyBuilder from "../common/BodyBuilder.ts";
import Stopwatch from "../common/Stopwatch.ts";

const options = {
    username: createStringOption({
        description: "The name of the user's profile",
        required: true,
    })
};

@Declare({
    name: 'profile',
    description: 'Look up an AI Dungeon profile',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
@Options(options)
export default class ProfileCommand extends Command {

    async run(ctx: ExtendContext<typeof options>) {
        const time = new Stopwatch();

        try {
            const profile = await ctx.api.getProfile(ctx.options.username);
            return await ctx.write(BodyBuilder.scenarioDetailsPayload(profile, time, `/profile/${ctx.options.username}`));
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭\n-# Maybe it's private or deleted?",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
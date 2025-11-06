import {
    Command,
    Declare,
    Options,
    createStringOption
} from 'npm:seyfert';
import {MessageFlags} from 'seyfert/lib/types/index.js';
import BodyBuilder from "../common/BodyBuilder.ts";
import Stopwatch from "../common/Stopwatch.ts";
import { privacy, sendWithPrivacy } from "../common/privacy.ts";

const options = {
    username: createStringOption({
        description: "The name of the user's profile",
        required: true,
    }),
    privacy
};

@Declare({
    name: 'profile',
    description: 'Look up an AI Dungeon profile',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
@Options(options)
export default class ProfileCommand extends Command {

    async run(ctx: CommandContext<typeof options>) {
        const time = new Stopwatch();

        try {
            const profile = await ctx.api.getUser(ctx.options.username);
            return await sendWithPrivacy(ctx,
                BodyBuilder.profileDetailsPayload(profile, time, `/profile/${ctx.options.username}`)
            );
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭\n-# Maybe it's private or deleted?",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
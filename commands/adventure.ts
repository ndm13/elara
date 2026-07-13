import {
    Command,
    Declare,
    Options,
    createStringOption
} from 'seyfert';
import type { CommandContext } from 'seyfert';
import { MessageFlags } from "seyfert/lib/types/index.js";
import BodyBuilder from "../common/BodyBuilder.ts";
import Stopwatch from "../common/Stopwatch.ts";
import {privacy, sendWithPrivacy} from "../common/privacy.ts";
import {nsfwCheck} from "../common/nsfwCheck.ts";

const options = {
    id: createStringOption({
        description: "The ID of the adventure",
        required: true,
    }),
    privacy
};

@Declare({
    name: 'adventure',
    description: 'Look up an AI Dungeon adventure',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
@Options(options)
export default class AdventureCommand extends Command {

    override async run(ctx: CommandContext<typeof options>) {
        const time = new Stopwatch();

        try {
            const adventure = await ctx.api.getAdventure(ctx.options.id);
            const payload = BodyBuilder.adventureDetailsPayload(adventure, time, `/adventure/${ctx.options.id}/${adventure.title.toLowerCase().replaceAll(/\W+/g, '-')}`, ctx.options.id);
            if (nsfwCheck(ctx, adventure)) {
                return await ctx.write({
                    content: `This adventure is ${adventure.contentRating !== 'Unrated' ? 'rated ' : ''}${adventure.contentRating}, and I can't post that in a non-NSFW channel. I'll just show it to you!`,
                    ...payload,
                    flags: MessageFlags.Ephemeral
                });
            }
            return await sendWithPrivacy(ctx, payload);
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭\n-# Maybe it's private or deleted?",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
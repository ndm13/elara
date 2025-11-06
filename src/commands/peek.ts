import {
    Command,
    Declare,
    Options,
    createStringOption,
    CommandContext
} from 'npm:seyfert';
import {MessageFlags} from 'seyfert/lib/types/index.js';
import BodyBuilder from "../common/BodyBuilder.ts";
import Stopwatch from "../common/Stopwatch.ts";

const options = {
    link: createStringOption({
        description: "The link to the content (scenario, adventure, profile)",
        required: true,
    }),
    discretion: createStringOption({
        description: "I can keep it private, but by default I show everyone",
        choices: [
            { name: "DM it to you", value: "dm" },
            { name: "Reply here, but only show you", value: "private" },
            { name: "Reply here and show everyone", value: "public" }
        ]
    })
};

@Declare({
    name: 'peek',
    description: 'Get details for an AI Dungeon link',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
@Options(options)
export default class PeekCommand extends Command {

    async run(ctx: CommandContext<typeof options>) {
        const time = new Stopwatch();
        const url = new URL(ctx.options.link);
        const matches = /\/(((?<type>scenario|adventure)\/(?<id>[\w-]+)\/.+)|((?<type>profile)\/(?<id>[\w-]+)))/.exec(url.pathname);

        if (!matches) {
            return await ctx.write({
                content: "Wait... is that a *real* AI Dungeon link? To a scenario, adventure, or profile? I couldn't read it 😖",
                flags: MessageFlags.Ephemeral
            });
        }

        const replyType = ctx.options.discretion || 'public';

        const {type, id} = matches.groups;
        const path = url.pathname + url.search;

        const channel = replyType === 'dm' ? ctx.author.dm() : ctx;

        try {
            switch (type) {
                case 'scenario': {
                    const scenario = await ctx.api.getScenario(id);
                    return await channel.write({
                        ...BodyBuilder.scenarioDetailsPayload(scenario, time, path),
                        flags: replyType === 'private' ? MessageFlags.Ephemeral : undefined
                    });
                }
                case 'adventure': {
                    const adventure = await ctx.api.getAdventure(id);
                    return await channel.write({
                        ...BodyBuilder.adventureDetailsPayload(adventure, time, path),
                        flags: replyType === 'private' ? MessageFlags.Ephemeral : undefined
                    });
                }
                case 'profile': {
                    const profile = await ctx.api.getUser(id);
                    return await channel.write({
                        ...BodyBuilder.profileDetailsPayload(profile, time, path),
                        flags: replyType === 'private' ? MessageFlags.Ephemeral : undefined
                    });
                }
                default:
                    console.error(`Unknown type ${type}`);
            }
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭\n-# Maybe it's private or deleted? I tried to look up `" + url.pathname + "`...\n```\n" + e.message + "\n```",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
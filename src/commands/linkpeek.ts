import {
    ContextMenuCommand,
    Declare,
    MenuCommandContext,
    MessageCommandInteraction
} from 'seyfert';
import {MessageFlags} from 'seyfert/lib/types/index.js';
import BodyBuilder from "../common/BodyBuilder.ts";
import Stopwatch from "../common/Stopwatch.ts";

@Declare({
    name: 'Peek AI Dungeon Link',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM'],
    type: 3
})
export default class LinkPeekCommand extends ContextMenuCommand {

    async run(ctx: MenuCommandContext<MessageCommandInteraction>) {
        const time = new Stopwatch();

        const matches = /https:\/\/[\w.-]+(?<path>\/(?:(?<type>scenario|adventure)\/(?<id>[\w-]+)\/[^?\s]+|(?<type>profile)\/(?<id>[\w-]+))(?<query>\?[^)\s]*[^\s.),?!"'])?(?=[\s.),?!"']|$))/.exec(ctx.target.content);

        if (!matches) {
            return await ctx.write({
                content: "Aww, I *tried* to find a link, but didn't see anything that looked right! 😮‍💨\n-# I look for links in the format `https://domain.name.here/[scenario/adventure]/[id]/blah-blah-blah?with=params&or=whatever` or `https://domain.name.here/profile/[name]?with=params&or=whatever`",
                flags: MessageFlags.Ephemeral
            });
        }

        const {type, id} = matches.groups;
        const url = new URL((matches as RegExpMatchArray)[0]);
        const path = url.pathname + url.search;

        try {
            switch (type) {
                case 'scenario': {
                    const scenario = await ctx.api.getScenario(id);
                    return await ctx.write({
                        flags: MessageFlags.Ephemeral,
                        ...BodyBuilder.scenarioDetailsPayload(scenario, time, path)
                    });
                }
                case 'adventure': {
                    const adventure = await ctx.api.getAdventure(id);
                    return await ctx.write({
                        flags: MessageFlags.Ephemeral,
                        ...BodyBuilder.adventureDetailsPayload(adventure, time, path)
                    });
                }
                case 'profile': {
                    const profile = await ctx.api.getUser(id);
                    return await ctx.write({
                        flags: MessageFlags.Ephemeral,
                        ...BodyBuilder.profileDetailsPayload(profile, time, path)
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
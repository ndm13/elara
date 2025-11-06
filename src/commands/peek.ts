import {Command, CommandContext, createStringOption, Declare, Options} from 'npm:seyfert';
import {privacy, sendWithPrivacy} from "../common/privacy.ts";
import {MessageFlags} from 'seyfert/lib/types/index.js';
import BodyBuilder from "../common/BodyBuilder.ts";
import Stopwatch from "../common/Stopwatch.ts";

const options = {
    link: createStringOption({
        description: "The link to the content (scenario, adventure, profile)",
        required: true,
    }),
    privacy
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

        const {type, id} = matches.groups;
        const path = url.pathname + url.search;

        let payload;
        try {
            switch (type) {
                case 'scenario': {
                    const scenario = await ctx.api.getScenario(id);
                    payload = BodyBuilder.scenarioDetailsPayload(scenario, time, path);
                    break;
                }
                case 'adventure': {
                    const adventure = await ctx.api.getAdventure(id);
                    payload = BodyBuilder.adventureDetailsPayload(adventure, time, path);
                    break;
                }
                case 'profile': {
                    const profile = await ctx.api.getUser(id);
                    payload = BodyBuilder.profileDetailsPayload(profile, time, path);
                    break;
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

        return await sendWithPrivacy(ctx, payload);
    }
}
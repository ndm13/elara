import {Command, CommandContext, createStringOption, Declare, Options} from 'npm:seyfert';
import {MessageFlags} from "seyfert/lib/types/index.js";
import BodyBuilder from "../common/BodyBuilder.ts";
import Stopwatch from "../common/Stopwatch.ts";
import {privacy, sendWithPrivacy} from "../common/privacy.ts";
import {nsfwCheck} from "../common/nsfwCheck.ts";

const options = {
    id: createStringOption({
        description: "The ID of the scenario",
        required: true,
    }),
    privacy
};

@Declare({
    name: 'scenario',
    description: 'Look up an AI Dungeon scenario',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
@Options(options)
export default class ScenarioCommand extends Command {

    async run(ctx: CommandContext<typeof options>) {
        const time = new Stopwatch();

        try {
            const scenario = await ctx.api.getScenario(ctx.options.id);
            const payload = BodyBuilder.scenarioDetailsPayload(scenario, time, `/scenario/${ctx.options.id}/${scenario.title.toLowerCase().replaceAll(/\W+/g, '-')}`, id);
            if (nsfwCheck(ctx, scenario)) {
                return await ctx.write({
                    content: `This scenario is ${scenario.contentRating !== 'Unrated' ? 'rated ' : ''}${scenario.contentRating}, and I can't post that in a non-NSFW channel. I'll just show it to you!`,
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
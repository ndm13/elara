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
    id: createStringOption({
        description: "The ID of the scenario",
        required: true,
    })
};

@Declare({
    name: 'scenario',
    description: 'Look up an AI Dungeon scenario',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
@Options(options)
export default class ScenarioCommand extends Command {

    async run(ctx: ExtendContext<typeof options>) {
        const time = new Stopwatch();

        try {
            const scenario = await ctx.api.getScenario(ctx.options.id);
            return await ctx.write(BodyBuilder.scenarioDetailsPayload(scenario, time, `/scenario/${ctx.options.id}/${scenario.title.toLowerCase().replace(/\W+/, '-')}`));
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭\n-# Maybe it's private or deleted?",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
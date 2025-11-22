import { ComponentCommand, type ComponentContext } from 'seyfert';

import { MessageFlags } from 'seyfert/lib/types/index.js';
import Stopwatch from "../common/Stopwatch.ts";
import BodyBuilder from "../common/BodyBuilder.ts";
import {slug} from "../common/slug.ts";

export default class OpenProfileButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('open_scenario_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const time = new Stopwatch();
        const id = ctx.customId.slice(14);

        try {
            const scenario = await ctx.api.getScenario(id);
            return await ctx.write({
                flags: ctx.interaction.message.flags & ~MessageFlags.IsComponentsV2,
                ...BodyBuilder.scenarioDetailsPayload(scenario, time, `/scenario/${id}/${slug(scenario.title)}`)
            });
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
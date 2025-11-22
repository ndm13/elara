import {ComponentCommand, type ComponentContext} from 'npm:seyfert';
import {MessageFlags} from "npm:seyfert@3.2.6/lib/types/index.js";
import BodyBuilder from "../common/BodyBuilder.ts";
import Stopwatch from "../common/Stopwatch.ts";

export default class AdvancedButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('advanced_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const time = new Stopwatch();
        const {type, id} = /^advanced_(?<type>[^_]+)_(?<id>.*)$/.exec(ctx.customId).groups;

        try {
            switch (type) {
                case 'scenario': {
                    const data = await ctx.api.getAdvancedScenario(id);
                    const {flags, ...payload} = BodyBuilder.advancedScenarioPayload(data, id, time);
                    return await ctx.write({
                        ...payload,
                        flags: ctx.interaction.message.flags | flags
                    });
                }
                case 'adventure': {
                    const data = await ctx.api.getAdvancedAdventure(id);
                    const {flags, ...payload} = BodyBuilder.advancedAdventurePayload(data, id, time);
                    return await ctx.write({
                        ...payload,
                        flags: ctx.interaction.message.flags | flags
                    });
                }
                default: {
                    return await ctx.write({
                        content: `Sorry, it looks like I got an unexpected request type (\`${type}\`).`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
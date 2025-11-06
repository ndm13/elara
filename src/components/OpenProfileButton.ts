import { ComponentCommand, type ComponentContext } from 'seyfert';

import { MessageFlags } from 'seyfert/lib/types/index.js';
import Stopwatch from "../common/Stopwatch.ts";
import BodyBuilder from "../common/BodyBuilder.ts";

export default class OpenProfileButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('open_profile_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const time = new Stopwatch();
        const id = ctx.customId.slice(13);

        try {
            const profile = await ctx.api.getUser(id);
            return await ctx.write({
                flags: MessageFlags.Ephemeral,
                ...BodyBuilder.profileDetailsPayload(profile, time, `/profile/${id}`)
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
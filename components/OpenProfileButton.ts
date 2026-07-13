import { ComponentCommand } from 'seyfert';
import type { ComponentContext } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';
import Stopwatch from "../common/Stopwatch.ts";
import BodyBuilder from "../common/BodyBuilder.ts";
import {customIdRouter} from "../common/customId.ts";

export default class OpenProfileButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('open_profile_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const time = new Stopwatch();
        const parsed = customIdRouter.openProfile.parse(ctx.customId);
        if (!parsed) return;
        const {id} = parsed;

        try {
            const profile = await ctx.api.getUser(id);
            return await ctx.write({
                flags: ctx.interaction.message.flags,
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
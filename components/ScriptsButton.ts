import {AttachmentBuilder, ComponentCommand} from 'seyfert';
import type { ComponentContext } from 'seyfert';
import {MessageFlags} from "seyfert/lib/types/index.js";
import {Buffer} from 'node:buffer';
import {customIdRouter} from "../common/customId.ts";

export default class ScriptsButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('scripts_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const parsed = customIdRouter.scripts.parse(ctx.customId);
        if (!parsed) return;
        const {id} = parsed;

        try {
            const scripts = await ctx.api.getAdvancedScenario(id);

            const files = [];

            if (scripts.gameCodeOnInput)
                files.push(new AttachmentBuilder()
                    .setName(`scenario-${id}-script-input.js`)
                    .setDescription(`Input script for the scenario with ID ${id}`)
                    .setFile('buffer', Buffer.from(scripts.gameCodeOnInput, 'utf8')));

            if (scripts.gameCodeOnModelContext)
                files.push(new AttachmentBuilder()
                    .setName(`scenario-${id}-script-context.js`)
                    .setDescription(`Context script for the scenario with ID ${id}`)
                    .setFile('buffer', Buffer.from(scripts.gameCodeOnModelContext, 'utf8')));

            if (scripts.gameCodeOnOutput)
                files.push(new AttachmentBuilder()
                    .setName(`scenario-${id}-script-output.js`)
                    .setDescription(`Output script for the scenario with ID ${id}`)
                    .setFile('buffer', Buffer.from(scripts.gameCodeOnOutput, 'utf8')));

            if (scripts.gameCodeSharedLibrary)
                files.push(new AttachmentBuilder()
                    .setName(`scenario-${id}-script-library.js`)
                    .setDescription(`Library script for the scenario with ID ${id}`)
                    .setFile('buffer', Buffer.from(scripts.gameCodeSharedLibrary, 'utf8')));

            return await ctx.write({
                content: "Here are the scripts!",
                files,
                flags: ctx.interaction.message.flags & ~MessageFlags.IsComponentsV2
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
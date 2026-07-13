import {createStringOption} from "npm:seyfert";
import {MessageFlags} from 'seyfert/lib/types/index.js';

export const privacy = createStringOption({
    description: "I can keep it private, but by default I show everyone",
    choices: [
        { name: "Send me a DM", value: "dm" },
        { name: "Reply just for me", value: "private" },
        { name: "Reply for everyone", value: "public" }
    ]
});

export async function sendWithPrivacy(ctx: CommandContext<typeof privacy>, payload) {
    switch (ctx.options.privacy || 'public') {
        case 'private': {
            return await ctx.write({
                ...payload,
                flags: MessageFlags.Ephemeral
            });
        }
        case 'public': {
            return await ctx.write(payload);
        }
        case 'dm': {
            try {
                await ctx.client.messages.write((await ctx.interaction.user.dm()).id, payload);
                return await ctx.write({
                    content: "I DM'd you the details!",
                    flags: MessageFlags.Ephemeral
                });
            } catch (e) {
                console.error(e);
                return await ctx.write({
                    content: "Mrrrgh, I *tried* to DM you the details, but Discord isn't letting me!",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
}
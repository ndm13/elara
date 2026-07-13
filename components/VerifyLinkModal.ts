import {ModalCommand} from 'seyfert';
import type { ModalContext } from 'seyfert';
import {MessageFlags} from "seyfert/lib/types/index.js";
import {verifyToken} from "../common/verification.ts";
import BodyBuilder from "../common/BodyBuilder.ts";
import {parseDungeonUrl} from "../common/dungeonUrl.ts";

export default class VerifyLinkModal extends ModalCommand {
    override filter(ctx: ModalContext) {
        return ctx.customId === 'verify_link_modal';
    }

    override async run(ctx: ModalContext) {
        const link = ctx.getInputValue('link', true) as string;
        const parsed = parseDungeonUrl(link);

        if (!parsed || parsed.type !== 'adventure' || !parsed.hostname.endsWith('.aidungeon.com'))
            return await ctx.write({
                content: "Wait, that doesn't look like a valid AI Dungeon adventure link to me! Please copy the link from AI Dungeon.",
                flags: MessageFlags.Ephemeral
            });

        const { id } = parsed;

        try {
            const state = await ctx.api.getVerifyAdventureState(id);

            if (state.storyCardCount !== 1)
                return await ctx.write({
                    content: "Oh. It looks like there are multiple story cards here. I can't verify an adventure that's been tampered with!",
                    flags: MessageFlags.Ephemeral
                });

            if (state.scenarioId !== "12007316")
                return await ctx.write({
                    content: "Hm, this wasn't created using the link I sent. Are you sure it's the right adventure?",
                    flags: MessageFlags.Ephemeral
                });

            if (state.playerCount !== 1)
                return await ctx.write({
                    content: "Oh no, it looks like someone else has access to this adventure!\n\nIf you enabled multiplayer, that means someone else could edit the token and replace it with their own! Go ahead and verify again using a fresh adventure (`/verify start`).",
                    flags: MessageFlags.Ephemeral
                });
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "*sigh...* I tried, but I couldn't find that link. 😮‍💨\n-# Did you remember to set it to unlisted?",
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            const { storyCards, user } = await ctx.api.getVerifyStoryCards(id);

            if (storyCards.length !== 1)
                return await ctx.write({
                    content: "...weird. It looks like there's more than one story card here. I can't verify an adventure that's been edited, sorry.",
                    flags: MessageFlags.Ephemeral
                });

            const storyCard = storyCards[0];
            const token = storyCard.value;
            const verified = await verifyToken(token, ctx.interaction.user.id);

            if (!verified)
                return await ctx.write({
                    content: "Oh no! It looks like this token doesn't match your account! Are you sure it's the right link?",
                    flags: MessageFlags.Ephemeral
                });

            return await ctx.write(BodyBuilder.accountLinkedPayload(ctx.interaction.user, user.profile));
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "***Weird.*** The adventure is there, but I can't read the story cards!",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
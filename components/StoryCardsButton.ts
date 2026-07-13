import {AttachmentBuilder, ComponentCommand} from 'seyfert';
import type { ComponentContext } from 'seyfert';
import {MessageFlags} from "seyfert/lib/types/index.js";
import {Buffer} from 'node:buffer';
import {customIdRouter} from "../common/customId.ts";

export default class StoryCardsButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('story_cards_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        await ctx.deferReply({
            ephemeral: ctx.interaction.flags & MessageFlags.Ephemeral === MessageFlags.Ephemeral
        });
        const parsed = customIdRouter.storyCards.parse(ctx.customId);
        if (!parsed) return;
        const {type, id} = parsed;

        try {
            switch (type) {
                case 'scenario': {
                    const cards = await ctx.api.getStoryCardsScenario(id);
                    const data = JSON.stringify(cards.storyCards, undefined, 2);
                    return await ctx.editOrReply({
                        content: "Sure, here are the story cards!",
                        files: [
                            new AttachmentBuilder()
                                .setName(`scenario-${id}-story-cards-${cards.storyCards.length}.json`)
                                .setDescription(`Story cards for the scenario with ID ${id}`)
                                .setFile('buffer', Buffer.from(data, 'utf8'))
                        ],
                        flags: ctx.interaction.message.flags & ~MessageFlags.IsComponentsV2
                    });
                }
                case 'adventure': {
                    const cards = await ctx.api.getStoryCardsAdventure(id);
                    const data = JSON.stringify(cards.storyCards, undefined, 2);
                    return await ctx.editOrReply({
                        content: "Sure, here are the story cards!",
                        files: [
                            new AttachmentBuilder()
                                .setName(`adventure-${id}-story-cards-${cards.storyCards.length}.json`)
                                .setDescription(`Story cards for the adventure with ID ${id}`)
                                .setFile('buffer', Buffer.from(data, 'utf8'))
                        ],
                        flags: ctx.interaction.message.flags & ~MessageFlags.IsComponentsV2
                    });
                }
                default: {
                    return await ctx.editOrReply({
                        content: `Sorry, it looks like I got an unexpected request type (\`${type}\`).`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        } catch (e) {
            console.error(e);
            return await ctx.editOrReply({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
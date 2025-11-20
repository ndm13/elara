import {AttachmentBuilder, ComponentCommand, type ComponentContext} from 'npm:seyfert';
import {MessageFlags} from "npm:seyfert@3.2.6/lib/types/index.js";
import {Buffer} from 'node:buffer';

export default class StoryCardsButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('story_cards_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const {type, id} = /^story_cards_(?<type>[^_]+)_(?<id>.*)$/.exec(ctx.customId).groups;

        try {
            switch (type) {
                case 'scenario': {
                    const cards = await ctx.api.getStoryCardsScenario(id);
                    const data = JSON.stringify(cards.storyCards, undefined, 2);
                    return await ctx.write({
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
                    return await ctx.write({
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
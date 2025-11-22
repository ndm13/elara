import {AttachmentBuilder, ComponentCommand, type ComponentContext} from 'npm:seyfert';
import {MessageFlags} from "npm:seyfert@3.2.6/lib/types/index.js";
import {Buffer} from 'node:buffer';
import {InteractionCreateBodyRequest} from "npm:seyfert@3.2.6/lib/common";

export default class AdventureStateButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('adventure_state_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const {type, id} = /^adventure_state_(?<type>[^_]+)_(?<id>.*)$/.exec(ctx.customId).groups;

        try {
            const data = await ctx.api.getAdvancedAdventure(id);
            let short: InteractionCreateBodyRequest = {
                flags: ctx.interaction.message.flags & ~MessageFlags.IsComponentsV2
            }, long: InteractionCreateBodyRequest = {...short};

            switch (type) {
                case 'scgen': {
                    long.content = short.content = `Here are the story card generator details!`;
                    long.files = [];

                    if (data.details?.storyCardInstructions) {
                        short.content += `\n### Generator Instructions\n\`\`\`md\n${data.details.storyCardInstructions}\n\`\`\``;
                        long.files.push(new AttachmentBuilder()
                            .setName(`adventure-${id}-story-card-instructions.md`)
                            .setDescription(`Story card instructions for adventure ${id}`)
                            .setFile('buffer', Buffer.from(data.details.storyCardInstructions, 'utf-8')))
                    }

                    if (data.details?.storyCardStoryInformation) {
                        short.content += `\n### Story Information\n\`\`\`md\n${data.details.storyCardStoryInformation}\n\`\`\``;
                        long.files.push(new AttachmentBuilder()
                            .setName(`adventure-${id}-story-card-story-information.md`)
                            .setDescription(`Story information for adventure ${id}`)
                            .setFile('buffer', Buffer.from(data.details.storyCardStoryInformation, 'utf-8')))
                    }

                    break;
                }
                case 'instructions': {
                    short.content = `Here are the custom AI instructions!\n\`\`\`md\n${data.details?.instructions?.custom}\n\`\`\``;
                    break;
                }
                case 'memory': {
                    short.content = `Here are the plot essentials!\n\`\`\`md\n${data.memory}\n\`\`\``;
                    long.content = "Here are the plot essentials! Looks like they're too long for one message...";
                    long.files = [
                        new AttachmentBuilder()
                            .setName(`adventure-${id}-memory.md`)
                            .setDescription(`Plot essentials for adventure ${id}`)
                            .setFile('buffer', Buffer.from(data.memory, 'utf8'))
                    ]
                    break;
                }
                case 'authors-note': {
                    short.content = `Here's the author's note!\n\`\`\`md\n${data.memory}\n\`\`\``;
                    long.content = "Here's the author's note! Feels like overkill...";
                    long.files = [
                        new AttachmentBuilder()
                            .setName(`adventure-${id}-authors-note.md`)
                            .setDescription(`Author's note for adventure ${id}`)
                            .setFile('buffer', Buffer.from(data.authorsNote, 'utf8'))
                    ]
                    break;
                }
                case 'summary': {
                    short.content = `Here's the story summary!\n>>> ${data.details?.storySummary}`;
                    long.content = "Here's the story summary! Sorry for the attachment, it's too long to send!";
                    long.files = [
                        new AttachmentBuilder()
                            .setName(`adventure-${id}-summary.md`)
                            .setDescription(`Story summary for adventure ${id}`)
                            .setFile('buffer', Buffer.from(data.details?.storySummary, 'utf-8'))
                    ];
                    break;
                }
                case 'game-state': {
                    short.content = `Here's the game state!\n\`\`\`json\n${data.gameState}\n\`\`\``;
                    long.content = "Here's the game state! Looks like someone has a lot of scripts!";
                    long.files = [
                        new AttachmentBuilder()
                            .setName(`adventure-${id}-game-state.json`)
                            .setDescription(`Game state for adventure ${id}`)
                            .setFile('buffer', Buffer.from(data.gameState, 'utf-8'))
                    ];
                    break;
                }
                case 'message': {
                    short.content = `Here's the active message!\n>>> ${data.message}`;
                    long.content = "Here's the active message! I've never seen one so big... is this even real?";
                    long.files = [
                        new AttachmentBuilder()
                            .setName(`adventure-${id}-message.txt`)
                            .setDescription(`Active message for adventure ${id}`)
                            .setFile('buffer', Buffer.from(data.message, 'utf-8'))
                    ];
                    break;
                }
                default: {
                    long.content = `That's weird, it looks like you're asking for help with ${type}, and I can't do that...`
                }
            }

            return await ctx.write(JSON.stringify(short).length >= 2000 ? long : short);
        } catch (e) {
            console.error(e);
            return await ctx.write({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
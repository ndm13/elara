import {AttachmentBuilder, ComponentCommand, type ComponentContext} from 'npm:seyfert';
import {MessageFlags} from "npm:seyfert@3.2.6/lib/types/index.js";
import {Buffer} from 'node:buffer';
import {InteractionCreateBodyRequest} from "npm:seyfert@3.2.6/lib/common";

export default class ScenarioStateButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('scenario_state_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const {type, id} = /^scenario_state_(?<type>[^_]+)_(?<id>.*)$/.exec(ctx.customId).groups;

        try {
            const data = await ctx.api.getAdvancedScenario(id);
            let short: InteractionCreateBodyRequest = {
                flags: ctx.interaction.message.flags & ~MessageFlags.IsComponentsV2
            }, long: InteractionCreateBodyRequest = {...short};

            switch (type) {
                case 'scgen': {
                    long.content = short.content = `Here are the story card generator details!`;
                    long.files = [];

                    if (data.state.storyCardInstructions) {
                        short.content += `\n### Generator Instructions\n\`\`\`md\n${data.state.storyCardInstructions}\n\`\`\``;
                        long.files.push(new AttachmentBuilder()
                            .setName(`scenario-${id}-story-card-instructions.md`)
                            .setDescription(`Story card instructions for scenario ${id}`)
                            .setFile('buffer', Buffer.from(data.state.storyCardInstructions, 'utf-8')))
                    }

                    if (data.state.storyCardStoryInformation) {
                        short.content += `\n### Story Information\n\`\`\`md\n${data.state.storyCardStoryInformation}\n\`\`\``;
                        long.files.push(new AttachmentBuilder()
                            .setName(`scenario-${id}-story-card-story-information.md`)
                            .setDescription(`Story information for scenario ${id}`)
                            .setFile('buffer', Buffer.from(data.state.storyCardStoryInformation, 'utf-8')))
                    }

                    break;
                }
                case 'instructions': {
                    short.content = `Here are the custom AI instructions!\n\`\`\`md\n${data.state.instructions?.scenario}\n\`\`\``;
                    break;
                }
                case 'memory': {
                    short.content = `Here are the plot essentials!\n\`\`\`md\n${data.memory}\n\`\`\``;
                    long.content = "Here are the plot essentials! Looks like they're too long for one message...";
                    long.files = [
                        new AttachmentBuilder()
                            .setName(`scenario-${id}-memory.md`)
                            .setDescription(`Plot essentials for scenario ${id}`)
                            .setFile('buffer', Buffer.from(data.memory, 'utf8'))
                    ]
                    break;
                }
                case 'prompt': {
                    short.content = `Here's the opening prompt!\n>>> ${data.prompt}`;
                    long.content = "Here's the opening prompt! Sorry for the attachment, it's too long to send!";
                    long.files = [
                        new AttachmentBuilder()
                            .setName(`scenario-${id}-prompt.md`)
                            .setDescription(`Opening prompt for scenario ${id}`)
                            .setFile('buffer', Buffer.from(data.prompt, 'utf-8'))
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
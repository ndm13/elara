import {AttachmentBuilder, ComponentCommand, type ComponentContext} from 'npm:seyfert';
import {MessageFlags} from "npm:seyfert@3.2.6/lib/types/index.js";
import {Buffer} from 'node:buffer';

export default class ScenarioStateButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('scenario_state_');
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const {type, id} = /^scenario_state_(?<type>[^_]+)_(?<id>.*)$/.exec(ctx.customId).groups;

        try {
            const data = await ctx.api.getAdvancedScenario(id);
            let content;

            switch (type) {
                case 'scgen': {
                    content = `Here's the story card generator details!`;

                    if (data.state.storyCardInstructions)
                        content += `\n### Generator Instructions\n\`\`\`md\n${data.state.storyCardInstructions}\n\`\`\``;

                    if (data.state.storyCardStoryInformation)
                        content += `\n### Story Information\n\`\`\`md\n${data.state.storyCardStoryInformation}\n\`\`\``;

                    break;
                }
                case 'instructions': {
                    content = `Here are the custom AI instructions!\n\`\`\`md\n${data.state.instructions?.scenario}\n\`\`\``;
                    break;
                }
                case 'memory': {
                    content = `Here's the custom plot essentials!\n\`\`\`md\n${data.memory}\n\`\`\``;
                    break;
                }
                case 'prompt': {
                    content = `Here's the opening prompt!\n>>> ${data.prompt}`;
                    break;
                }
                default: {
                    content = `That's weird, it looks like you're asking for help with ${type}, and I can't do that...`
                }
            }

            return await ctx.write({
                content,
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
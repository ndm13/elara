import {AttachmentBuilder, ComponentCommand} from 'seyfert';
import type { ComponentContext } from 'seyfert';
import {MessageFlags} from "seyfert/lib/types/index.js";
import {Buffer} from 'node:buffer';
import {Environment, Template, runtime, lib} from "nunjucks";
import {MultiplayerEntry, ReadAdventureData} from "../common/AIDungeonAPI.ts";
import {slug} from "../common/slug.ts";
import {customIdRouter} from "../common/customId.ts";
import readHtmlTemplate from "../templates/read.njk" with {type: 'text'};

const listFormatter = new Intl.ListFormat();

const env = new Environment();
env.addFilter('p', function(text: string) {
    return runtime.markSafe(
        lib.escape(text).replaceAll(/\n/gm,'\n    <br>\n    ')
    );
});
env.addFilter('blockquote', function(text: string) {
    return runtime.markSafe(
        lib.escape(text.replaceAll(/^>/gm,'')).replaceAll(/\n/gm,'<br>')
    )
});
env.addFilter('player', function(id: string, allPlayers: MultiplayerEntry[]) {
    return allPlayers.find(player => player.user.id === id);
});

const readHtml = new Template(readHtmlTemplate, env);

export default class ReadButton extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId.startsWith('read_');
    }

    override async run(ctx: ComponentContext<typeof this.componentType>) {
        await ctx.deferReply();

        const parsed = customIdRouter.read.parse(ctx.customId);
        if (!parsed) return;
        const {type, actions, id} = parsed;

        try {
            const data = await ctx.api.getReadAdventure(id, actions + 10) as ReadAdventureData;

            let content, files;

            switch (type) {
                case 'md': {
                    let md = `# ${data.title}\n\n`;

                    const authors = listFormatter.format(data.allPlayers.map(player => player.user.profile.title));
                    md += `An adventure by ${authors}\n\n---\n\n`;

                    for (const action of data.read.actions) {
                        switch (action.type) {
                            case 'start':
                            case 'story':
                            case 'continue': {
                                if (!action.undoneAt && !action.deletedAt)
                                    md += action.text;
                                break;
                            }
                            case 'do':
                            case 'say': {
                                if (!action.undoneAt && !action.deletedAt)
                                    md += `\n\n> ${action.text}\n\n`;
                                break;
                            }
                            case 'see': {
                                if (!action.undoneAt && !action.deletedAt)
                                    md += `\n\n![${action.imageText}](${action.imageUrl})\n\n`;
                                break;
                            }
                            default: {
                                console.warn(`Tried to process action type ${action.type} and failed: not implemented`);
                            }
                        }
                    }

                    content = "Here's the Markdown version of the adventure!";
                    files = [
                        new AttachmentBuilder()
                            .setName(`adventure-${id}-text.md`)
                            .setDescription(`The text of adventure ${id} in Markdown format.`)
                            .setFile('buffer', Buffer.from(md, 'utf8'))
                    ];
                    break;
                }
                case 'plain': {
                    let txt = '';
                    for (const action of data.read.actions) {
                        switch (action.type) {
                            case 'start':
                            case 'story':
                            case 'continue': {
                                txt += action.text;
                                break;
                            }
                            case 'do':
                            case 'say': {
                                txt += `\n\n${action.text}\n\n`;
                                break;
                            }
                            case 'see': {
                                txt += `\n\nImage: ${action.imageText}\n\n`;
                                break;
                            }
                            default: {
                                console.warn(`Tried to process action type ${action.type} and failed: not implemented`);
                            }
                        }
                    }

                    content = "Here's the plaintext version of the adventure!";
                    files = [
                        new AttachmentBuilder()
                            .setName(`adventure-${id}-text.txt`)
                            .setDescription(`The text of adventure ${id} in plain format.`)
                            .setFile('buffer', Buffer.from(txt, 'utf8'))
                    ];
                    break;
                }
                case 'html': {
                    const authors = listFormatter.format(data.allPlayers.map(player => player.user.profile.title));
                    const html = readHtml.render({
                        ...data,
                        authors,
                        link: `https://play.aidungeon.com/adventure/${id}/${slug(data.title)}`
                    });

                    content = "Here's the HTML version of the adventure!";
                    files = [
                        new AttachmentBuilder()
                            .setName(`adventure-${id}-text.html`)
                            .setDescription(`The text of adventure ${id} in HTML format.`)
                            .setFile('buffer', Buffer.from(html, 'utf8'))
                    ];
                    break;
                }
                default: {
                    content = `That's weird, it looks like you're asking for help with ${type}, and I can't do that...`
                }
            }

            return await ctx.editOrReply({
                content,
                files,
                flags: (ctx.interaction.message.flags || 0) & ~MessageFlags.IsComponentsV2
            });
        } catch (e) {
            console.error(e);
            return await ctx.editOrReply({
                content: "Mrrgh, I *thought* I found something, but when I asked AI Dungeon for details they yelled at me! 😭",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
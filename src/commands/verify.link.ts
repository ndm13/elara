import {ActionRow, CommandContext, Declare, Modal, SubCommand, TextInput} from 'npm:seyfert';
import {TextInputStyle} from "npm:seyfert@3.2.6/lib/types/index.js";
import {TextDisplay} from "npm:seyfert@3.2.6";

@Declare({
    name: 'link',
    description: 'Use a verification link to prove that you own an account',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
export default class VerifyLinkCommand extends SubCommand {

    async run(ctx: CommandContext<typeof options>) {
        const linkInput = new TextInput()
            .setCustomId('link')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("https://play.aidungeon.com/adventure/...")
            .setRequired(true)
            .setLabel('Verification Link');
        const modal = new Modal()
            .setCustomId('verify_link_modal')
            .setTitle("Enter your verification link")
            .setComponents([
                new TextDisplay()
                    .setContent("Elara will use the information in this adventure to verify your account. Make sure that the following is true:"),
                new TextDisplay()
                    .setContent("1. This adventure was created from the link Elara sent to you.\n2. The link you're pasting is the one from the link sharing box for the adventure.\n3. You have not edited the story cards in the adventure.\n4. You have not invited anyone to the adventure using the multiplayer feature."),
                new TextDisplay()
                    .setContent("Happy verifying! 🥰"),
                new ActionRow({
                    components: [linkInput]
                })
            ]);

        await ctx.interaction.modal(modal);
    }
}
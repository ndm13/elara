import {Command, Declare, Modal, TextInput, Label} from 'seyfert';
import type { CommandContext } from 'seyfert';
import {TextInputStyle} from "seyfert/lib/types/index.js";
import {generateToken} from "../common/verification.ts";

@Declare({
    name: 'verify',
    description: 'Prove that you own an AI Dungeon account!',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
export default class VerifyCommand extends Command {
    override async run(ctx: CommandContext) {
        const token = await generateToken(ctx.interaction.user.id);

        const modal = new Modal()
            .setCustomId('verify_link_modal')
            .setTitle("Verify your account")
            .addComponents(
                new Label()
                    .setLabel("Paste the link here when you're done!")
                    .setDescription(`To verify your account, start a new adventure and paste this verification token:\nToken: ${token}\n\nProduction link: https://play.aidungeon.com/scenario/Fn8ySPXhunQN/verify-discord-account/play`)
                    .setComponent(
                        new TextInput()
                            .setCustomId('link')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("https://play.aidungeon.com/adventure/...")
                            .setRequired(true)
                    )
            );

        await ctx.interaction.modal(modal);
    }
}
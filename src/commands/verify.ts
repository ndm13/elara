import {ActionRow, Command, CommandContext, Declare, Modal, TextDisplay, TextInput} from 'npm:seyfert';
import {generateToken} from "../common/verification.ts";

@Declare({
    name: 'verify',
    description: 'Prove that you own an AI Dungeon account!',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
export default class VerifyCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const token = await generateToken(ctx.interaction.user.id);

        const modal = new Modal()
            .setCustomId('verify_link_modal')
            .setTitle("Verify your account")
            .setComponents([
                new TextDisplay()
                    .setContent(`To verify your account, I'm going to ask you to start an adventure and paste a **verification token**. This lets me know that the person who created the adventure (you) is the same as the one using this account (you)!

If you've already verified your account, you can reuse a link you already made. I don't mind!
## Your verification token is:
### \`${token}\`
## Start Verification
Click the link for the site where you're signed in:
- **[Production](https://play.aidungeon.com/scenario/Fn8ySPXhunQN/verify-discord-account/play)** (choose this if you're not sure)
- **[Beta](https://beta.aidungeon.com/scenario/Fn8ySPXhunQN/verify-discord-account/play)** / **[Alpha](https://alpha.aidungeon.com/scenario/Fn8ySPXhunQN/verify-discord-account/play)**`),
                new ActionRow()
                    .setComponents(
                        new TextInput()
                            .setCustomId('link')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("https://play.aidungeon.com/adventure/...")
                            .setRequired(true)
                            .setLabel("Paste the link here when you're done!")
                    )
            ]);

        await ctx.interaction.modal(modal);
    }
}
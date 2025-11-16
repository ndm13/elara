import {SubCommand, CommandContext, Declare} from 'npm:seyfert';
import {MessageFlags} from "seyfert/lib/types/index.js";
import {generateToken, verifyToken} from "../common/verification.ts";

@Declare({
    name: 'start',
    description: 'Start the verification process',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
export default class VerifyStartCommand extends SubCommand {
    async run(ctx: CommandContext<any>) {
        const token = await generateToken(ctx.interaction.user.id);
        return ctx.write({
            content:
                `Awesome, let's get started!
1. Open [this link](https://play.aidungeon.com/scenario/Fn8ySPXhunQN/verify-discord-account/play) and read the disclaimer.
2. Once you've confirmed that you're verifying your own account, click **Verify Me, Elara!**
3. Enter this verification token: \`${token}\`, then Continue.
4. Follow the instructions to complete verification!
-# Don't worry, I won't have access to any of your data. This just lets me know that you own the account that opens the link! ❤️`,
            flags: MessageFlags.Ephemeral
        });
    }
}
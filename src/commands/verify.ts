import {Command, Declare, Options} from 'npm:seyfert';
import VerifyStartCommand from "./verify.start.ts";
import VerifyLinkCommand from "./verify.link.ts";

@Declare({
    name: 'verify',
    description: 'Prove that you own an AI Dungeon account!',
    integrationTypes: ['GuildInstall', 'UserInstall'],
    contexts: ['Guild', 'PrivateChannel', 'BotDM']
})
@Options([VerifyStartCommand, VerifyLinkCommand])
export default class VerifyCommand extends Command {}
import {AIDungeonAPI} from "./common/AIDungeonAPI.ts";
import { Client, extendContext, createMiddleware } from "seyfert";

const api = await AIDungeonAPI.guest();
const context = extendContext((_interaction) => ({ api }));

declare module 'seyfert' {
    interface UsingClient extends ParseClient<Client<true>> { } // Gateway
    interface ExtendContext extends ReturnType<typeof context> {}
}

const client = new Client({ context, globalMiddlewares: ["logger"] });

client.setServices({
    middlewares: {
        logger: createMiddleware<void>(
            (middle) => {
                if (middle.context.isChat())
                    middle.context.client.logger.info(`@${middle.context.author.username}: /${middle.context.resolver.fullCommandName}`);
                if (middle.context.isComponent())
                    middle.context.client.logger.info(`@${middle.context.author.username}: [${middle.context.customId}]`);
                if (middle.context.isMenu())
                    middle.context.client.logger.info(`@${middle.context.author.username}: <${middle.context.customId}>`);
                if (middle.context.isModal())
                    middle.context.client.logger.info(`@${middle.context.author.username}: (${middle.context.customId})`);
                middle.next();
            }
        )
    }
})

client
    .start()
    .then(() => client.uploadCommands({ cachePath: './commands.json' }));
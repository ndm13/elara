import {AIDungeonAPI} from "./common/AIDungeonAPI.ts";
import { Client, extendContext, createMiddleware, type ParseClient } from "seyfert";

import { commands } from "./commands/index.ts";
import { components } from "./components/index.ts";
import { events } from "./events/index.ts";

const api = await AIDungeonAPI.guest();
const context = extendContext((_interaction) => ({ api }));

declare module 'seyfert' {
    interface SeyfertRegistry {
        client: ParseClient<Client<true>>;
        middlewares: {
            logger: any;
        };
    }
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
                    middle.context.client.logger.info(`@${middle.context.author.username}: <${middle.context.interaction.data.name}>`);
                if (middle.context.isModal())
                    middle.context.client.logger.info(`@${middle.context.author.username}: (${middle.context.customId})`);
                middle.next();
            }
        )
    }
})

// Programmatically register commands, components, and events to support self-contained compilation
client.commands.set(commands as any);
client.components.set(components as any);
client.events.set(events as any);

client
    .start()
    .then(() => client.uploadCommands({ cachePath: './commands.json' }));
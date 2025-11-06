import {AIDungeonAPI} from "./common/AIDungeonAPI.ts";
import { Client, extendContext } from "seyfert";

const api = await AIDungeonAPI.guest();
const context = extendContext((_interaction) => ({ api }));

declare module 'seyfert' {
    interface UsingClient extends ParseClient<Client<true>> { } // Gateway
    interface ExtendContext extends ReturnType<typeof context> {}
}

const client = new Client({ context });
client
    .start()
    .then(() => client.uploadCommands({ cachePath: './commands.json' }));
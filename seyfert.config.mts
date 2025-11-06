import { config } from "seyfert";

export default config.bot({
    token: Deno.env.get('BOT_TOKEN') ?? "",
    locations: {
        base: "src",
        commands: "commands",
        events: "events",
        components: "components",
    },
    intents: ["Guilds"],
    publicKey: Deno.env.get('BOT_PUBLIC_KEY') ?? "",
    port: 4444
});
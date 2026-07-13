# Elara
Elara is a Discord bot that makes it easier to interact with AI Dungeon.
Currently very much under development.

## Commands

| Command | Description | Options |
|--------|-------------|---------|
| `/peek` | Display a card with details from a scenario, adventure, or profile | `link`: The link to preview<br>`privacy`: Show publicly, privately, or DM it |
| `/scenario` | Display a card with details from a scenario | `id`: The short ID of the scenario to preview<br>`privacy`: Show publicly, privately, or DM it |
| `/adventure` | Display a card with details from an adventure | `id`: The short ID of the adventure to preview<br>`privacy`: Show publicly, privately, or DM it |
| `/profile` | Display a card with details from a user's profile | `username`: The username of the profile to preview<br>`privacy`: Show publicly, privately, or DM it |
| `/hi` | Say hi to the bot and get a greeting | `topic`: Choose a topic (`who`, `where`, `what`) |
| `/verify` | Prove you own an AI Dungeon account | *(none)* |
| `/dm` | Start a DM with Elara where you can use commands | *(none)* |

## Running Elara
1. Clone the repository
2. Set the environment variables `BOT_PUBLIC_KEY`, `BOT_TOKEN`, and `VERIFICATION_KEY`
3. Run `deno task bot`

I'll set up a Docker image at some point.
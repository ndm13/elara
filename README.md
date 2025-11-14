# Elara
Elara is a Discord bot that makes it easier to interact with AI Dungeon.
Currently very much under development.

## Commands
- `/peek`: Display a card with details from a scenario, adventure, or profile
  - `link`: The link to preview
  - `privacy`: Show publicly, privately, or DM it
- `/scenario`: Display a card with details from a scenario
    - `id`: The short ID of the scenario to preview
    - `privacy`: Show publicly, privately, or DM it
- `/adventure`: Display a card with details from an adventure
    - `id`: The short ID of the adventure to preview
    - `privacy`: Show publicly, privately, or DM it
- `/profile`: Display a card with details from a user's profile
    - `username`: The username of the profile to preview
    - `privacy`: Show publicly, privately, or DM it
- `/dm`: Start a DM with Elara where you can use commands

## Running Elara
1. Clone the repository
2. Set the environment variables `BOT_PUBLIC_KEY` and `BOT_TOKEN`
3. Run `deno task bot`

I'll set up a Docker image at some point.
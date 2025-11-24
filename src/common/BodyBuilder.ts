import {AdvancedAdventureData, AdvancedScenarioData, AdventureData, ScenarioData, UserData} from "./AIDungeonAPI.ts";
import {ActionRow, Button, Container, Embed, Section, Separator, TextDisplay, Thumbnail, User} from "npm:seyfert@3.2.6";
import {InteractionCreateBodyRequest} from "seyfert/lib/common/index.js";
import Stopwatch from "./Stopwatch.ts";
import {MessageFlags, ButtonStyle} from "npm:seyfert@3.2.6/lib/types/index.js";
import { chunk } from "jsr:@std/collections";

function getCover(image: string) {
    const url = new URL(image);
    // Check if the last segment is a UUID
    const split = url.pathname.split("/");
    const last = split[split.length - 1];
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(last.toLowerCase())) {
        return image + '/public';
    }
    return image;
}

function gameCodeMetadata(code: string) {
    const bytes = new TextEncoder().encode(code).byteLength;
    const lines = code.split('\n').length;
    return `${lines} line${lines === 1 ? '' : 's'}, ${bytes < 1024 ? bytes + ` byte${bytes === 1 ? '' : 's'}` : (bytes / 1024).toFixed(2) + ' kb'}`;
}

function textBlockMetadata(text: string) {
    const lines = text.split('\n').length;
    return `**${lines}** line${lines === 1 ? '' : 's'} and **${text.length}** character${text.length === 1 ? '' : 's'} long.`;
}

export default {
    scenarioDetailsPayload: (scenario: ScenarioData, time: Stopwatch, path: string, id: string): InteractionCreateBodyRequest => {
        return {
            embeds: [
                new Embed()
                    .setTitle(scenario.title)
                    .setDescription(scenario.description)
                    .setAuthor({
                        name: "A Scenario by " + scenario.user.profile.title,
                        iconUrl: scenario.user.profile.thumbImageUrl
                    })
                    .setImage(getCover(scenario.image))
                    .setFooter({
                        text: time.elaraMessage
                    })
                    .setFields([
                        {
                            inline: true,
                            name: 'Created',
                            value: new Date(scenario.createdAt).toLocaleString().replace(', ', ' ')
                        },
                        {
                            inline: true,
                            name: 'Edited',
                            value: scenario.editedAt ? new Date(scenario.editedAt).toLocaleString().replace(', ', ' ') : 'No'
                        },
                        {
                            inline: true,
                            name: 'Published',
                            value: scenario.published ? new Date(scenario.publishedAt).toLocaleString().replace(', ', ' ') : 'No'
                        },
                        {
                            inline: true,
                            name: 'Rating',
                            value: scenario.contentRating
                        },
                        {
                            inline: true,
                            name: 'Rating Locked',
                            value: scenario.contentRatingLockedAt ? new Date(scenario.contentRatingLockedAt).toLocaleString().replace(', ', ' ') : 'No'
                        },
                        {
                            inline: true,
                            name: 'Plays',
                            value: scenario.adventuresPlayed
                        },
                        {
                            inline: true,
                            name: 'Votes',
                            value: scenario.voteCount
                        },
                        {
                            inline: true,
                            name: 'Bookmarks',
                            value: scenario.saveCount
                        },
                        {
                            inline: true,
                            name: 'Comments',
                            value: scenario.commentCount
                        }
                    ])
            ],
            components: [
                new ActionRow()
                    .setComponents([
                        new Button()
                            .setLabel('Production')
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://play.aidungeon.com" + path),
                        new Button()
                            .setLabel('Beta')
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://beta.aidungeon.com" + path),
                        new Button()
                            .setLabel('Alpha')
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://alpha.aidungeon.com" + path),
                        new Button()
                            .setLabel(`${scenario.user.profile.title}'s Profile`)
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId('open_profile_' + scenario.user.profile.title),
                        new Button()
                            .setLabel(`More...`)
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('advanced_scenario_' + id)
                    ])
            ]
        };
    },
    adventureDetailsPayload: (adventure: AdventureData, time: Stopwatch, path: string, id: string): InteractionCreateBodyRequest => {
        return {
            embeds: [
                new Embed()
                    .setTitle(adventure.title)
                    .setDescription(adventure.description)
                    .setAuthor({
                        name: "An Adventure by " + adventure.user.profile.title,
                        iconUrl: adventure.user.profile.thumbImageUrl
                    })
                    .setImage(getCover(adventure.image))
                    .setFooter({
                        text: time.elaraMessage
                    })
                    .setFields([
                        {
                            inline: true,
                            name: 'Created',
                            value: new Date(adventure.createdAt).toLocaleString().replace(', ', ' ')
                        },
                        {
                            inline: true,
                            name: 'Edited',
                            value: adventure.editedAt ? new Date(adventure.editedAt).toLocaleString().replace(', ', ' ') : 'No'
                        },
                        {
                            inline: true,
                            name: 'Published',
                            value: adventure.published ? new Date(adventure.publishedAt).toLocaleString().replace(', ', ' ') : 'No'
                        },
                        {
                            inline: true,
                            name: 'Rating',
                            value: adventure.contentRating
                        },
                        {
                            inline: true,
                            name: 'Rating Locked',
                            value: adventure.contentRatingLockedAt ? new Date(adventure.contentRatingLockedAt).toLocaleString().replace(', ', ' ') : 'No'
                        },
                        {
                            inline: true,
                            name: 'Actions',
                            value: adventure.actionCount
                        },
                        {
                            inline: true,
                            name: 'Votes',
                            value: adventure.voteCount
                        },
                        {
                            inline: true,
                            name: 'Bookmarks',
                            value: adventure.saveCount
                        },
                        {
                            inline: true,
                            name: 'Comments',
                            value: adventure.commentCount
                        }
                    ])
            ],
            components: [
                new ActionRow()
                    .setComponents([
                        new Button()
                            .setLabel('Production')
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://play.aidungeon.com" + path),
                        new Button()
                            .setLabel('Beta')
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://beta.aidungeon.com" + path),
                        new Button()
                            .setLabel('Alpha')
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://alpha.aidungeon.com" + path),
                        new Button()
                            .setLabel(`${adventure.user.profile.title}'s Profile`)
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId('open_profile_' + adventure.user.profile.title),
                        new Button()
                            .setLabel(`More...`)
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('advanced_adventure_' + id)
                    ])
            ]
        };
    },
    profileDetailsPayload: (user: UserData, time: Stopwatch, path: string): InteractionCreateBodyRequest => {
        return {
            embeds: [
                new Embed()
                    .setTitle(user.profile.title)
                    .setDescription(user.profile.description)
                    .setThumbnail(user.profile.thumbImageUrl)
                    .setFooter({
                        text: time.elaraMessage
                    })
                    .setFields([
                        {
                            inline: true,
                            name: 'Friends',
                            value: user.friendCount
                        },
                        {
                            inline: true,
                            name: 'Following',
                            value: user.followingCount
                        },
                        {
                            inline: true,
                            name: 'Followers',
                            value: user.followersCount
                        }
                    ])
            ],
            components: [
                new ActionRow()
                    .setComponents([
                        new Button()
                            .setLabel('Production')
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://play.aidungeon.com" + path),
                        new Button()
                            .setLabel('Beta')
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://beta.aidungeon.com" + path),
                        new Button()
                            .setLabel('Alpha')
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://alpha.aidungeon.com" + path)
                    ])
            ]
        };
    },
    accountLinkedPayload: (user: User, profileStub: {title: string, thumbImageUrl: string}):InteractionCreateBodyRequest => {
        const container = new Container().addComponents(
            new TextDisplay().setContent("## 🔗 AI Dungeon × Discord Verified"),
            new Separator(),
            new Section()
                .setComponents(
                    new TextDisplay().setContent('## Discord'),
                    new TextDisplay().setContent(`### <:discord:1439424878632767659> <@${user.id}>`)
                )
                .setAccessory(new Thumbnail().setMedia(user.avatarURL())),
            new Section()
                .setComponents(
                    new TextDisplay().setContent('## AI Dungeon'),
                    new TextDisplay().setContent(`### <:ai_dungeon:1439424456337657896> [@${profileStub.title}](https://play.aidungeon.com/profile/${profileStub.title})`)
                )
                .setAccessory(new Thumbnail().setMedia(profileStub.thumbImageUrl)),
            new Separator(),
            new TextDisplay().setContent(`I confirmed it for you: *they're the same person!* 😮`)
        );
        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2
        }

    },
    advancedScenarioPayload: (data: AdvancedScenarioData, id: string, time: Stopwatch):InteractionCreateBodyRequest => {
        const container = new Container().addComponents(
            new TextDisplay().setContent(`I found more information on the scenario`),
            new TextDisplay().setContent(`## ${data.title}`),
            new Separator()
        );

        if (data.type !== 'multipleChoice') {
            // Handle directly playable scenario
            const hasScripts = !!data.gameCodeOnInput || !!data.gameCodeOnModelContext || !!data.gameCodeOnOutput || !!data.gameCodeSharedLibrary;
            let scriptList = '';
            if (data.gameCodeOnInput)
                scriptList += `\n- **Input** (${gameCodeMetadata(data.gameCodeOnInput)})`;
            if (data.gameCodeOnModelContext)
                scriptList += `\n- **Context** (${gameCodeMetadata(data.gameCodeOnModelContext)})`;
            if (data.gameCodeOnOutput)
                scriptList += `\n- **Output** (${gameCodeMetadata(data.gameCodeOnOutput)})`;
            if (data.gameCodeSharedLibrary)
                scriptList += `\n- **Library** (${gameCodeMetadata(data.gameCodeSharedLibrary)})`;
            const scgenEnhancements = [];
            let scgenList = "";
            if (data.state.storyCardInstructions) {
                scgenEnhancements.push('custom instructions');
                scgenList += `\n- The story card instructions are ${textBlockMetadata(data.state.storyCardInstructions)}`;
            }
            if (data.state.storyCardStoryInformation) {
                scgenEnhancements.push('custom information');
                scgenList += `\n- The story information is ${textBlockMetadata(data.state.storyCardStoryInformation)}`;
            }

            container.addComponents(
                new TextDisplay().setContent('### Story Cards'),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(`This scenario has **${data.storyCardCount}** story card${data.storyCardCount === 1 ? '' : 's'}.`)
                    )
                    .setAccessory(new Button()
                        .setCustomId(`story_cards_scenario_${id}`)
                        .setLabel('Get Story Cards')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(data.storyCardCount === 0)),
                new Separator(),
                new TextDisplay().setContent('### Scripts'),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(`This scenario ${hasScripts ? 'has' : '**does not** have'} scripts.${scriptList}`),)
                    .setAccessory(
                        new Button()
                            .setCustomId(`scripts_${id}`)
                            .setLabel("Get Scripts")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(!hasScripts)),
                new Separator(),
                new TextDisplay().setContent('### Initial State'),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(data.memory ? `The plot essentials are ${textBlockMetadata(data.memory)}` : 'This scenario **does not use** plot essentials.')
                    )
                    .setAccessory(new Button()
                        .setCustomId(`scenario_state_memory_${id}`)
                        .setLabel('Show Plot Essentials')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!data.memory)),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(data.authorsNote ? `The author's note is ${textBlockMetadata(data.authorsNote)}` : "This scenario **does not have** an author's note.")
                    )
                    .setAccessory(new Button()
                        .setCustomId(`scenario_state_authors-note_${id}`)
                        .setLabel("Show Author's Note")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!data.authorsNote)),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(`This scenario ${scgenEnhancements.length > 0 ? `uses **${scgenEnhancements.join(' and ')}** for story card generation` : '**does not use** story card generator enhancements'}.${scgenList}`)
                    )
                    .setAccessory(new Button()
                        .setCustomId(`scenario_state_scgen_${id}`)
                        .setLabel('Show Generator Details')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(scgenEnhancements.length === 0)),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(data.state.instructions?.type === 'scenario' ?
                                `The custom instructions are ${textBlockMetadata(data.state.instructions.scenario)}` :
                                'This scenario **does not have** custom instructions.')
                    )
                    .setAccessory(new Button()
                        .setCustomId(`scenario_state_instructions_${id}`)
                        .setLabel('Show Custom Instructions')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(data.state.instructions?.type !== 'scenario')),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(`The opening prompt is ${textBlockMetadata(data.prompt)}`)
                    )
                    .setAccessory(new Button()
                        .setCustomId(`scenario_state_prompt_${id}`)
                        .setLabel('Show Opening Prompt')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!data.prompt))
            );
        } else {
            // Handle parent scenario
            if (data.prompt)
                container.addComponents(
                    new TextDisplay()
                        .setContent(`### Prompt\n>>> ${data.prompt}`),
                    new Separator()
                );

            const rows = chunk(data.options
                .filter(option => option.parentScenario?.shortId === id)
                .filter(option => option.deletedAt === null)
                .map(option => new Button()
                    .setCustomId(`advanced_scenario_${option.shortId}`)
                    .setLabel(option.title)
                    .setStyle(ButtonStyle.Primary)), 5);
            for (const row of rows) {
                container.addComponents(new ActionRow().setComponents(row));
            }
        }

        container.addComponents(
            new Separator(),
            new TextDisplay()
                .setContent(`-# ${time.elaraMessage}`)
        );

        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2
        }
    },
    advancedAdventurePayload: (data: AdvancedAdventureData, id: string, time: Stopwatch):InteractionCreateBodyRequest => {
        const container = new Container().addComponents(
            new TextDisplay().setContent(`I found more information on the adventure\n## ${data.title}`),
            new Separator()
        );

        if (data.scenario) {
            // Scenario is hidden sometimes
            container.addComponents(
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(`*This adventure was created from the scenario* **${data.scenario.title}**.`)
                    )
                    .setAccessory(new Button()
                        .setCustomId(`open_scenario_${data.scenario.shortId}`)
                        .setLabel('Open Scenario')
                        .setStyle(ButtonStyle.Primary)),
                new Separator()
            )
        }

        container.addComponents(
            new TextDisplay().setContent('### Story Cards'),
            new Section()
                .setComponents(
                    new TextDisplay()
                        .setContent(`This adventure has **${data.storyCardCount}** story card${data.storyCardCount === 1 ? '' : 's'}.`)
                )
                .setAccessory(new Button()
                    .setCustomId(`story_cards_adventure_${id}`)
                    .setLabel('Get Story Cards')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(data.storyCardCount === 0)),
            new Separator(),
            new TextDisplay().setContent('### Current State'),
            new Section()
                .setComponents(
                    new TextDisplay()
                        .setContent(data.memory ? `The plot essentials are ${textBlockMetadata(data.memory)}` : 'This adventure **does not use** plot essentials.')
                )
                .setAccessory(new Button()
                    .setCustomId(`adventure_state_memory_${id}`)
                    .setLabel('Show Plot Essentials')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(!data.memory)),
            new Section()
                .setComponents(
                    new TextDisplay()
                        .setContent(data.authorsNote ? `The author's note is ${textBlockMetadata(data.authorsNote)}` : "This adventure **does not have** an author's note.")
                )
                .setAccessory(new Button()
                    .setCustomId(`adventure_state_authors-note_${id}`)
                    .setLabel("Show Author's Note")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(!data.authorsNote))
        );

        if (data.details) {
            // data.state crashes GraphQL (probably permission denied), but older adventures store it in data.details.
            // If it's present, show it.
            const scgenEnhancements = [];
            let scgenList = "";
            if (data.details.storyCardInstructions) {
                scgenEnhancements.push('custom instructions');
                scgenList += `\n- The story card instructions are ${textBlockMetadata(data.state.storyCardInstructions)}`;
            }
            if (data.details.storyCardStoryInformation) {
                scgenEnhancements.push('custom information');
                scgenList += `\n- The story information is ${textBlockMetadata(data.state.storyCardStoryInformation)}`;
            }

            container.addComponents(
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(`This adventure ${scgenEnhancements.length > 0 ? `uses **${scgenEnhancements.join(' and ')}** for story card generation` : '**does not use** story card generator enhancements'}.${scgenList}`)
                    )
                    .setAccessory(new Button()
                        .setCustomId(`adventure_state_scgen_${id}`)
                        .setLabel('Show Generator Details')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(scgenEnhancements.length === 0)),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(data.details.instructions?.type === 'custom' ?
                                `The custom instructions are ${textBlockMetadata(data.details.instructions.custom)}` :
                                'This adventure **does not have** custom instructions.')
                    )
                    .setAccessory(new Button()
                        .setCustomId(`adventure_state_instructions_${id}`)
                        .setLabel('Show Custom Instructions')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(data.details.instructions?.type !== 'custom')),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(data.details.storySummary ?
                                `The current story summary is ${textBlockMetadata(data.details.storySummary)}` :
                                'This adventure **does not use** story summary.')
                    )
                    .setAccessory(new Button()
                        .setCustomId(`adventure_state_summary_${id}`)
                        .setLabel('Show Story Summary')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!data.details.storySummary))
            );
        }

        if (data.gameState) {
            // Sometimes data.gameState doesn't populate
            container.addComponents(
                new Separator(),
                new TextDisplay().setContent('### Scripting'),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(data.gameState ? `The game state is ${gameCodeMetadata(JSON.stringify(data.gameState))}.` : 'This adventure **does not have** an active game state.')
                    )
                    .setAccessory(new Button()
                        .setCustomId(`adventure_state_game-state_${id}`)
                        .setLabel('Show Game State')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!data.gameState)),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(data.message ? `The active message is ${textBlockMetadata(data.message)}` : "This adventure **does not have** an active message.")
                    )
                    .setAccessory(new Button()
                        .setCustomId(`adventure_state_message_${id}`)
                        .setLabel("Show Message")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!data.message))
            );
        }

        container.addComponents(
            new Separator(),
            new TextDisplay()
                .setContent(`### Download Adventure Text\nThis adventure contains ${data.actionCount} actions.`),
            new ActionRow().setComponents(
                new Button()
                    .setCustomId(`read_md_${data.actionCount}_${id}`)
                    .setLabel('Markdown')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(data.actionCount === 0),
                new Button()
                    .setCustomId(`read_plain_${data.actionCount}_${id}`)
                    .setLabel('Plain Text')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(data.actionCount === 0),
                new Button()
                    .setCustomId(`read_html_${data.actionCount}_${id}`)
                    .setLabel('HTML')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(data.actionCount === 0)
            )
        );

        container.addComponents(
            new Separator(),
            new TextDisplay()
                .setContent(`-# ${time.elaraMessage}`)
        );

        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2
        }
    }
};
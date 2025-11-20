import {AdvancedScenarioData, AdventureData, ScenarioData, UserData} from "./AIDungeonAPI.ts";
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

function largeTextMetadata(code: string) {
    const bytes = new TextEncoder().encode(code).byteLength;
    const lines = code.split('\n').length;
    return `${lines} line${lines === 1 ? '' : 's'}, ${bytes < 1024 ? bytes + ` byte${bytes === 1 ? '' : 's'}` : (bytes / 1024).toFixed(2) + ' kb'}`;
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
                    .setColor('#FEA0FF')
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
                    .setColor('#FEA0FF')
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
                    .setColor('#FEA0FF')
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
    advancedScenarioPayload: (data: AdvancedScenarioData, id: string):InteractionCreateBodyRequest => {
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
                scriptList += `\n- **Input** (${largeTextMetadata(data.gameCodeOnInput)})`;
            if (data.gameCodeOnModelContext)
                scriptList += `\n- **Context** (${largeTextMetadata(data.gameCodeOnModelContext)})`;
            if (data.gameCodeOnOutput)
                scriptList += `\n- **Output** (${largeTextMetadata(data.gameCodeOnOutput)})`;
            if (data.gameCodeSharedLibrary)
                scriptList += `\n- **Library** (${largeTextMetadata(data.gameCodeSharedLibrary)})`;
            const scgenEnhancements = [];
            if (data.state.storyCardInstructions)
                scgenEnhancements.push('custom instructions');
            if (data.state.storyCardStoryInformation)
                scgenEnhancements.push('custom information');
            const promptLines = data.prompt.split('\n').length;

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
                            .setContent(`This scenario ${scgenEnhancements.length > 0 ? `uses **${scgenEnhancements.join(' and ')}** for story card generation.` : '**does not use** story card generator enhancements'}.`)
                    )
                    .setAccessory(new Button()
                        .setCustomId(`scenario_state_scgen_${id}`)
                        .setLabel('Show Generator Details')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(scgenEnhancements.length === 0)),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(`This scenario ${data.state.instructions?.type === 'scenario' ? 'has' : '**does not have**'} custom instructions.`)
                    )
                    .setAccessory(new Button()
                        .setCustomId(`scenario_state_instructions_${id}`)
                        .setLabel('Show Custom Instructions')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(data.state.instructions?.type !== 'scenario')),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(`This scenario ${data.memory ? 'uses' : '**does not use**'} plot essentials.`)
                    )
                    .setAccessory(new Button()
                        .setCustomId(`scenario_state_memory_${id}`)
                        .setLabel('Show Plot Essentials')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!data.memory)),
                new Section()
                    .setComponents(
                        new TextDisplay()
                            .setContent(`The opening prompt is **${promptLines}** line${promptLines === 1 ? '' : 's'} and is **${data.prompt.length}** character${data.prompt.length === 1 ? '' : 's'} long.`)
                    )
                    .setAccessory(new Button()
                        .setCustomId(`scenario_state_prompt_${id}`)
                        .setLabel('Show Opening Prompt')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!data.prompt))
            );
        } else {
            // Handle parent scenario
            container.addComponents(
                new TextDisplay()
                    .setContent(`### Prompt\n>>> ${data.prompt}`),
                new Separator()
            )
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
        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2
        }
    },
    advancedAdventurePayload: (id: string, type: string):InteractionCreateBodyRequest => {
        const container = new Container().addComponents(
            new TextDisplay().setContent(`## Details for ${type} \`${id}\``),
            new Separator(),
            new TextDisplay().setContent('### Story Cards'),
            new Section()
                .setComponents(
                    new TextDisplay().setContent(`This ${type} has some number of story cards. I'm too lazy to count them.`)
                )
                .setAccessory(new Button()
                    .setCustomId(`story_cards_${type}_${id}`)
                    .setLabel('Get Story Cards')
                    .setStyle(ButtonStyle.Primary))
        );
        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2
        }
    }
};
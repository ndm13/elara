import {AdventureData, ScenarioData, UserData} from "./AIDungeonAPI.ts";
import {ActionRow, Button, Embed} from "seyfert";
import {InteractionCreateBodyRequest} from "seyfert/lib/common/index.js";
import {ButtonStyle, MessageFlags} from 'seyfert/lib/types/index.js';
import Stopwatch from "./Stopwatch.ts";
import {
    Container,
    Section, Separator,
    TextDisplay,
    Thumbnail,
    User
} from "npm:seyfert@3.2.6";

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

export default {
    scenarioDetailsPayload: (scenario: ScenarioData, time: Stopwatch, path: string, id: string): InteractionCreateBodyRequest => {
        console.log('BodyBuilder', id);
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
                            .setLabel(`Get Story Cards`)
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('story_cards_scenario_' + id)
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
                            .setLabel(`Get Story Cards`)
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('story_cards_adventure_' + id)
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

    }
};
import {AdventureData, ScenarioData, UserData} from "./AIDungeonAPI.ts";
import {ActionRow, Button, Embed} from "seyfert";
import {InteractionCreateBodyRequest} from "seyfert/lib/common/index.js";
import {ButtonStyle} from 'seyfert/lib/types/index.js';
import Stopwatch from "./Stopwatch.ts";

export default {
    scenarioDetailsPayload: (scenario: ScenarioData, time: Stopwatch, path: string): InteractionCreateBodyRequest => {
        return {
            embeds: [
                new Embed()
                    .setTitle(scenario.title)
                    .setDescription(scenario.description)
                    .setAuthor({
                        name: "A Scenario by " + scenario.user.profile.title,
                        iconUrl: scenario.user.profile.thumbImageUrl
                    })
                    .setImage(scenario.image + '/public')
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
                            .setCustomId('open_profile_' + scenario.user.profile.title)
                    ])
            ]
        };
    },
    adventureDetailsPayload: (adventure: AdventureData, time: Stopwatch, path: string): InteractionCreateBodyRequest => {
        return {
            embeds: [
                new Embed()
                    .setTitle(adventure.title)
                    .setDescription(adventure.description)
                    .setAuthor({
                        name: "An Adventure by " + adventure.user.profile.title,
                        iconUrl: adventure.user.profile.thumbImageUrl
                    })
                    .setImage(adventure.image + '/public')
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
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('open_profile_' + adventure.user.profile.title)
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
    }
};
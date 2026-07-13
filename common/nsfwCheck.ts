import {ContentRating} from "./AIDungeonAPI.ts";
import {ChannelType} from "seyfert/lib/types/index.js";
import {CommandContext} from "npm:seyfert";

export const nsfwCheck = (ctx: CommandContext, contentWithRating: {contentRating: ContentRating}) => {
    return (!ctx.options.privacy || ctx.options.privacy === 'public') &&
        ['Mature', 'Unrated'].includes(contentWithRating.contentRating) && (
            ![ChannelType.DM, ChannelType.GroupDM].includes(ctx.interaction.channel.type) &&
            !ctx.interaction.channel.nsfw
        );

}
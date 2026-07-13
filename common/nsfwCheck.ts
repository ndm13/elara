import {ContentRating} from "./AIDungeonAPI.ts";
import {ChannelType} from "seyfert/lib/types/index.js";
import {CommandContext} from "seyfert";

export const nsfwCheck = (ctx: CommandContext<any>, contentWithRating: {contentRating: ContentRating}) => {
    return (!(ctx.options as any).privacy || (ctx.options as any).privacy === 'public') &&
        ['Mature', 'Unrated'].includes(contentWithRating.contentRating) && (
            ![ChannelType.DM, ChannelType.GroupDM].includes(ctx.interaction.channel.type) &&
            !(ctx.interaction.channel as any).nsfw
        );

}
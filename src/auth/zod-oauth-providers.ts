import z from "zod";

export const googleData = z.object({
    sub: z.string().min(1),
    picture: z.string().url(),
    name: z.string(),
});
/**
 * Discord don't give a built avatar url, the url have to be build from this avatar parameter, see discord documentation for more information
 */
export const discordData = z.object({
    id: z.string().min(1),
    username: z.string().min(1),
    avatar: z.string().min(1),
});
export const myAnimeListData = z.object({
    id: z.number(),
    name: z.string().min(1),
    picture: z.string().min(1),
});

export const redditData = z.object({
    id: z.string(),
    name: z.string().min(1),
    icon_img: z.string().optional(),
});

export const robloxData = z.object({
    sub: z.string(),
    name: z.string().min(1),
    picture: z.string().nullable(),
});

export const yahooData = z.object({
    sub: z.string(),
    name: z.string(),
    picture: z.string(),
});

export const spotifyData = z.object({
    id: z.string(),
    display_name: z.string().nullable(),
    images: z.array(
        z.object({
            url: z.string().url(),
            height: z.number().nullable(),
            width: z.number().nullable(),
        })
    ),
});

export const twitchData = z.object({
    data: z.array(
        z.object({
            display_name: z.string(),
            profile_image_url: z.string().url(),
        })
    ),
});
export const twitchTokenData = z.object({
    sub: z.string(),
    aud: z.string(),
});

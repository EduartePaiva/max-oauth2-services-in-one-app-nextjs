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
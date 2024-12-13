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

/*
{
    verified: true,
    id: '5qt0h5bj',
    oauth_client_id: 'ZtvuxQO7HT2J3aRFdbQ1eA',
    has_verified_email: true,
    icon_img: 'https://styles.redditmedia.com/t5_2ntfoz/styles/profileIcon_ddccc2uw2n6e1.jpg?width=256&amp;height=256&amp;crop=256:256,smart&amp;s=61b3679a252ee19c2d9fdb9ec022a3b524c55fbb',
    name: 'EduartePaiva',
    created: 1589425457,
    created_utc: 1589425457,
  }
    */

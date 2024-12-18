import {
    Discord,
    GitHub,
    Google,
    MyAnimeList,
    Reddit,
    Roblox,
    Spotify,
    Twitch,
    Yahoo,
    Zoom,
} from "arctic";

import { env } from "@/env/server";

export const google = new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
);

export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, null);

export const discord = new Discord(
    env.DISCORD_CLIENT_ID,
    env.DISCORD_CLIENT_SECRET,
    env.DISCORD_REDIRECT_URI
);

export const myAnimeList = new MyAnimeList(
    env.MYANIMELIST_CLIENT_ID,
    env.MYANIMELIST_CLIENT_SECRET,
    { redirectURI: env.MYANIMELIST_REDIRECT_URI }
);

export const reddit = new Reddit(
    env.REDDIT_CLIENT_ID,
    env.REDDIT_CLIENT_SECRET,
    env.REDDIT_REDIRECT_URI
);

export const roblox = new Roblox(
    env.ROBLOX_CLIENT_ID,
    env.ROBLOX_CLIENT_SECRET,
    env.ROBLOX_REDIRECT_URI
);

export const spotify = new Spotify(
    env.SPOTIFY_CLIENT_ID,
    env.SPOTIFY_CLIENT_SECRET,
    env.SPOTIFY_REDIRECT_URI
);

export const twitch = new Twitch(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET,
    env.TWITCH_REDIRECT_URI
);

export const yahoo = new Yahoo(
    env.YAHOO_CLIENT_ID,
    env.YAHOO_CLIENT_SECRET,
    env.YAHOO_REDIRECT_URI
);

export const zoom = new Zoom(env.ZOOM_CLIENT_ID, env.ZOOM_CLIENT_SECRET, env.ZOOM_REDIRECT_URI);

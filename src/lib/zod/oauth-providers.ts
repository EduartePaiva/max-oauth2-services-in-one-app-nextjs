import z from "zod";

export const googleData = z.object({
    sub: z.string().min(1),
    picture: z.string().url(),
    name: z.string(),
});

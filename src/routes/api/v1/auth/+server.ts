import { type RequestHandler } from '@sveltejs/kit';
import { options, getRandomEmoji, generateUUID, getUUIDs } from '$lib';


export const POST: RequestHandler = async (e) => {
    // We're checking the current auth emoji
    const emoji = (await e.request.json() as { selectedEmoji?: string }).selectedEmoji || "";
    const authEmoji = await e.platform?.env.contactpagekv.get("auth-emoji");

    const matches = emoji === authEmoji;

    let newEmoji = getRandomEmoji();
    while (newEmoji === authEmoji) {
        newEmoji = getRandomEmoji();
    }
    await e.platform?.env.contactpagekv.put("auth-emoji", newEmoji);

    const uuid = generateUUID();

    if (matches) {
        const uuids = await getUUIDs(e);
        uuids.push(uuid);
        await e.platform?.env.contactpagekv.put("uuids", JSON.stringify(uuids));
    }

    return new Response(JSON.stringify({ matches, uuid }), { ...options, status: matches ? 200 : 400 });
};

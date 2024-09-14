import { type RequestHandler } from '@sveltejs/kit';
import { options, getRandomEmoji, generateUUID, getUUIDs, addLogin } from '$lib';


export const POST: RequestHandler = async (e) => {
    const contactPage = e.platform?.env.contactpagekv;
    if (!contactPage) {
        return new Response(JSON.stringify({ error: "No contactpagekv" }), { ...options, status: 500 });
    }

    const ip = e.request.headers.get("cf-connecting-ip") || "";

    // We're checking the current auth emoji
    const emoji = (await e.request.json() as { selectedEmoji?: string }).selectedEmoji || "";
    const authEmoji = await contactPage.get("auth-emoji");

    const matches = emoji === authEmoji;

    let newEmoji = getRandomEmoji();
    while (newEmoji === authEmoji) {
        newEmoji = getRandomEmoji();
    }
    await contactPage.put("auth-emoji", newEmoji);

    const uuid = generateUUID();

    if (matches) {
        const uuids = await getUUIDs(e);
        uuids.push(uuid);
        await contactPage.put("uuids", JSON.stringify(uuids));
        await addLogin(ip, contactPage, true, "card_download");
        return new Response(JSON.stringify({ matches, uuid }), { ...options, status: 200 });
    } else {
        await addLogin(ip, contactPage, false, "card_download");
        return new Response(JSON.stringify({ matches }), { ...options, status: 400 });
    }
};

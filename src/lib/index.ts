import type { RequestEvent } from "@sveltejs/kit";

export const emojiList = [
    '😀', '😂', '😅', '😊', '😍', '😎', '😜', '🤔', '😢', '😭',
    '😡', '🤯', '🤗', '😷', '🤒', '🤑', '🤓', '🤠', '🥳', '🥺',
    '🤩', '🤪', '😇', '🤤', '😴', '😵', '🤖', '👻', '👽', '💀'
];

export const options = {
    headers: {
        'Content-Type': 'application/json',
    },
};

export const generateUUID = (): string => {
    let d = new Date().getTime(); // Timestamp
    let d2 = (typeof performance !== 'undefined' && performance.now && (performance.now() * 1000)) || 0; // Performance now to ensure randomness

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16; // Random number between 0 and 16
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const getRandomEmoji = (): string => {

    const randomIndex = Math.floor(Math.random() * emojiList.length);
    return emojiList[randomIndex];
};

export const getUUIDs = async (e: RequestEvent): Promise<string[]> => {
    return await e.platform?.env.contactpagekv.get("uuids").then((uuids) => {
        if (uuids)
            return JSON.parse(uuids);
        else
            return [];
    });
};

export const removeUUID = async (e: RequestEvent, uuid: string): Promise<void> => {
    const uuids = await getUUIDs(e);
    const newUUIDs = uuids.filter((id: string) => id !== uuid);
    await e.platform?.env.contactpagekv.put("uuids", JSON.stringify(newUUIDs));
}

interface LoginIP {
    time: number;
    success: boolean;
    count: string;
    type: "card_download" | "admin"
};

export const addLogin = async (ip: string, kv: KVNamespace | undefined, success: boolean, type: LoginIP["type"]) => {
    if (kv) {
        const loginIPs: { [ip: string]: LoginIP } = JSON.parse(await kv.get("login-ips") || "[]");

        const time = Date.now();
        const count = loginIPs[ip] ? `${parseInt(loginIPs[ip].count) + 1}` : "1";

        await kv.put("login-ips", JSON.stringify({ ...loginIPs, [ip]: { time, success, count, type } }));
        return loginIPs;
    }
    return [];
}

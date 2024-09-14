import { type RequestHandler } from "@sveltejs/kit";
import { options, getRandomEmoji } from "$lib";

export const GET: RequestHandler = async (e) => {
    const contactPage = e.platform?.env.contactpagekv;
    if (!contactPage) {
        return new Response(JSON.stringify({ error: "No contactpagekv" }), { ...options, status: 500 });
    }

    let authEmoji = await contactPage.get("auth-emoji");
    if (!authEmoji) {
        authEmoji = getRandomEmoji();
        await contactPage.put("auth-emoji", authEmoji);
    }

    // Get contactpagekv["cooldowns"] which is an object mapping IPs to timestamps
    const cooldowns: { [key: string]: number } = await contactPage.get("cooldowns").then((cooldowns) => {
        if (cooldowns) {
            return JSON.parse(cooldowns);
        } else {
            return {};
        }
    });

    const host = e.request.headers.get("host")?.split(":")[0] || "";

    if (!["localhost", "127.0.0.1"].includes(host)) {
        // Get the current IP address
        let ip = e.request.headers.get("cf-connecting-ip");
        if (!ip) {
            return new Response(JSON.stringify({ error: "No IP address provided" }), { ...options, status: 400 });
        }

        // Check if the IP is on cooldown
        if (cooldowns[ip] && cooldowns[ip] > Date.now()) {
            return new Response(JSON.stringify({ error: "On cooldown" }), { ...options, status: 429 });
        }

        // Set the cooldown for the IP for 5m
        cooldowns[ip] = Date.now() + 300000;
        await contactPage.put("cooldowns", JSON.stringify(cooldowns));
    }

    const out: string[] = [authEmoji];
    for (let i = 0; i < 5; i++) {
        let newEmoji = getRandomEmoji();
        while (newEmoji === authEmoji || out.includes(newEmoji)) {
            newEmoji = getRandomEmoji();
        }
        out.push(newEmoji);
    }

    out.sort(() => Math.random() - 0.5);

    return new Response(JSON.stringify(out), options);
};

import { addLogin } from "$lib";

export const load = async (e) => {
    const kv = e.platform?.env.contactpagekv;
    const host = e.request.headers.get("host")?.split(":")[0] || "";

    let auth_token = e.cookies.get("auth_token");
    const kvtoken = await kv?.get("auth-token");

    if (auth_token === kvtoken) {
        return {
            status: 200,
            currentEmoji: await e.platform?.env.contactpagekv.get("auth-emoji"),
            loginIPs: await addLogin(e.request.headers.get("cf-connecting-ip") || "", kv, true, "admin"),
            auth_token
        }
    } else {
        if (["localhost", "127.0.0.1"].includes(host) && auth_token) {
            return {
                status: 200,
                currentEmoji: "",
                auth_token
            };
        } else {
            await addLogin(e.request.headers.get("cf-connecting-ip") || "", kv, false, "admin");
            return {
                status: 401,
                currentEmoji: "",
                auth_token
            };
        }
    }

};

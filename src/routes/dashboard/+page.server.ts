export const load = async (e) => {
    const host = e.request.headers.get("host")?.split(":")[0] || "";

    let auth_token = e.cookies.get("auth_token");
    let kvtoken = await e.platform?.env.contactpagekv.get("auth-token");

    if (auth_token === kvtoken) {
        return {
            status: 200,
            currentEmoji: await e.platform?.env.contactpagekv.get("auth-emoji"),
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
            return {
                status: 401,
                currentEmoji: "",
                auth_token
            };
        }
    }
};

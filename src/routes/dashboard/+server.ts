import { json, redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (e) => {
    const token = await e.platform?.env.contactpagekv.get("auth-token");
    const parsed = await e.request.json() as { auth_token: string };
    const host = e.request.headers.get("host")?.split(":")[0] || "";

    if ((parsed.auth_token === token) || ["localhost", "127.0.0.1"].includes(host)) {
        return json({
            currentEmoji: await e.platform?.env.contactpagekv.get("auth-emoji")
        }, {
            status: 200
        });
    } else {
        return redirect(302, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }
};

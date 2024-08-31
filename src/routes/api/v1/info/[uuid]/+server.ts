import { type RequestHandler } from '@sveltejs/kit';
import { options, getUUIDs } from '$lib';


export const GET: RequestHandler = async (e) => {
    // We're checking if the current uuid is in contactpagekv["uuids"]
    const uuid = e.params.uuid;
    const uuids = await getUUIDs(e);

    if (uuids.includes(uuid || "")) {
        return new Response(import.meta.env.VITE_JOSH_INFO, options);
    } else {
        return new Response(JSON.stringify({ error: "No uuid provided" }), { ...options, status: 400 });
    }
};

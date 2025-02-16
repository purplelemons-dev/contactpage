import { type RequestHandler } from "@sveltejs/kit";
import { getUUIDs, options, removeUUID } from "$lib";
import { JOSH_INFO } from "$env/static/private";

export const GET: RequestHandler = async (e) => {
    // We're checking if the current uuid is in contactpagekv["uuids"]
    const uuid = e.params.uuid || "";
    if (!uuid) {
        return new Response(JSON.stringify({ error: "No UUID provided" }), {
            ...options,
            status: 400,
        });
    }
    const uuids = await getUUIDs(e);
    console.log(uuids);

    if (uuids.includes(uuid)) {
        removeUUID(e, uuid);
        return new Response(JOSH_INFO, options);
    } else {
        return new Response(JSON.stringify({ error: "Invalid UUID" }), {
            ...options,
            status: 401,
        });
    }
};

export async function onRequestGet(context) {
    const { env } = context;
    try {
        // Read from KV
        // Note: User must create a KV Namespace and bind it as 'SITE_CONTENT'
        const value = await env.SITE_CONTENT.get("config", { type: "json" });

        // Default content if KV is empty (First run)
        const defaults = {
            hero_title: "Masa Depan<br><span class=\"gradient-text\">Kreativitas Digital</span>",
            hero_desc: "Kami sedang membangun sesuatu yang luar biasa. Bagian dari perjalanan baru yang menggabungkan teknologi dan seni.",
            footer_text: "© 2026 Sebagian Inc. Dibuat dengan ♥ di Indonesia."
        };

        return new Response(JSON.stringify(value || defaults), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        // Return defaults if KV is not bound (e.g., local dev without setup)
        return new Response(JSON.stringify({
            hero_title: "Masa Depan<br><span class=\"gradient-text\">Kreativitas Digital</span>",
            hero_desc: "Kami sedang membangun sesuatu yang luar biasa. Bagian dari perjalanan baru yang menggabungkan teknologi dan seni.",
            footer_text: "© 2026 Sebagian Inc. Dibuat dengan ♥ di Indonesia."
        }), { headers: { "Content-Type": "application/json" } });
    }
}

export async function onRequestPut(context) {
    const { request, env } = context;

    // Basic Auth Check via Cookie
    const cookie = request.headers.get("Cookie");
    if (!cookie || !cookie.includes("is_admin=true")) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();

        // Save to KV
        await env.SITE_CONTENT.put("config", JSON.stringify(body));

        return new Response(JSON.stringify({ success: true, data: body }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

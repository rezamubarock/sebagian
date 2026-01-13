export async function onRequestGet(context) {
    const { env } = context;
    try {
        // Read from KV
        // Note: User must create a KV Namespace and bind it as 'SITE_CONTENT'
        const value = await env.SITE_CONTENT.get("config", { type: "json" });

        // Default content if KV is empty (First run or after reset)
        const defaults = {
            global: {
                hero_title: "Masa Depan<br><span class=\"gradient-text\">Kreativitas Digital</span>",
                hero_desc: "Kami sedang membangun sesuatu yang luar biasa.",
                footer_text: "© 2026 Sebagian Inc. Dibuat dengan ♥ di Indonesia.",
                email: "hello@sebagian.com",
                phone: "+62 812 3456 7890",
                address: "Jakarta, Indonesia"
            },
            services: [
                { id: 1, icon: "fas fa-layer-group", title: "UI/UX Design", desc: "Desain antarmuka yang memukau dan pengalaman pengguna yang intuitif." },
                { id: 2, icon: "fas fa-code", title: "Web Development", desc: "Website cepat, aman, dan responsive." },
                { id: 3, icon: "fas fa-mobile-alt", title: "Mobile Apps", desc: "Aplikasi Android dan iOS yang powerful." }
            ],
            team: [
                { id: 1, name: "Reza Mubarok", role: "Founder & Lead Dev", image: "" },
                { id: 2, name: "Sarah Design", role: "Lead Designer", image: "" },
                { id: 3, name: "Budi Logic", role: "Backend Engineer", image: "" }
            ]
        };

        return new Response(JSON.stringify(value || defaults), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store, max-age=0"
            }
        });
    } catch (err) {
        // Return defaults if KV is not bound (e.g., local dev without setup)
        const fallback = {
            global: {
                hero_title: "Masa Depan<br><span class=\"gradient-text\">Kreativitas Digital</span>",
                hero_desc: "System Offline / Local Dev Mode",
                footer_text: "© 2026 Sebagian Inc.",
                email: "admin@localhost",
                phone: "000",
                address: "Localhost"
            },
            services: [],
            team: []
        };

        return new Response(JSON.stringify(fallback), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store"
            }
        });
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

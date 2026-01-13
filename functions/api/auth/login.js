export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const body = await request.json();

        // Check against Environment Variable set in Cloudflare Dashboard
        // Fallback to "admin123" for local dev if not set (optional, strictly for demo)
        const CORRECT_PASSWORD = env.ADMIN_PASSWORD || "admin123";

        if (body.password === CORRECT_PASSWORD) {
            // Create a simple session token (In production use JWT or signed cookies)
            // For this demo, we'll just set a cookie "is_admin=true"

            const headers = new Headers();
            headers.set("Set-Cookie", "is_admin=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400"); // 1 day
            headers.set("Content-Type", "application/json");

            return new Response(JSON.stringify({ success: true }), { headers });
        } else {
            return new Response(JSON.stringify({ success: false, message: "Password salah" }), { status: 401 });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

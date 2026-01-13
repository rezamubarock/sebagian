export async function onRequestPost({ request }) {
    try {
        const data = await request.json();

        // In a real application, you would validate the data and send an email using an API like SendGrid, Mailgun, or Resend.
        // Example:
        // await sendEmail({ to: "admin@sebagian.com", subject: "New Contact", text: data.message });

        console.log("Received contact form submission:", data);

        return new Response(JSON.stringify({
            success: true,
            message: "Pesan berhasil diterima!",
            receivedData: data
        }), {
            headers: {
                "content-type": "application/json",
            },
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 400,
            headers: {
                "content-type": "application/json",
            },
        });
    }
}

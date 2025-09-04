// controllers/webhooks.js
import { Webhook } from "svix";
import User from "../modals/User.js";
import 'dotenv/config';

export const clerkWebhooks = async (req, res) => {
    console.log("🚀 Webhook endpoint hit");

    try {
        const payload = req.body.toString();

        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        try {
            webhook.verify(payload, headers);
            console.log("✅ Webhook signature verified");
        } catch (err) {
            console.error("❌ Signature verification failed:", err);
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        const { data, type } = JSON.parse(payload);
        console.log("📩 Webhook Event Received:", type);
        console.log("📦 Payload Data:", JSON.stringify(data, null, 2));

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || '',
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    image: data.image_url || '',
                    resume: ''
                };

                try {
                    await User.create(userData);
                    console.log("✅ User created:", userData.email);
                } catch (err) {
                    console.error("❌ Error creating user:", err);
                    return res.status(500).json({ success: false, message: "User creation failed" });
                }

                return res.status(200).json({ success: true });
            }

            case "user.updated": {
                const updatedData = {
                    email: data.email_addresses?.[0]?.email_address || '',
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    image: data.image_url || ''
                };

                try {
                    await User.findByIdAndUpdate(data.id, updatedData);
                    console.log("✅ User updated:", updatedData.email);
                } catch (err) {
                    console.error("❌ Error updating user:", err);
                    return res.status(500).json({ success: false, message: "User update failed" });
                }

                return res.status(200).json({ success: true });
            }

            case "user.deleted": {
                try {
                    await User.findByIdAndDelete(data.id);
                    console.log("✅ User deleted:", data.id);
                } catch (err) {
                    console.error("❌ Error deleting user:", err);
                    return res.status(500).json({ success: false, message: "User deletion failed" });
                }

                return res.status(200).json({ success: true });
            }

            default:
                console.warn("⚠️ Unhandled webhook type:", type);
                return res.status(400).json({ success: false, message: "Unhandled event type" });
        }
    } catch (error) {
        console.error("❌ Webhook processing failed:", error);
        return res.status(500).json({ success: false, message: "Webhook processing failed" });
    }
};

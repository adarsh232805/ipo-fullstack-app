/**
 * Push notification utility
 * (DEV MODE – replace with Firebase / OneSignal later)
 */
export async function sendPush(token, payload) {
  try {
    console.log("🔔 [DEV PUSH]");
    console.log("Token:", token);
    console.log("Payload:", payload);
  } catch (err) {
    console.error("❌ Push notification failed:", err.message);
  }
}

export const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
export const whatsappNumber = (process.env.WHATSAPP_NUMBER || "").replace(/\D/g, "");

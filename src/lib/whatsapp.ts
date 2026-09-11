import { whatsappNumber } from "@/lib/env";
export function generateWhatsAppLink(message: string) {
  if (!whatsappNumber) return "#";
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

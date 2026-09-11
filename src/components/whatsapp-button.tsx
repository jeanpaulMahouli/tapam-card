import { generateWhatsAppLink } from "@/lib/whatsapp";
export function WhatsAppButton({ message, children = "Commander sur WhatsApp" }: { message: string; children?: React.ReactNode }) { return <a className="btn btn-gold" href={generateWhatsAppLink(message)} target="_blank" rel="noreferrer">{children}</a>; }

export const WHATSAPP_NUMBER = "6285180642043";

/** wa.me link that opens a chat with the admin, prefilled with `text`. */
export const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

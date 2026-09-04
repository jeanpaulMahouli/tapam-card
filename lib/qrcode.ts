import QRCode from "qrcode";

export async function generateQRCode(
  profileSlug: string,
  format: "data_url" | "png_buffer" = "data_url"
): Promise<string | Buffer> {
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${profileSlug}`;

  try {
    if (format === "data_url") {
      // Retourne une data URL pour affichage direct en <img>
      return await QRCode.toDataURL(profileUrl, {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.95,
        margin: 1,
        width: 300,
      });
    } else {
      // Retourne un buffer PNG pour téléchargement
      return await QRCode.toBuffer(profileUrl, {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.95,
        margin: 1,
        width: 300,
      });
    }
  } catch (error) {
    console.error("[QRCode] Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

export function getProfileUrl(profileSlug: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/${profileSlug}`;
}

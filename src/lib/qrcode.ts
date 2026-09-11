import QRCode from "qrcode";
export const generateQrDataUrl = (url: string) => QRCode.toDataURL(url, { width: 640, margin: 2, errorCorrectionLevel: "M" });

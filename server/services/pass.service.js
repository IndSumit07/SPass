// services/passService.js
import QRCode from "qrcode";
import { createCanvas, loadImage } from "canvas";

export class PassService {
  // Generate Unique Pass ID
  static generatePassId(eventId, userId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `PASS_${eventId.slice(-4)}_${userId.slice(
      -4
    )}_${timestamp}_${random}`.toUpperCase();
  }

  // Generate QR Code Data
  static async generateQRCodeData(passId, eventId, userId) {
    const qrData = JSON.stringify({
      passId: passId,
      eventId: eventId,
      userId: userId,
      timestamp: Date.now(),
    });

    const qrCodeImage = await QRCode.toDataURL(qrData);
    return qrCodeImage;
  }

  // Create Pass Image (Digital Pass)
  static async createPassImage(event, user, pass) {
    const canvas = createCanvas(400, 600);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#0e0e0e";
    ctx.fillRect(0, 0, 400, 600);

    // Event Banner
    if (event.coverImage) {
      try {
        const banner = await loadImage(event.coverImage);
        ctx.drawImage(banner, 0, 0, 400, 150);
      } catch (error) {
        console.log("Error loading cover image:", error);
      }
    }

    // Gradient Header
    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, event.passTemplate?.primaryColor || "#8B5CF6");
    gradient.addColorStop(1, event.passTemplate?.secondaryColor || "#EC4899");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 150, 400, 80);

    // Event Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(event.eventName, 200, 180);

    // Organization
    ctx.font = "14px Arial";
    ctx.fillText(event.organisationName, 200, 200);

    // User Info Section
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(20, 250, 360, 200);

    // User Details
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Attendee: ${user.fullname}`, 40, 280);
    ctx.fillText(`Email: ${user.email}`, 40, 305);
    ctx.fillText(`Pass ID: ${pass.passId}`, 40, 330);
    ctx.fillText(
      `Date: ${new Date(event.startDate).toLocaleDateString()}`,
      40,
      365
    );
    ctx.fillText(`Venue: ${event.venue}`, 40, 390);

    if (pass.seatNumber) {
      ctx.fillText(`Seat: ${pass.seatNumber}`, 40, 415);
    }

    // QR Code
    if (event.passTemplate?.showQRCode !== false && pass.qrCodeData) {
      try {
        const qrCode = await loadImage(pass.qrCodeData);
        ctx.drawImage(qrCode, 140, 450, 120, 120);
      } catch (error) {
        console.log("Error loading QR code:", error);
      }
    }

    return canvas.toDataURL();
  }
}

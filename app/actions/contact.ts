"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const to = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  if (!to) return { status: "error", message: "Contact email is not configured." };
  if (!process.env.RESEND_API_KEY) return { status: "error", message: "Email service is not configured." };

  // Honeypot: bots fill this, real users never see it
  const honeypot = formData.get("website") as string;
  if (honeypot?.trim()) {
    return { status: "success" }; // silently discard
  }

  const topic = formData.get("topic") as string;
  const name = formData.get("name") as string;
  const senderEmail = formData.get("senderEmail") as string;
  const message = formData.get("message") as string;

  if (!name?.trim() || !message?.trim()) {
    return { status: "error", message: "Name and message are required." };
  }

  // Spam filters — silently discard to avoid giving bots feedback
  const combined = `${name} ${message}`;

  // Cyrillic characters (Russian/Ukrainian spam)
  if (/[Ѐ-ӿ]/.test(combined)) {
    return { status: "success" };
  }

  // Multiple URLs in message body
  const urlCount = (message.match(/https?:\/\//gi) ?? []).length;
  if (urlCount >= 2) {
    return { status: "success" };
  }

  // Known spam domains / patterns
  const spamPatterns = [/ozon\.ru/i, /share\.google/i, /t\.me\//i, /bit\.ly\//i];
  if (spamPatterns.some((p) => p.test(combined))) {
    return { status: "success" };
  }

  const replyTo = senderEmail?.trim() || undefined;

  const { error } = await resend.emails.send({
    from,
    to,
    ...(replyTo ? { replyTo } : {}),
    subject: `[OW Tracker] ${topic}`,
    text: [
      `From: ${name}`,
      replyTo ? `Reply-to: ${replyTo}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <p><strong>From:</strong> ${escHtml(name)}</p>
      ${replyTo ? `<p><strong>Reply-to:</strong> ${escHtml(replyTo)}</p>` : ""}
      <p><strong>Topic:</strong> ${escHtml(topic)}</p>
      <hr />
      <p style="white-space:pre-wrap">${escHtml(message)}</p>
    `,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return { status: "error", message: error.message };
  }

  return { status: "success" };
}

function escHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

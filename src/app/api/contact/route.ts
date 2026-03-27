import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  company: z.string().optional().default(""),
  website: z.string().optional().default(""),
  acceptance: z.boolean(),
  "more-details": z.string().optional().default(""),
  subject: z.string().optional().default("New contact"),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid form fields." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot field: if a bot fills it, ignore the message.
  if (data["more-details"]?.trim()) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (!data.acceptance) {
    return NextResponse.json(
      { ok: false, error: "Please accept the privacy terms." },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "SamuelTrotmanJr@gmail.com";
  const fromEmail = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  if (!resendApiKey) {
    return NextResponse.json(
      { ok: false, error: "Missing RESEND_API_KEY env var." },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);

  const subject = data.subject || `New contact from ${data.name}`;
  const html = `
    <div>
      <h2 style="margin:0 0 12px 0;">${escapeHtml(subject)}</h2>
      <p style="margin:0 0 8px 0;">You received a new message from <strong>${escapeHtml(
        data.name
      )}</strong>.</p>
      <ul style="margin:0; padding-left: 18px;">
        <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
        <li><strong>Company:</strong> ${escapeHtml(data.company || "-")}</li>
        <li><strong>Website:</strong> ${escapeHtml(data.website || "-")}</li>
      </ul>
      <hr style="margin:16px 0;" />
      <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send email via Resend.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}


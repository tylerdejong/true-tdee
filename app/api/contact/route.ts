import { NextRequest, NextResponse } from "next/server";
import { appendContactSubmission } from "@/lib/googleSheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contactReasons = [
  "General feedback",
  "Bug report",
  "Feature request",
  "Data/calculation question",
  "Other"
] as const;

const minMessageLength = 10;
const maxMessageLength = 3000;
const minCompletionTimeMs = 3000;
const rateLimitWindowMs = 10 * 60 * 1000;
const maxSubmissionsPerWindow = 5;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

type ContactReason = (typeof contactReasons)[number];

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  reason?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function stripUnsafeControlCharacters(value: string) {
  return value
    .split("")
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || code >= 32;
    })
    .join("");
}

function cleanSingleLine(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return stripUnsafeControlCharacters(value).replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanMessage(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return stripUnsafeControlCharacters(value)
    .replace(/\r\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim()
    .slice(0, maxMessageLength);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isContactReason(value: string): value is ContactReason {
  return contactReasons.includes(value as ContactReason);
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateLimits.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  if (current.count >= maxSubmissionsPerWindow) {
    return true;
  }

  current.count += 1;
  return false;
}

function submittedTooQuickly(startedAt: unknown) {
  const startTime = typeof startedAt === "number" ? startedAt : Number(startedAt);

  if (!Number.isFinite(startTime)) {
    return false;
  }

  return Date.now() - startTime < minCompletionTimeMs;
}

export async function POST(request: NextRequest) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return jsonError("Invalid request body.");
  }

  const honeypot = cleanSingleLine(payload.website, 200);

  if (honeypot) {
    return jsonError("Submission rejected.");
  }

  if (submittedTooQuickly(payload.startedAt)) {
    return jsonError("Please take a moment to complete the form before submitting.");
  }

  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return jsonError("Too many submissions. Please try again later.", 429);
  }

  const name = cleanSingleLine(payload.name, 120);
  const email = cleanSingleLine(payload.email, 254);
  const reason = cleanSingleLine(payload.reason, 80);
  const message = cleanMessage(payload.message);

  if (!name || !email || !reason || !message) {
    return jsonError("Name, email, reason, and message are required.");
  }

  if (!isValidEmail(email)) {
    return jsonError("Enter a valid email address.");
  }

  if (!isContactReason(reason)) {
    return jsonError("Choose a valid contact reason.");
  }

  if (message.length < minMessageLength) {
    return jsonError(`Message must be at least ${minMessageLength} characters.`);
  }

  if (message.length > maxMessageLength) {
    return jsonError(`Message must be ${maxMessageLength} characters or fewer.`);
  }

  try {
    await appendContactSubmission({
      timestamp: new Date().toISOString(),
      name,
      email,
      reason,
      message,
      userAgent: cleanSingleLine(request.headers.get("user-agent") || "", 500)
    });
  } catch (error) {
    console.error("Contact form submission failed", error);
    return jsonError("The message could not be saved right now. Please try again later.", 500);
  }

  return NextResponse.json({ ok: true });
}

"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";

const contactReasons = [
  "General feedback",
  "Bug report",
  "Feature request",
  "Data/calculation question",
  "Other"
];

const minMessageLength = 10;
const maxMessageLength = 3000;

type ContactFormState = {
  name: string;
  email: string;
  reason: string;
  message: string;
  website: string;
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  reason: "General feedback",
  message: "",
  website: ""
};

function validateForm(form: ContactFormState) {
  const errors: Partial<Record<keyof ContactFormState, string>> = {};

  if (!form.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!contactReasons.includes(form.reason)) {
    errors.reason = "Choose a reason.";
  }

  if (form.message.trim().length < minMessageLength) {
    errors.message = `Message must be at least ${minMessageLength} characters.`;
  }

  if (form.message.length > maxMessageLength) {
    errors.message = `Message must be ${maxMessageLength} characters or fewer.`;
  }

  return errors;
}

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const remainingCharacters = useMemo(() => maxMessageLength - form.message.length, [form.message.length]);

  function updateField(field: keyof ContactFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
    setStatusMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setStatusMessage("Please fix the highlighted fields.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          startedAt
        })
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to save your message.");
      }

      setForm(initialFormState);
      setStartedAt(Date.now());
      setStatus("success");
      setStatusMessage("Thanks. Your message has been saved.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Unable to save your message.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <label className="honeypot" aria-hidden="true">
        <span>Website</span>
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </label>

      <label>
        <span>Name</span>
        <input
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          required
        />
        {errors.name && (
          <small className="field-error" id="name-error">
            {errors.name}
          </small>
        )}
      </label>

      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          required
        />
        {errors.email && (
          <small className="field-error" id="email-error">
            {errors.email}
          </small>
        )}
      </label>

      <label>
        <span>Reason</span>
        <select
          name="reason"
          value={form.reason}
          onChange={(event) => updateField("reason", event.target.value)}
          aria-invalid={Boolean(errors.reason)}
          aria-describedby={errors.reason ? "reason-error" : undefined}
          required
        >
          {contactReasons.map((reason) => (
            <option value={reason} key={reason}>
              {reason}
            </option>
          ))}
        </select>
        {errors.reason && (
          <small className="field-error" id="reason-error">
            {errors.reason}
          </small>
        )}
      </label>

      <label>
        <span>Message</span>
        <textarea
          name="message"
          rows={7}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`message-help${errors.message ? " message-error" : ""}`}
          maxLength={maxMessageLength}
          required
        />
        <small className="field-help" id="message-help">
          Minimum {minMessageLength} characters. {remainingCharacters} characters remaining.
        </small>
        {errors.message && (
          <small className="field-error" id="message-error">
            {errors.message}
          </small>
        )}
      </label>

      <p className="privacy-note">
        Do not include sensitive health information in this form. Contact submissions are used only to respond to
        feedback and improve TrueTDEE.
      </p>

      <button className="form-button" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Saving..." : "Submit"}
      </button>

      {statusMessage && (
        <p className={status === "success" ? "form-success" : "form-error"} role="status">
          {statusMessage}
        </p>
      )}
    </form>
  );
}

"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    console.info("TrueTDEE contact form draft", {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    });

    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input name="name" autoComplete="name" required />
      </label>

      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <label>
        <span>Message</span>
        <textarea name="message" rows={6} required />
      </label>

      <button className="form-button" type="submit">
        Send message
      </button>

      {sent && (
        <p className="form-success" role="status">
          Thanks. This form is currently local-only, so email hello@truetdee.com directly if you need a reply.
        </p>
      )}
    </form>
  );
}

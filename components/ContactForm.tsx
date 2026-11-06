"use client";

import { useActionState, useRef, useState } from "react";
import { sendContact, type ContactState } from "@/lib/client-api";
import type { Dictionary } from "@/lib/i18n";

type Topic = Dictionary["contact"]["topics"][number];

interface Props {
  t: Dictionary["contact"];
}

const initialState: ContactState = { status: "idle" };

export default function ContactForm({ t }: Props) {
  const [state, action, pending] = useActionState(
    (_prev: ContactState, formData: FormData) => sendContact(formData),
    initialState
  );
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sent = state.status === "success" && state !== dismissed;

  function handleSendAnother() {
    setDismissed(state);
    formRef.current?.reset();
  }

  if (sent) {
    return (
      <div className="ow-card-sm p-8 text-center">
        <div className="text-[var(--ow-accent)] text-4xl mb-4">✓</div>
        <p
          className="text-white text-lg font-semibold mb-2"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.05em" }}
        >
          {t.form.success_title}
        </p>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">{t.form.success_body}</p>
        <button
          type="button"
          onClick={handleSendAnother}
          className="text-xs tracking-normal text-[var(--ow-accent)] hover:text-[var(--ow-accent-strong)] transition-colors"
        >
          {t.form.send_another}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate className="space-y-6">
      {/* Honeypot — hidden from real users, bots fill it in */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
      />
      {/* Topic selector */}
      <fieldset>
        <legend className="block text-xs tracking-normal text-zinc-500 mb-3">
          {t.form.topic_label}
          <span className="ml-2 text-[var(--ow-accent)]/70">{t.form.required}</span>
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {t.topics.map((tp: Topic, i: number) => (
            <label key={tp.value} className="cursor-pointer group">
              <input
                type="radio"
                name="topic"
                value={tp.label}
                defaultChecked={i === 0}
                className="sr-only"
              />
              <div className="ow-card-sm p-3 flex flex-col items-center gap-1.5 transition-colors group-has-[:checked]:border-[var(--ow-accent)]/60 group-has-[:checked]:bg-[var(--ow-accent)]/5 hover:border-zinc-600/60">
                <span className="text-xl leading-none text-zinc-500 group-has-[:checked]:text-[var(--ow-accent)] transition-colors">
                  {tp.icon}
                </span>
                <span
                  className="text-xs font-semibold tracking-wide leading-tight text-center text-zinc-500 group-has-[:checked]:text-white transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {tp.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Name */}
      <div>
        <label htmlFor="cf-name" className="block text-xs tracking-normal text-zinc-500 mb-2">
          {t.form.name_label}
          <span className="ml-2 text-[var(--ow-accent)]/70">{t.form.required}</span>
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          placeholder={t.form.placeholder_name}
          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[var(--ow-accent)]/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors rounded"
        />
      </div>

      {/* Sender email */}
      <div>
        <label htmlFor="cf-email" className="block text-xs tracking-normal text-zinc-500 mb-2">
          {t.form.sender_email_label}
        </label>
        <input
          id="cf-email"
          name="senderEmail"
          type="email"
          placeholder={t.form.placeholder_email}
          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[var(--ow-accent)]/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors rounded"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className="block text-xs tracking-normal text-zinc-500 mb-2">
          {t.form.message_label}
          <span className="ml-2 text-[var(--ow-accent)]/70">{t.form.required}</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          placeholder={t.form.placeholder_message}
          rows={5}
          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[var(--ow-accent)]/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors resize-y min-h-[120px] rounded"
        />
      </div>

      {/* Error */}
      {state.status === "error" && (
        <p className="text-sm text-red-400 bg-red-900/10 border border-red-500/30 px-4 py-3 rounded">
          {state.message}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 bg-[var(--ow-accent)]/10 border border-[var(--ow-accent)]/40 text-[var(--ow-accent)] text-xs tracking-normal font-semibold hover:bg-[var(--ow-accent)]/20 hover:border-[var(--ow-accent)]/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded"
      >
        {pending ? t.form.sending : `${t.form.submit} →`}
      </button>
    </form>
  );
}

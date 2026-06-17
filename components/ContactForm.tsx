"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import type { Dictionary } from "@/lib/i18n";

type Topic = Dictionary["contact"]["topics"][number];

interface Props {
  t: Dictionary["contact"];
}

const initialState: ContactState = { status: "idle" };

export default function ContactForm({ t }: Props) {
  const [state, action, pending] = useActionState(submitContact, initialState);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") setSent(true);
  }, [state.status]);

  function handleSendAnother() {
    setSent(false);
    formRef.current?.reset();
  }

  if (sent) {
    return (
      <div className="ow-card-sm p-8 text-center animate-fade-up">
        <div className="text-[#f4a029] text-4xl mb-4">✓</div>
        <p
          className="text-white text-lg font-semibold mb-2"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}
        >
          {t.form.success_title}
        </p>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">{t.form.success_body}</p>
        <button
          type="button"
          onClick={handleSendAnother}
          className="text-[11px] uppercase tracking-widest text-[#f4a029] hover:text-[#ffbe55] transition-colors"
        >
          {t.form.send_another}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate className="space-y-6 animate-fade-up">
      {/* Topic selector */}
      <fieldset>
        <legend className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-3">
          {t.form.topic_label}
          <span className="ml-2 text-[#f4a029]/70">{t.form.required}</span>
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
              <div className="ow-card-sm p-3 flex flex-col items-center gap-1.5 transition-colors group-has-[:checked]:border-[#f4a029]/60 group-has-[:checked]:bg-[#f4a029]/5 hover:border-zinc-600/60">
                <span className="text-xl leading-none text-zinc-600 group-has-[:checked]:text-[#f4a029] transition-colors">
                  {tp.icon}
                </span>
                <span
                  className="text-[11px] font-semibold tracking-wide leading-tight text-center text-zinc-500 group-has-[:checked]:text-white transition-colors"
                  style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
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
        <label htmlFor="cf-name" className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
          {t.form.name_label}
          <span className="ml-2 text-[#f4a029]/70">{t.form.required}</span>
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          placeholder={t.form.placeholder_name}
          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#f4a029]/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
          style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* Sender email */}
      <div>
        <label htmlFor="cf-email" className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
          {t.form.sender_email_label}
        </label>
        <input
          id="cf-email"
          name="senderEmail"
          type="email"
          placeholder={t.form.placeholder_email}
          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#f4a029]/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
          style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
          {t.form.message_label}
          <span className="ml-2 text-[#f4a029]/70">{t.form.required}</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          placeholder={t.form.placeholder_message}
          rows={5}
          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#f4a029]/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors resize-y min-h-[120px]"
          style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* Error */}
      {state.status === "error" && (
        <p className="text-sm text-red-400 bg-red-900/10 border border-red-500/30 px-4 py-3">
          {state.message}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 bg-[#f4a029]/10 border border-[#f4a029]/40 text-[#f4a029] text-[11px] uppercase tracking-widest font-semibold hover:bg-[#f4a029]/20 hover:border-[#f4a029]/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
      >
        {pending ? t.form.sending : `${t.form.submit} →`}
      </button>
    </form>
  );
}

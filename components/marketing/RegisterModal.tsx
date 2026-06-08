"use client";

import { useState, useEffect, useRef } from "react";
import { X, Check } from "lucide-react";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "form" | "success";
type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

const DAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    preferred_day: "" as Day | "",
    skill_level: "" as "beginner" | "intermediate" | "advanced" | "",
  });
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function reset() {
    setStep("form");
    setForm({ full_name: "", email: "", preferred_day: "", skill_level: "" });
    setError("");
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.full_name.trim() || !form.email.trim() || !form.preferred_day || !form.skill_level) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed. Please try again.");
      }
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "var(--overlay-scrim)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Register for The Mahjong Open"
        style={{
          background: "#fff",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          width: "100%",
          maxWidth: 480,
          padding: "40px 36px",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--ink-500)",
            padding: 4,
            borderRadius: "var(--radius-sm)",
          }}
        >
          <X size={18} />
        </button>

        {step === "form" ? (
          <>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Spring Season · 2026</p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 30,
                fontWeight: 400,
                lineHeight: 1.1,
                color: "var(--ink-900)",
                marginBottom: 24,
              }}
            >
              Join the{" "}
              <em style={{ color: "var(--pink-400)" }}>Mahjong Open</em>
            </h2>

            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Full name">
                <input
                  className="input-mo"
                  type="text"
                  placeholder="Your name"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  autoComplete="name"
                />
              </Field>

              <Field label="Email address">
                <input
                  className="input-mo"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </Field>

              <Field label="Preferred game day">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, preferred_day: d }))}
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        padding: "6px 14px",
                        borderRadius: "var(--radius-pill)",
                        border: form.preferred_day === d ? "2px solid var(--pink-400)" : "1.5px solid var(--hair-200)",
                        background: form.preferred_day === d ? "var(--pink-50)" : "#fff",
                        color: form.preferred_day === d ? "var(--pink-700)" : "var(--ink-700)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Experience level">
                <select
                  className="input-mo"
                  value={form.skill_level}
                  onChange={(e) => setForm((f) => ({ ...f, skill_level: e.target.value as typeof form.skill_level }))}
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </Field>

              {error && (
                <p style={{ fontSize: 13, color: "var(--danger)", margin: 0 }}>{error}</p>
              )}

              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                style={{ marginTop: 8, justifyContent: "center", padding: "14px 24px" }}
              >
                {loading ? "Saving your spot…" : "Save my spot →"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--lime-50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Check size={24} color="var(--lime-600)" />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 400,
                color: "var(--ink-900)",
                marginBottom: 12,
              }}
            >
              You&rsquo;re on the list!
            </h2>
            <p style={{ fontSize: 16, color: "var(--ink-700)", lineHeight: 1.6, marginBottom: 28 }}>
              We&rsquo;ve saved your spot for the Spring 2026 season. Check your inbox for next steps — including how to complete your registration and access the player portal.
            </p>
            <button className="btn btn-primary" onClick={handleClose} style={{ justifyContent: "center" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-800)" }}>{label}</label>
      {children}
    </div>
  );
}

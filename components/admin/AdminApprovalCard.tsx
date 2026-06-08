"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil } from "lucide-react";

export interface PlayerScore {
  user_id: string;
  wins: number;
  points: number;
  profiles: { full_name: string | null } | null;
}

export interface Submission {
  id: string;
  status: string;
  created_at: string;
  scramble_tables: {
    week_number: number;
    table_date: string;
    location_name: string;
    cities: { name: string } | null;
  } | null;
  submitted_by_profile: { full_name: string | null } | null;
  score_submission_players: PlayerScore[];
}

export default function AdminApprovalCard({ submission }: { submission: Submission }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [players, setPlayers] = useState(submission.score_submission_players.map((p) => ({ ...p })));
  const [loading, setLoading] = useState<"approve" | "edit" | null>(null);

  const table = submission.scramble_tables;

  async function handleApprove() {
    setLoading("approve");
    console.log("[admin-approve] approving", submission.id);
    try {
      const res = await fetch(`/api/admin/scores/${submission.id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to approve");
      console.log("[admin-approve] approved");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  async function handleEdit() {
    setLoading("edit");
    console.log("[admin-edit] saving edited scores", submission.id);
    try {
      const res = await fetch(`/api/admin/scores/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players }),
      });
      if (!res.ok) throw new Error("Failed to save");
      console.log("[admin-edit] saved");
      setEditing(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--hair-200)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--hair-200)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--paper-50)",
        }}
      >
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>
            Week {table?.week_number} · {table?.location_name}
            {table?.cities?.name && <span style={{ color: "var(--ink-500)", fontWeight: 400 }}> · {table.cities.name}</span>}
          </p>
          <p style={{ fontSize: 12, color: "var(--ink-500)" }}>
            {table && new Date(table.table_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {" · "}Submitted by {submission.submitted_by_profile?.full_name ?? "unknown"}
          </p>
        </div>
        <span className="badge badge-butter">Pending</span>
      </div>

      {/* Scores */}
      <div style={{ padding: "12px 18px" }}>
        {players.map((player, i) => {
          const name = player.profiles?.full_name ?? "Player";
          return (
            <div
              key={player.user_id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 0",
                borderBottom: i < players.length - 1 ? "1px solid var(--hair-200)" : "none",
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--paper-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--ink-700)", flexShrink: 0 }}>
                {name[0]}
              </div>
              <p style={{ flex: 1, fontSize: 14, color: "var(--ink-800)" }}>{name}</p>
              {editing ? (
                <div style={{ display: "flex", gap: 16 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    Wins
                    <input
                      type="number"
                      min={0}
                      value={player.wins}
                      onChange={(e) => setPlayers((prev) => prev.map((p, j) => j === i ? { ...p, wins: parseInt(e.target.value) || 0 } : p))}
                      style={{ width: 50, padding: "4px 6px", border: "1px solid var(--hair-200)", borderRadius: 4, fontSize: 13 }}
                    />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    Pts
                    <input
                      type="number"
                      min={0}
                      value={player.points}
                      onChange={(e) => setPlayers((prev) => prev.map((p, j) => j === i ? { ...p, points: parseInt(e.target.value) || 0 } : p))}
                      style={{ width: 60, padding: "4px 6px", border: "1px solid var(--hair-200)", borderRadius: 4, fontSize: 13 }}
                    />
                  </label>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 16 }}>
                  <span className="badge badge-mute">{player.wins}W</span>
                  <span className="badge badge-peri">{player.points}pts</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: "12px 18px",
          borderTop: "1px solid var(--hair-200)",
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
        }}
      >
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="btn btn-ghost" style={{ fontSize: 13, padding: "8px 16px" }}>
              Cancel
            </button>
            <button onClick={handleEdit} disabled={loading === "edit"} className="btn btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
              {loading === "edit" ? "Saving…" : "Save scores"}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="btn btn-ghost" style={{ fontSize: 13, padding: "8px 16px", display: "flex", gap: 6, alignItems: "center" }}>
              <Pencil size={13} />
              Edit
            </button>
            <button onClick={handleApprove} disabled={loading === "approve"} className="btn btn-primary" style={{ fontSize: 13, padding: "8px 16px", background: "var(--lime-600)", display: "flex", gap: 6, alignItems: "center" }}>
              <Check size={13} />
              {loading === "approve" ? "Approving…" : "Approve"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

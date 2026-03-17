import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

export default function DoctorReport() {
  const { appointmentId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [diagnosis, setDiagnosis] = useState("")
  const [tests, setTests] = useState("")
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const canSubmit = useMemo(() => diagnosis.trim(), [diagnosis])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await fetchJson(`${BASE_URL}/reports/${appointmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diagnosis: diagnosis.trim(),
          tests: tests.trim() || undefined,
          remarks: remarks.trim() || undefined,
        }),
      })
      navigate("/doctor/queue", { replace: true })
    } catch (e) {
      setError(e?.message || "Failed to add report")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Add report</h2>
        <Link className="btn" to="/doctor/queue">
          Back
        </Link>
      </div>
      <p className="muted">Appointment ID: {appointmentId}</p>

      <form onSubmit={onSubmit} style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          className="input"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Diagnosis (required)"
        />
        <input className="input" value={tests} onChange={(e) => setTests(e.target.value)} placeholder="Tests (optional)" />
        <input className="input" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks (optional)" />
        <div className="row">
          <button className="btn primary" type="submit" disabled={!canSubmit || loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="err" style={{ marginTop: 10 }}>
          {error}
        </p>
      ) : null}
    </div>
  )
}


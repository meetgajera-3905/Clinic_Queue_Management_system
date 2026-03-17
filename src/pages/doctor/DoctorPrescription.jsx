import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

export default function DoctorPrescription() {
  const { appointmentId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const canSubmit = useMemo(
    () => name.trim() && dosage.trim() && duration.trim(),
    [name, dosage, duration],
  )

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await fetchJson(`${BASE_URL}/prescriptions/${appointmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          medicines: [{ name: name.trim(), dosage: dosage.trim(), duration: duration.trim() }],
          notes: notes.trim() || undefined,
        }),
      })
      navigate("/doctor/queue", { replace: true })
    } catch (e) {
      setError(e?.message || "Failed to add prescription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 700 }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="mb-0">Add prescription</h2>
        <Link className="btn btn-outline-secondary btn-sm" to="/doctor/queue">
          Back
        </Link>
      </div>
      <p className="muted">Appointment ID: {appointmentId}</p>

      <form onSubmit={onSubmit} className="mt-3">
        <div className="row mb-3">
          <div className="col-md-4 mb-2">
            <label className="form-label">Medicine name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Paracetamol"
            />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label">Dosage</label>
            <input
              className="form-control"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="500mg"
            />
          </div>
          <div className="col-md-4 mb-2">
            <label className="form-label">Duration</label>
            <input
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="5 days"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Notes (optional)</label>
          <input
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="After food"
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={!canSubmit || loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      {error ? <p className="err mt-3">{error}</p> : null}
    </div>
  )
}


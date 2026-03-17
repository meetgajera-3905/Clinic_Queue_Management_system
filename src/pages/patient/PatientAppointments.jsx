import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

const TIME_SLOTS = [
  "10:00-10:15",
  "10:15-10:30",
  "10:30-10:45",
  "10:45-11:00",
  "11:00-11:15",
  "11:15-11:30",
  "11:30-11:45",
  "11:45-12:00",
  "12:15-12:30",
  "12:30-12:45",
  "12:45-01:00",
  "01:00-01:15",
]

function todayAsInputDate() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function PatientAppointments() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const [appointmentDate, setAppointmentDate] = useState(todayAsInputDate)
  const [timeSlot, setTimeSlot] = useState("")
  const [creating, setCreating] = useState(false)
  const [createMessage, setCreateMessage] = useState("")

  function loadAppointments() {
    setLoading(true)
    setError("")
    fetchJson(`${BASE_URL}/appointments/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setItems(Array.isArray(res) ? res : res?.appointments || []))
      .catch((e) => setError(e?.message || "Failed to load appointments"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAppointments()
  }, [token])

  function onSubmit(e) {
    e.preventDefault()
    setCreateMessage("")
    setError("")
    setCreating(true)

    fetchJson(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointmentDate, timeSlot }),
    })
      .then(() => {
        setCreateMessage("Appointment created successfully.")
        loadAppointments()
      })
      .catch((e) => {
        setError(e?.message || "Failed to create appointment")
      })
      .finally(() => {
        setCreating(false)
      })
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="card" style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 className="mb-3">Book new appointment</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Appointment date</label>
            <input
              type="date"
              className="form-control"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Time slot</label>
            <div className="d-flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={
                    timeSlot === slot
                      ? "btn btn-primary"
                      : "btn btn-outline-primary"
                  }
                  onClick={() => setTimeSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success"
            disabled={!appointmentDate || !timeSlot || creating}
          >
            {creating ? "Booking..." : "Book appointment"}
          </button>

          {createMessage ? (
            <p className="text-success mt-2 mb-0">{createMessage}</p>
          ) : null}
        </form>
      </div>

      <div className="card" style={{ maxWidth: 800, margin: "0 auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="mb-0">My appointments</h2>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={loadAppointments}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? <p className="muted">Loading...</p> : null}
        {error ? <p className="err">{error}</p> : null}
        {!loading && items.length === 0 ? (
          <p className="muted">No appointments found.</p>
        ) : null}

        {items.length ? (
          <table className="table table-striped table-sm mt-2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.date || a.slotDate || a.createdAt || "-"}</td>
                  <td>{a.status || a.queueStatus || "-"}</td>
                  <td>
                    <Link className="btn btn-sm btn-outline-primary" to={`/patient/appointments/${a.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  )
}


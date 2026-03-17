import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

export default function PatientAppointmentDetails() {
  const { token } = useAuth()
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError("")
    fetchJson(`${BASE_URL}/appointments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => alive && setData(res))
      .catch((e) => alive && setError(e?.message || "Failed to load appointment"))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [id, token])

  return (
    <div className="card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="mb-0">Appointment #{id}</h2>
        <Link className="btn btn-outline-secondary btn-sm" to="/patient/appointments">
          Back
        </Link>
      </div>

      {loading ? <p className="muted">Loading...</p> : null}
      {error ? <p className="err">{error}</p> : null}

      {data ? (
        <table className="table table-borderless mt-3" style={{ maxWidth: 600 }}>
          <tbody>
            <tr>
              <th scope="row">ID</th>
              <td>{data.id}</td>
            </tr>
            <tr>
              <th scope="row">Date</th>
              <td>{data.date || data.slotDate || data.createdAt || "-"}</td>
            </tr>
            <tr>
              <th scope="row">Time slot</th>
              <td>{data.timeSlot || "-"}</td>
            </tr>
            <tr>
              <th scope="row">Status</th>
              <td>{data.status || data.queueStatus || "-"}</td>
            </tr>
            <tr>
              <th scope="row">Doctor</th>
              <td>{data.doctorName || data.doctor?.name || "-"}</td>
            </tr>
            <tr>
              <th scope="row">Patient</th>
              <td>{data.patientName || data.patient?.name || "-"}</td>
            </tr>
          </tbody>
        </table>
      ) : null}
    </div>
  )
}


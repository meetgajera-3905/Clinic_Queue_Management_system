import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

export default function DoctorQueue() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError("")
    try {
      const data = await fetchJson(`${BASE_URL}/doctor/queue`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setItems(Array.isArray(data) ? data : data?.queue || [])
    } catch (e) {
      setError(e?.message || "Failed to load queue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [token])

  return (
    <div className="card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="mb-0">Today&apos;s queue</h2>
        <button className="btn btn-outline-secondary btn-sm" type="button" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading ? <p className="muted">Loading...</p> : null}
      {error ? <p className="err">{error}</p> : null}
      {!loading && items.length === 0 ? <p className="muted">No queue entries.</p> : null}

      {items.length ? (
        <table className="table table-striped table-sm mt-2">
          <thead>
            <tr>
              <th>Token</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((q) => {
              const appointmentId = q.appointmentId ?? q.appointment?.id
              return (
                <tr key={q.id}>
                  <td>{q.tokenNumber ?? q.token ?? "-"}</td>
                  <td>{q.patientName ?? q.patient?.name ?? "-"}</td>
                  <td>{q.status}</td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      {appointmentId ? (
                        <>
                          <Link
                            className="btn btn-sm btn-outline-primary"
                            to={`/doctor/prescriptions/${appointmentId}`}
                          >
                            Add prescription
                          </Link>
                          <Link
                            className="btn btn-sm btn-primary"
                            to={`/doctor/reports/${appointmentId}`}
                          >
                            Add report
                          </Link>
                        </>
                      ) : (
                        <span className="muted">No appointmentId</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}


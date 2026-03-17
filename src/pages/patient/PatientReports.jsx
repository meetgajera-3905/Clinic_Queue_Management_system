import { useEffect, useState } from "react"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

export default function PatientReports() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError("")
    fetchJson(`${BASE_URL}/reports/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!alive) return
        setItems(Array.isArray(res) ? res : res?.reports || [])
      })
      .catch((e) => alive && setError(e?.message || "Failed to load reports"))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [token])

  return (
    <div className="card">
      <h2>My reports</h2>
      {loading ? <p className="muted">Loading...</p> : null}
      {error ? <p className="err">{error}</p> : null}
      {!loading && items.length === 0 ? <p className="muted">No reports found.</p> : null}

      {items.length ? (
        <table className="table table-striped table-sm mt-2">
          <thead>
            <tr>
              <th>ID</th>
              <th>Appointment</th>
              <th>Diagnosis</th>
              <th>Tests</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.appointmentId}</td>
                <td>{r.diagnosis || "-"}</td>
                <td>{r.tests || "-"}</td>
                <td>{r.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}


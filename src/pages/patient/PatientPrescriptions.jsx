import { useEffect, useState } from "react"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

export default function PatientPrescriptions() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError("")
    fetchJson(`${BASE_URL}/prescriptions/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!alive) return
        setItems(Array.isArray(res) ? res : res?.prescriptions || [])
      })
      .catch((e) => alive && setError(e?.message || "Failed to load prescriptions"))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [token])

  return (
    <div className="card">
      <h2>My prescriptions</h2>
      {loading ? <p className="muted">Loading...</p> : null}
      {error ? <p className="err">{error}</p> : null}
      {!loading && items.length === 0 ? <p className="muted">No prescriptions found.</p> : null}

      {items.length ? (
        <table className="table table-striped table-sm mt-2">
          <thead>
            <tr>
              <th>ID</th>
              <th>Appointment</th>
              <th>Medicines</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.appointmentId}</td>
                <td>
                  {Array.isArray(p.medicines) && p.medicines.length ? (
                    <ul className="mb-0">
                      {p.medicines.map((m, index) => (
                        <li key={index}>
                          {m.name} – {m.dosage} – {m.duration}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="muted">No medicines</span>
                  )}
                </td>
                <td>{p.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}


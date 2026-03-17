import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

function yyyyMmDd(d) {
  return d.toISOString().slice(0, 10)
}

export default function ReceptionistQueue() {
  const { token } = useAuth()
  const [date, setDate] = useState(() => yyyyMmDd(new Date()))
  const [items, setItems] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const query = useMemo(() => `/queue?date=${encodeURIComponent(date)}`, [date])

  async function load() {
    setLoading(true)
    setError("")
    try {
      const data = await fetchJson(`${BASE_URL}${query}`, {
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
  }, [query, token])

  async function updateStatus(id, status) {
    setUpdatingId(id)
    setError("")
    try {
      await fetchJson(`${BASE_URL}/queue/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      await load()
    } catch (e) {
      setError(e?.message || "Failed to update status")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="mb-0">Daily queue</h2>
        <div className="d-flex gap-2">
          <input
            className="form-control form-control-sm"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="btn btn-outline-secondary btn-sm" type="button" onClick={load} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? <p className="muted">Loading...</p> : null}
      {error ? <p className="err">{error}</p> : null}
      {!loading && items.length === 0 ? <p className="muted">No queue entries for this date.</p> : null}

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
            {items.map((q) => (
              <tr key={q.id}>
                <td>{q.tokenNumber ?? q.token ?? "-"}</td>
                <td>{q.patientName ?? q.patient?.name ?? "-"}</td>
                <td>{q.status}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      type="button"
                      disabled={updatingId === q.id || q.status !== "waiting"}
                      onClick={() => updateStatus(q.id, "in-progress")}
                    >
                      In progress
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      type="button"
                      disabled={updatingId === q.id || q.status !== "waiting"}
                      onClick={() => updateStatus(q.id, "skipped")}
                    >
                      Skipped
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      type="button"
                      disabled={updatingId === q.id || q.status !== "in-progress"}
                      onClick={() => updateStatus(q.id, "done")}
                    >
                      Done
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}


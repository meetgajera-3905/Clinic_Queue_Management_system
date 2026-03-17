import { useEffect, useState } from "react"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

export default function AdminClinic() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError("")
    fetchJson(`${BASE_URL}/admin/clinic`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => alive && setData(res))
      .catch((e) => alive && setError(e?.message || "Failed to load clinic"))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [token])

 return (
  <div className="card bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Clinic</h2>
    {loading && <p className="text-gray-500">Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}
    {data && (
      <table className="table-auto w-full">
        <tbody>
          {Object.entries(data).map(([k, v]) => (
            <tr 
              key={k} 
              className={`
                ${v === null ? 'bg-gray-100' : ''}
                ${typeof v === 'object' ? 'bg-blue-100' : ''}
                ${typeof v === 'boolean' ? (v ? 'bg-green-100' : 'bg-red-100') : ''}
                border-b border-gray-200
              `}
            >
              <th className="px-4 py-2 text-left w-1/3 font-medium">{k}</th>
              <td className="px-4 py-2">{typeof v === "object" ? JSON.stringify(v) : String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)
}

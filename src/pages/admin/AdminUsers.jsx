import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../../auth/AuthContext.jsx"

import { BASE_URL } from "../../config.js"
import { fetchJson } from "../../fetchJson.js"

export default function AdminUsers() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("receptionist")
  const [creating, setCreating] = useState(false)

  const canCreate = useMemo(
    () => name.trim() && email.trim() && password.trim() && role,
    [name, email, password, role],
  )

  async function load() {
    setLoading(true)
    setError("")
    try {
      const data = await fetchJson(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(Array.isArray(data) ? data : data?.users || [])
    } catch (e) {
      setError(e?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [token])

  async function onCreate(e) {
    e.preventDefault()
    setCreating(true)
    setError("")
    try {
      await fetchJson(`${BASE_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      })
      setName("")
      setEmail("")
      setPassword("")
      setRole("receptionist")
      await load()
    } catch (e) {
      setError(e?.message || "Failed to create user")
    } finally {
      setCreating(false)
    }
  }
return (
  <div className="flex flex-col gap-4">
    <div className="card bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">Users</h2>
      <p className="text-gray-500 mb-4">Create users</p>
      <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <input 
          className="input border border-gray-300 rounded-md p-2" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
        />
        <input 
          className="input border border-gray-300 rounded-md p-2" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          autoComplete="off"
        />
        <input 
          className="input border border-gray-300 rounded-md p-2" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          autoComplete="new-password"
        />
        <select 
          className="input border border-gray-300 rounded-md p-2" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="receptionist">Receptionist</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>
        <button 
          className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
          type="submit" 
          disabled={!canCreate || creating}
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </form>
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </div>
    <div className="card bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">List</h2>
        <button 
          className="btn border border-gray-300 rounded-md p-2" 
          type="button" 
          onClick={load} 
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users yet.</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id || `${u.email}-${u.role}`}>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
)
}

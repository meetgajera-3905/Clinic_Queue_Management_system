import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext.jsx"

import { BASE_URL } from "../config.js"
import { fetchJson } from "../fetchJson.js"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const canSubmit = useMemo(() => email.trim() && password.trim(), [email, password])

  async function onSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await fetchJson(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      login({ token: data?.token, user: data?.user })
      navigate("/me", { replace: true })
    } catch (err) {
      setError(err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

 return (
  <div className="min-h-screen flex justify-center items-center p-4">
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Email</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-md" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com" 
            autoComplete="username"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Password</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-md" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            autoComplete="current-password"
          />
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-md" 
          type="submit" 
          disabled={!canSubmit || loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
    </div>
  </div>
)

}


import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext.jsx"

export default function ProtectedRoute({ allow, render }) {
  const { token, role } = useAuth()

  if (!token) return <Navigate to="/login" replace />

  if (Array.isArray(allow) && allow.length > 0) {
    if (!role || !allow.includes(role)) return <Navigate to="/me" replace />
  }

  if (typeof render === "function") return render({ role })

  return <Outlet />
}


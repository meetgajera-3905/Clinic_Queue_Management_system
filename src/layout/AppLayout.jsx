import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext.jsx"

function linkClass({ isActive }) {
  return `btn btn-link px-2${isActive ? " fw-bold" : ""}`
}

export default function AppLayout() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
  <>
    <nav className="bg-white shadow-md mb-3">
      <div className="flex justify-between items-center p-4">
        <div>
          <span className="text-2xl font-bold">Clinic CMS</span>
          <div className="flex flex-col">
            <small className="text-sm">
              {user?.clinicName || user?.clinicCode || "Clinic"}
            </small>
            <small className="text-gray-500 text-xs">
              {user?.name || user?.email}
            </small>
            <small className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mt-1 inline-block capitalize">
              {role || "role"}
            </small>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <NavLink to="/me" className={linkClass} end>
            Home
          </NavLink> */}
          {role === "admin" && (
            <>
              <NavLink to="/admin/clinic" className={linkClass}>
                Clinic
              </NavLink>
              <NavLink to="/admin/users" className={linkClass}>
                Users
              </NavLink>
            </>
          )}
          {role === "patient" && (
            <>
              <NavLink to="/patient/appointments" className={linkClass}>
                Appointments
              </NavLink>
              <NavLink to="/patient/prescriptions" className={linkClass}>
                Prescriptions
              </NavLink>
              <NavLink to="/patient/reports" className={linkClass}>
                Reports
              </NavLink>
            </>
          )}
          {role === "receptionist" && (
            <NavLink to="/receptionist/queue" className={linkClass}>
              Queue
            </NavLink>
          )}
          {role === "doctor" && (
            <NavLink to="/doctor/queue" className={linkClass}>
              Today&apos;s queue
            </NavLink>
          )}
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded text-sm ml-2"
            type="button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
    <div className="container mx-auto mt-3">
      <Outlet />
    </div>
  </>
)
}

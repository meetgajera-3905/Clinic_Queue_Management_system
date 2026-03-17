import { Navigate, Route, Routes } from "react-router-dom"

import { AuthProvider } from "./auth/AuthContext.jsx"
import ProtectedRoute from "./auth/ProtectedRoute.jsx"
import AppLayout from "./layout/AppLayout.jsx"

import Login from "./pages/Login.jsx"
import NotFound from "./pages/NotFound.jsx"

import AdminClinic from "./pages/admin/AdminClinic.jsx"
import AdminUsers from "./pages/admin/AdminUsers.jsx"
import PatientAppointments from "./pages/patient/PatientAppointments.jsx"
import PatientAppointmentDetails from "./pages/patient/PatientAppointmentDetails.jsx"
import PatientPrescriptions from "./pages/patient/PatientPrescriptions.jsx"
import PatientReports from "./pages/patient/PatientReports.jsx"
import ReceptionistQueue from "./pages/receptionist/ReceptionistQueue.jsx"
import DoctorQueue from "./pages/doctor/DoctorQueue.jsx"
import DoctorPrescription from "./pages/doctor/DoctorPrescription.jsx"
import DoctorReport from "./pages/doctor/DoctorReport.jsx"

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/me" replace />} />
            <Route path="/me" element={<MeRedirect />} />

            <Route element={<ProtectedRoute allow={["admin"]} />}>
              <Route path="/admin/clinic" element={<AdminClinic />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            <Route element={<ProtectedRoute allow={["patient"]} />}>
              <Route path="/patient/appointments" element={<PatientAppointments />} />
              <Route path="/patient/appointments/:id" element={<PatientAppointmentDetails />} />
              <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
              <Route path="/patient/reports" element={<PatientReports />} />
            </Route>

            <Route element={<ProtectedRoute allow={["receptionist"]} />}>
              <Route path="/receptionist/queue" element={<ReceptionistQueue />} />
            </Route>

            <Route element={<ProtectedRoute allow={["doctor"]} />}>
              <Route path="/doctor/queue" element={<DoctorQueue />} />
              <Route path="/doctor/prescriptions/:appointmentId" element={<DoctorPrescription />} />
              <Route path="/doctor/reports/:appointmentId" element={<DoctorReport />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

function MeRedirect() {
  return (
    <ProtectedRoute
      render={({ role }) => {
        if (role === "admin") return <Navigate to="/admin/clinic" replace />
        if (role === "patient") return <Navigate to="/patient/appointments" replace />
        if (role === "receptionist") return <Navigate to="/receptionist/queue" replace />
        if (role === "doctor") return <Navigate to="/doctor/queue" replace />
        return <Navigate to="/login" replace />
      }}
    />
  )
}
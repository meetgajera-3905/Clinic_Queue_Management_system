import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="card">
      <h2>Page not found</h2>
      <p className="muted">The page you’re looking for doesn’t exist.</p>
      <div className="row" style={{ marginTop: 12 }}>
        <Link className="btn primary" to="/me">
          Go home
        </Link>
      </div>
    </div>
  )
}


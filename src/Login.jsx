import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState(null);

  const identifierType = /^[0-9+\s-]{7,}$/.test(identifier.trim()) ? "phone" : "email";

  const validate = () => {
    const e = {};
    if (!identifier.trim()) e.identifier = "Email or phone is required";
    else if (
      !identifier.match(/^[^@]+@[^@]+\.[^@]+$/) &&
      !identifier.match(/^[0-9+\s-]{7,15}$/)
    )
      e.identifier = "Enter a valid email or phone number";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    axios.post('http://127.0.0.1:8000/api/login', {
      login: identifier,
      password: password,
    })
      .then(res => {
        // console.log(res.data);
        const token = res.data.token;
        const role = res.data.user?.role;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        toast.success('login successfull!!');
        setTimeout(() => {
          navigate(role === 'admin' ? '/admin/dashboard' : role === 'user' ? '/service' : '/');
        }, 1000);

      })
      .catch(err => {
        if (err?.response?.data) {
          console.log(err.response.data);
          setErr(err.response.data.error);
          setErrors(err.response.data.error);
          console.log(err.response.data.error || 'Login failed');
        } else {
          console.log('server error');
        }
      });
  }


  if (success) {
    return (
      <div style={pageStyle}>
        <BgDecor />
        <style>{baseCSS}</style>
        <div style={{ ...cardStyle, textAlign: "center", padding: "64px 40px", maxWidth: 400, width: "100%" }}>
          <div className="success-pop" style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,#d1fae5,#a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 34 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", marginBottom: 10, letterSpacing: "-0.5px" }}>Welcome back!</h2>
          <p style={{ color: "#64748b", fontSize: 14.5, lineHeight: 1.7 }}>You're successfully logged in to your FixIt account.</p>
          <button onClick={() => { setSuccess(false); setIdentifier(""); setPassword(""); }} style={{ ...primaryBtn, marginTop: 28 }}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={pageStyle}>
        <style>{baseCSS}</style>
        <BgDecor />

        <div style={{ width: "100%", maxWidth: 440, zIndex: 1 }}>
          {/* Logo */}
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 28, textDecoration: "none" }}>
            <div style={{ width: 38, height: 38, background: "#2563eb", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 12px rgba(37,99,235,.35)" }}>🔩</div>
            <span style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.8px" }}>Fix<span style={{ color: "#2563eb" }}>It</span></span>
          </a>

          <div className="card-in" style={cardStyle}>
            {/* Header */}
            <div style={{ marginBottom: 30 }}>
              <h1 style={{ fontSize: 27, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.8px" }}>Sign in</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 6 }}>Good to have you back 👋</p>
            </div>
            {/* Tab strip — Email / Phone hint */}
            {/* <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 10, padding: 4, marginBottom: 24, gap: 4 }}>
            {["Email", "Phone"].map((tab) => {
              const active =
                tab === "Email"
                  ? identifierType === "email" || !identifier
                  : identifierType === "phone";
              return (
                <div key={tab} style={{
                  flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 8, fontSize: 13,
                  fontWeight: 700, color: active ? "#2563eb" : "#94a3b8",
                  background: active ? "#fff" : "transparent",
                  boxShadow: active ? "0 1px 6px rgba(0,0,0,.08)" : "none",
                  transition: "all .25s", cursor: "default",
                }}>{tab}</div>
              );
            })}
          </div> */}

            <br />
            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {err && <div className="text-red-500 bg-red-100 w-full flex justify-center rounded-l text-center">{err}</div>}

              <div className="field-in">
                <label style={labelStyle}>Email or Phone Number</label>
                <div style={inputWrap(focusedField === "id", !!errors.identifier)}>
                  <span style={iconStyle(focusedField === "id")}>
                    {identifierType === "phone" && identifier ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    )}
                  </span>
                  <input
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); setErrors({ ...errors, identifier: "" }); }}
                    onFocus={() => setFocusedField("id")}
                    onBlur={() => setFocusedField("")}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="you@example.com or +91 98765 43210"
                    style={inputEl}
                  />
                  {identifier && (
                    <button onClick={() => setIdentifier("")}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2, flexShrink: 0 }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                {errors.identifier && <p style={errStyle}>⚠ {errors.identifier}</p>}
              </div>


              <div className="field-in" style={{ animationDelay: ".1s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <a href="#" style={{ fontSize: 12.5, color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Forgot password?</a>
                </div>
                <div style={inputWrap(focusedField === "pw", !!errors.password)}>
                  <span style={iconStyle(focusedField === "pw")}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: "" }); }}
                    onFocus={() => setFocusedField("pw")}
                    onBlur={() => setFocusedField("")}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Enter your password"
                    style={inputEl}
                  />
                  <button onClick={() => setShowPass(!showPass)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2, flexShrink: 0 }}>
                    {showPass ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p style={errStyle}>⚠ {errors.password}</p>}
              </div>
            </div>

            {/* Remember me */}
            <label style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 18, cursor: "pointer" }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }} />
              <span style={{ fontSize: 13.5, color: "#64748b", fontWeight: 500 }}>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button className="submit-btn" onClick={handleSubmit} disabled={loading}
              style={{ ...primaryBtn, marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: loading ? 0.85 : 1 }}>
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />
                  Signing in…
                </>
              ) : "Sign In →"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "Google", color: "#ea4335", icon: "G" },
                { label: "Facebook", color: "#1877f2", icon: "f" },
              ].map(({ label, color, icon }) => (
                <button key={label}
                  style={{ flex: 1, padding: "11px", border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#374151", transition: "border .2s, box-shadow .2s", fontFamily: "inherit" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 0 3px ${color}18`; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}>
                  <span style={{ color, fontWeight: 900, fontSize: 17, lineHeight: 1 }}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Register link */}
            <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#64748b" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Create one free</Link>
            </p>
          </div>

          {/* Security note */}
          <p style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            256-bit SSL encryption · Your data is safe
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

function BgDecor() {
  return (
    <>
      <div className="blob-1" style={{ position: "fixed", top: "6%", right: "10%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div className="blob-2" style={{ position: "fixed", bottom: "10%", left: "6%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,.04) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
    </>
  );
}

const baseCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes blob1 { 0%,100%{transform:scale(1) translate(0,0);} 50%{transform:scale(1.1) translate(10px,-12px);} }
  @keyframes blob2 { 0%,100%{transform:scale(1) translate(0,0);} 50%{transform:scale(0.9) translate(-8px,10px);} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pop { 0%{transform:scale(.6);opacity:0;} 70%{transform:scale(1.1);} 100%{transform:scale(1);opacity:1;} }
  .card-in { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
  .field-in { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
  .blob-1 { animation: blob1 7s ease-in-out infinite; }
  .blob-2 { animation: blob2 9s ease-in-out infinite; }
  .spinner { animation: spin .75s linear infinite; }
  .success-pop { animation: pop .5s cubic-bezier(.22,1,.36,1) both; }
  .submit-btn:hover:not(:disabled) { background: #1d4ed8 !important; transform: translateY(-1px); box-shadow: 0 12px 28px rgba(37,99,235,.35) !important; }
  .submit-btn { transition: all .2s; }
  input:focus { outline: none; }
  @media (max-width: 480px) {
    .card-in { padding: 28px 18px !important; }
  }
`;

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(150deg, #f0f7ff 0%, #f8fafc 55%, #f0fdf4 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  position: "relative",
  overflow: "hidden",
};

const cardStyle = {
  background: "#fff",
  borderRadius: 22,
  padding: "38px 34px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,.04), 0 24px 56px -12px rgba(0,0,0,.13)",
  border: "1px solid rgba(226,232,240,.9)",
  position: "relative",
  zIndex: 1,
};

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "#374151",
  letterSpacing: "0.01em",
};

const inputWrap = (focused, hasErr) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: hasErr ? "1.5px solid #ef4444" : focused ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
  borderRadius: 11,
  padding: "0 14px",
  background: "#fff",
  transition: "border .2s, box-shadow .2s",
  boxShadow: hasErr
    ? "0 0 0 3px rgba(239,68,68,.1)"
    : focused
      ? "0 0 0 3px rgba(37,99,235,.12)"
      : "none",
});

const iconStyle = (focused) => ({
  color: focused ? "#2563eb" : "#94a3b8",
  display: "flex",
  flexShrink: 0,
  transition: "color .2s",
});

const inputEl = {
  flex: 1,
  border: "none",
  padding: "13px 0",
  fontSize: 14.5,
  color: "#0f172a",
  background: "transparent",
  fontFamily: "inherit",
};

const errStyle = {
  color: "#ef4444",
  fontSize: 12,
  marginTop: 5,
  fontWeight: 500,
};

const primaryBtn = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 11,
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 15.5,
  letterSpacing: "0.02em",
  fontFamily: "inherit",
  boxShadow: "0 4px 16px rgba(37,99,235,.25)",
};
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inputFields = [
  {
    id: "name",
    label: "Full Name",
    type: "text",
    placeholder: "John Doe",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    id: "contactno",
    label: "Phone Number",
    type: "tel",
    placeholder: "+91 98765 43210",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
      </svg>
    ),
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Min. 8 characters",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

// const roles = [
//   {
//     id: "user",
//     label: "User",
//     desc: "Book services for your home",
//     icon: (
//       <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//         <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//         <circle cx="12" cy="7" r="4" />
//       </svg>
//     ),
//     badge: "Default",
//     badgeColor: "#2563eb",
//     badgeBg: "#dbeafe",
//   },
//   {
//     id: "provider",
//     label: "Provider",
//     desc: "Offer services & earn money",
//     icon: (
//       <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//         <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
//       </svg>
//     ),
//     badge: "Earn",
//     badgeColor: "#059669",
//     badgeBg: "#d1fae5",
//   },
// ];

function StrengthBar({ password }) {
  const getStrength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  return password ? (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i <= strength ? colors[strength] : "#e2e8f0",
            transition: "background .3s",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[strength], fontWeight: 600 }}>{labels[strength]}</span>
    </div>
  ) : null;
}

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", contactno: "", password: "", role: "user", agree: false });
  // const [role, setRole] = useState("user");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Enter a valid email";
    if (!form.contactno.match(/^[0-9+\s-]{7,15}$/)) e.contactno = "Enter a valid phone number";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!form.agree) e.agree = "You must accept the terms";
    return e;
  };

  // const handleChange = (e) => {
  //   setForm({
  //     ...form,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    console.log(form.name, form.email, form.contactno, form.password);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/register', form);
      console.log(res.data);
      // alert('Registered Successfully ✅');
      toast.success('Register Successfully ✅');
      const token = res.data.token;
      localStorage.setItem('token', token);
      setTimeout(() => {
        navigate('/service');
      }, 1000);


    } catch (err) {
      if (err?.response?.data) {
        const errors = err.response.data.errors;
        toast.error(errors);

        // show first error
        const firstError = Object.values(errors)[0][0];
        toast.error(firstError);

        // debug
        // console.log(errors);
      } else {
        console.log("server error ❌");
      }
    }
  };


  if (submitted) {
    return (
      <div style={pageStyle}>
        <BgDecor />
        <div style={{ ...cardStyle, textAlign: "center", padding: "64px 40px" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32 }}>✅</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Account Created!</h2>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7 }}>
            Welcome, <strong>{form.name}</strong>! Your <strong>{role}</strong> account is ready.
          </p>
          <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", contactno: "", password: "" }); setAgree(false); }}
            style={primaryBtnStyle}>
            Back to Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={pageStyle}>
        <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-18px) rotate(8deg);} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(14px) rotate(-6deg);} }
        .card-animate { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) both; }
        .field-wrap { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
        .field-wrap:nth-child(1){animation-delay:.05s}
        .field-wrap:nth-child(2){animation-delay:.12s}
        .field-wrap:nth-child(3){animation-delay:.19s}
        .field-wrap:nth-child(4){animation-delay:.26s}
        .float-1 { animation: float1 6s ease-in-out infinite; }
        .float-2 { animation: float2 8s ease-in-out infinite; }
        .role-card:hover { border-color: #93c5fd !important; background: #f8faff !important; }
        .submit-btn:hover { background: #1d4ed8 !important; transform: translateY(-1px); box-shadow: 0 12px 32px rgba(37,99,235,.35) !important; }
        .submit-btn { transition: all .2s; }
        input:focus { outline: none; }
        .input-wrap:focus-within .input-icon { color: #2563eb !important; }
        @media (max-width: 520px) {
          .register-card { padding: 32px 20px !important; }
          .role-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

        <BgDecor />

        {/* Left panel — visible on wider screens via CSS (kept simple for JSX) */}
        <div style={{ width: "100%", maxWidth: 480, zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, background: "#2563eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔩</div>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
              Fix<span style={{ color: "#2563eb" }}>It</span>
            </span>
          </div>

          <div className="card-animate" style={{ ...cardStyle }} >
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>Create your account</h1>
              <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>Join thousands of happy users on FixIt</p>
            </div>

            {/* Role Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>I want to join as</label>
              <select name="role" value={form.role} onChange={handleChange} style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1.5px solid #e2e8f0', color: '#919191' }}>
                <option value="user">User</option>
                <option value="provider">Provider</option>
              </select>
              {/* <div className="role-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
              {roles.map((r) => {
                const active = role === r.id;
                return (
                  <button key={r.id} onClick={() => setRole(r.id)} className="role-card"
                    style={{
                      padding: "14px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                      border: active ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                      background: active ? "#eff6ff" : "#fff",
                      transition: "all .2s", display: "flex", flexDirection: "column", gap: 6,
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ color: active ? "#2563eb" : "#64748b", transition: "color .2s" }}>{r.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: r.badgeBg, color: r.badgeColor }}>{r.badge}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: active ? "#1e40af" : "#0f172a" }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{r.desc}</div>
                  </button>
                );
              })}
            </div> */}
            </div>

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {inputFields.map((field) => {
                const isPass = field.id === "password";
                const isFocused = focused === field.id;
                const hasError = errors[field.id];
                return (
                  <div key={field.id} className="field-wrap">
                    <label style={labelStyle}>{field.label}</label>
                    <div className="input-wrap" style={{
                      display: "flex", alignItems: "center", gap: 10,
                      border: hasError ? "1.5px solid #ef4444" : isFocused ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                      borderRadius: 10, padding: "0 14px", background: "#fff",
                      transition: "border .2s, box-shadow .2s",
                      boxShadow: isFocused ? "0 0 0 3px rgba(37,99,235,.12)" : "none",
                    }}>
                      <span className="input-icon" style={{ color: isFocused ? "#2563eb" : "#94a3b8", flexShrink: 0, display: "flex", transition: "color .2s" }}>{field.icon}</span>
                      <input
                        type={isPass && showPass ? "text" : field.type}
                        placeholder={field.placeholder}
                        value={form[field.id]}
                        onChange={(e) => { setForm({ ...form, [field.id]: e.target.value }); setErrors({ ...errors, [field.id]: "" }); }}
                        onFocus={() => setFocused(field.id)}
                        onBlur={() => setFocused("")}
                        style={{ flex: 1, border: "none", padding: "13px 0", fontSize: 14.5, color: "#0f172a", background: "transparent", fontFamily: "inherit" }}
                      />
                      {isPass && (
                        <button onClick={() => setShowPass(!showPass)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 0 }}>
                          {showPass ? (
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                          ) : (
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          )}
                        </button>
                      )}
                    </div>
                    {hasError && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 5, fontWeight: 500 }}>⚠ {hasError}</p>}
                    {isPass && <StrengthBar password={form.password} />}
                  </div>
                );
              })}
            </div>

            {/* Terms */}

            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  style={{
                    marginTop: 3,
                    width: 16,
                    height: 16,
                    accentColor: "#2563eb",
                    cursor: "pointer",
                  }}
                />

                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                  <span>
                    I agree to FixIt's{" "}
                    <a
                      href="#"
                      style={{
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      style={{
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Privacy Policy
                    </a>
                  </span>

                  {errors.agree && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: 12,
                        marginTop: 5,
                        fontWeight: 500,
                      }}
                    >
                      ⚠ {errors.agree}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button className="submit-btn" onClick={handleSubmit}
              style={{ ...primaryBtnStyle, marginTop: 24 }}>
              Create Account →
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>or sign up with</span>
              <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
            </div>

            {/* Social Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { name: "Google", color: "#ea4335", symbol: "G" },
                { name: "Facebook", color: "#1877f2", symbol: "f" },
              ].map(({ name, color, symbol }) => (
                <button key={name} style={{
                  flex: 1, padding: "11px", border: "1.5px solid #e2e8f0", borderRadius: 10,
                  background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontSize: 14, fontWeight: 600, color: "#374151", transition: "border .2s",
                }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = color}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}>
                  <span style={{ color, fontWeight: 900, fontSize: 16 }}>{symbol}</span> {name}
                </button>
              ))}
            </div>

            {/* Login Link */}
            <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#64748b" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />

    </>
  );
}

function BgDecor() {
  return (
    <>
      <div className="float-1" style={{ position: "fixed", top: "8%", right: "12%", width: 220, height: 220, borderRadius: "50%", background: "rgba(37,99,235,.07)", pointerEvents: "none", zIndex: 0 }} />
      <div className="float-2" style={{ position: "fixed", bottom: "12%", left: "8%", width: 160, height: 160, borderRadius: "50%", background: "rgba(16,185,129,.07)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "40%", right: "6%", width: 80, height: 80, borderRadius: "50%", background: "rgba(245,158,11,.07)", pointerEvents: "none", zIndex: 0 }} />
    </>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(145deg, #f0f7ff 0%, #f8fafc 50%, #f0fdf4 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  position: "relative",
};

const cardStyle = {
  background: "#fff",
  borderRadius: 20,
  padding: "36px 32px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,.05), 0 24px 48px -12px rgba(0,0,0,.12)",
  border: "1px solid rgba(226,232,240,.8)",
  position: "relative",
  zIndex: 1,
};

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "#374151",
  marginBottom: 6,
  letterSpacing: "0.01em",
};

const primaryBtnStyle = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 15,
  letterSpacing: "0.02em",
  fontFamily: "inherit",
};
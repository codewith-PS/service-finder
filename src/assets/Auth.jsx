import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── tiny icon components (no external dep) ─── */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const EyeIcon      = ({ open }) => open
  ? <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  : <Icon d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />;
const UserIcon     = () => <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />;
const MailIcon     = () => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const PhoneIcon    = () => <Icon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />;
const LockIcon     = () => <Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4" />;
const WrenchIcon   = () => <Icon d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />;
const CheckIcon    = () => <Icon d="M20 6L9 17l-5-5" />;

/* ─── field wrapper ─── */
function Field({ label, icon, error, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: error ? "#ef4444" : "#9a9590", marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: error ? "#ef4444" : "#5a5650", pointerEvents: "none" }}>
          {icon}
        </div>
        {children}
      </div>
      {error && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#ef4444", marginTop: 6 }}>{error}</p>}
    </div>
  );
}

/* ─── shared input style factory ─── */
const inputStyle = (error, extra = {}) => ({
  width: "100%",
  background: "#0c0e16",
  border: `1px solid ${error ? "#ef4444" : "rgba(201,168,76,0.18)"}`,
  color: "#e8e4dc",
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 14,
  padding: "13px 16px 13px 44px",
  outline: "none",
  transition: "border-color 0.25s, box-shadow 0.25s",
  boxSizing: "border-box",
  ...extra,
});

export default function AuthPage() {
  const [mode, setMode]       = useState("login");   // "login" | "signup"
  const [loginMethod, setLM]  = useState("email");   // "email" | "phone"
  const [role, setRole]       = useState("user");
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [focus, setFocus]     = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone]       = useState(false);

  /* form state */
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", confirmPwd:"" });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  /* validation */
  const validate = () => {
    const e = {};
    if (mode === "signup") {
      if (!form.name.trim())                        e.name = "Full name is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
      if (!/^\d{10}$/.test(form.phone))             e.phone = "Enter a valid 10-digit number";
      if (form.password.length < 8)                 e.password = "Min 8 characters";
      if (form.password !== form.confirmPwd)         e.confirmPwd = "Passwords do not match";
    } else {
      if (loginMethod === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Enter a valid email";
      if (loginMethod === "phone" && !/^\d{10}$/.test(form.phone))
        e.phone = "Enter a valid 10-digit number";
      if (!form.password) e.password = "Password is required";
    }
    return e;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setDone(true);
  };

  const navigate = useNavigate();
  const switchMode = (m) => {
    setMode(m); setErrors({}); setSubmitted(false); setDone(false);
    setForm({ name:"", email:"", phone:"", password:"", confirmPwd:"" });
    navigate('/login');
  };

  /* ─── focus border helper ─── */
  const fStyle = (name, err) => ({
    ...inputStyle(errors[name]),
    borderColor: focus === name ? (errors[name] ? "#ef4444" : "#c9a84c") : (errors[name] ? "#ef4444" : "rgba(201,168,76,0.18)"),
    boxShadow: focus === name ? (errors[name] ? "0 0 0 3px rgba(239,68,68,0.1)" : "0 0 0 3px rgba(201,168,76,0.1)") : "none",
  });

  /* ─── password strength ─── */
  const strength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#0ea5e9", "#22c55e"][strength];

  /* ─── success screen ─── */
  if (done) return (
    <div style={{ minHeight:"100vh", background:"#08090d", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>
      <div style={{ textAlign:"center", maxWidth:400 }}>
        <div style={{ width:80, height:80, border:"2px solid #22c55e", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", color:"#22c55e", animation:"pop 0.5s ease" }}>
          <CheckIcon />
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:"#e8e4dc", marginBottom:12 }}>
          {mode === "signup" ? "Account Created!" : "Welcome Back!"}
        </h2>
        <p style={{ color:"#7a7670", fontSize:15, lineHeight:1.7, marginBottom:32 }}>
          {mode === "signup" ? `Your ${role} account is ready. Redirecting to your dashboard…` : "Login successful. Redirecting…"}
        </p>
        <button onClick={() => { setDone(false); switchMode("login"); }}
          style={{ background:"linear-gradient(135deg,#c9a84c,#e8c97a)", color:"#08090d", border:"none", padding:"14px 36px", fontWeight:700, fontSize:14, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)" }}>
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#08090d", display:"flex", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        input::placeholder { color:#3a3830; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance:none; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#08090d; } ::-webkit-scrollbar-thumb { background:#c9a84c44; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes pop    { 0%{transform:scale(0.7)} 70%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
        .tab-btn { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; padding:14px 0; letter-spacing:0.05em; transition:color 0.25s; position:relative; }
        .role-card { border:1px solid rgba(201,168,76,0.15); padding:16px 18px; cursor:pointer; transition:all 0.25s; flex:1; display:flex; align-items:center; gap:12px; }
        .role-card.active { border-color:#c9a84c; background:rgba(201,168,76,0.07); }
        .role-card:hover:not(.active) { border-color:rgba(201,168,76,0.35); }
        .method-tab { flex:1; padding:10px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; letter-spacing:0.05em; transition:all 0.25s; }
        .social-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:10px; padding:13px; border:1px solid rgba(201,168,76,0.18); background:transparent; color:#9a9590; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.25s; }
        .social-btn:hover { border-color:#c9a84c; color:#e8e4dc; background:rgba(201,168,76,0.06); }
        @media(max-width:900px){ .left-panel{display:none!important} }
        @media(max-width:480px){ .form-card{padding:36px 24px!important} }
      `}</style>

      {/* ── LEFT DECORATIVE PANEL ── */}
      <div className="left-panel" style={{ width:"42%", background:"linear-gradient(160deg,#0c0e16 0%,#0f1117 100%)", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"52px 52px 48px" }}>
        {/* grid bg */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize:"52px 52px", pointerEvents:"none" }} />
        {/* glow */}
        <div style={{ position:"absolute", top:"30%", left:"30%", width:400, height:400, background:"radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 65%)", pointerEvents:"none" }} />

        {/* logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative" }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg,#c9a84c,#e8c97a)", clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🔧</div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:"#e8e4dc" }}>Fix<span style={{ color:"#c9a84c" }}>Right</span></span>
        </div>

        {/* main copy */}
        <div style={{ position:"relative" }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#c9a84c", marginBottom:20 }}>TRUSTED HOME SERVICES</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:44, fontWeight:900, lineHeight:1.08, letterSpacing:"-0.03em", color:"#e8e4dc", marginBottom:24 }}>
            Your Home.<br /><span style={{ color:"#c9a84c" }}>Our Craft.</span><br />Every Time.
          </h2>
          <p style={{ fontSize:15, lineHeight:1.75, color:"#7a7670", maxWidth:320 }}>
            Join 12,000+ homeowners and 450+ verified professionals on India's most trusted home services platform.
          </p>

          {/* mini feature list */}
          <div style={{ marginTop:40, display:"flex", flexDirection:"column", gap:16 }}>
            {["Background-checked & licensed pros","Real-time job tracking & updates","Fixed pricing — no hidden charges","24/7 emergency support line"].map(f => (
              <div key={f} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:22, height:22, border:"1px solid #c9a84c44", display:"flex", alignItems:"center", justifyContent:"center", color:"#c9a84c", flexShrink:0 }}><CheckIcon /></div>
                <span style={{ fontSize:14, color:"#9a9590" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom stats */}
        <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(201,168,76,0.12)", paddingTop:28, position:"relative" }}>
          {[["12K+","Jobs Done"],["98%","Satisfaction"],["450+","Experts"]].map(([v,l],i) => (
            <div key={l} style={{ flex:1, paddingRight:i<2?24:0, borderRight:i<2?"1px solid rgba(201,168,76,0.12)":"none", marginRight:i<2?24:0 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:800, color:"#c9a84c", lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:11, color:"#5a5650", marginTop:4, letterSpacing:"0.08em", textTransform:"uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", overflowY:"auto" }}>
        <div className="form-card" style={{ width:"100%", maxWidth:440, animation:"fadeUp 0.6s ease" }}>

          {/* ── MODE TABS ── */}
          <div style={{ display:"flex", borderBottom:"1px solid rgba(201,168,76,0.15)", marginBottom:36, gap:4 }}>
            {[["signup","Create Account"],["login","Sign In"]].map(([m,label]) => (
              <button key={m} className="tab-btn" onClick={() => switchMode(m)}
                style={{ color: mode===m ? "#c9a84c" : "#5a5650", flex:1 }}>
                {label}
                {mode===m && <div style={{ position:"absolute", bottom:-1, left:0, right:0, height:2, background:"#c9a84c", borderRadius:2 }} />}
              </button>
            ))}
          </div>

          {mode === "signup" ? (
            /* ════════ SIGN UP FORM ════════ */
            <div key="signup">
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:800, color:"#e8e4dc", marginBottom:6, letterSpacing:"-0.02em" }}>Create Account</h1>
              <p style={{ fontSize:13, color:"#7a7670", marginBottom:32 }}>Join FixRight and get started in minutes.</p>

              {/* ROLE */}
              <div style={{ marginBottom:22 }}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#9a9590", marginBottom:10 }}>I am a</p>
                <div style={{ display:"flex", gap:8 }}>
                  {[["user","🏠","Homeowner","Book services"],["provider","🔧","Pro / Provider","Offer services"]].map(([r,em,title,sub]) => (
                    <div key={r} className={`role-card${role===r?" active":""}`} onClick={() => setRole(r)}>
                      <span style={{ fontSize:20 }}>{em}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13, color: role===r?"#c9a84c":"#e8e4dc" }}>{title}</div>
                        <div style={{ fontSize:11, color:"#7a7670" }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NAME */}
              <Field label="Full Name" icon={<UserIcon />} error={errors.name}>
                <input value={form.name} onChange={e => set("name",e.target.value)}
                  onFocus={() => setFocus("name")} onBlur={() => setFocus(null)}
                  placeholder="e.g. Arjun Sharma"
                  style={fStyle("name")} />
              </Field>

              {/* EMAIL */}
              <Field label="Email Address" icon={<MailIcon />} error={errors.email}>
                <input type="email" value={form.email} onChange={e => set("email",e.target.value)}
                  onFocus={() => setFocus("email")} onBlur={() => setFocus(null)}
                  placeholder="you@example.com"
                  style={fStyle("email")} />
              </Field>

              {/* PHONE */}
              <Field label="Contact Number" icon={<PhoneIcon />} error={errors.phone}>
                <div style={{ position:"absolute", left:44, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#5a5650", pointerEvents:"none", fontFamily:"'DM Sans',sans-serif" }}>+91</div>
                <input type="tel" maxLength={10} value={form.phone} onChange={e => set("phone",e.target.value.replace(/\D/g,""))}
                  onFocus={() => setFocus("phone")} onBlur={() => setFocus(null)}
                  placeholder="98XXXXXXXX"
                  style={{ ...fStyle("phone"), paddingLeft:70 }} />
              </Field>

              {/* PASSWORD */}
              <Field label="Password" icon={<LockIcon />} error={errors.password}>
                <input type={showPwd?"text":"password"} value={form.password} onChange={e => set("password",e.target.value)}
                  onFocus={() => setFocus("password")} onBlur={() => setFocus(null)}
                  placeholder="Min. 8 characters"
                  style={{ ...fStyle("password"), paddingRight:48 }} />
                <button onClick={() => setShowPwd(p=>!p)} type="button"
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#5a5650", display:"flex" }}>
                  <EyeIcon open={showPwd} />
                </button>
              </Field>

              {/* strength bar */}
              {form.password && (
                <div style={{ marginTop:-10, marginBottom:18 }}>
                  <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex:1, height:3, background: i<=strength ? strengthColor : "#1a1a24", borderRadius:2, transition:"background 0.3s" }} />
                    ))}
                  </div>
                  <p style={{ fontSize:11, color:strengthColor, fontWeight:600 }}>{strengthLabel}</p>
                </div>
              )}

              {/* CONFIRM PASSWORD */}
              <Field label="Confirm Password" icon={<LockIcon />} error={errors.confirmPwd}>
                <input type={showCPwd?"text":"password"} value={form.confirmPwd} onChange={e => set("confirmPwd",e.target.value)}
                  onFocus={() => setFocus("confirmPwd")} onBlur={() => setFocus(null)}
                  placeholder="Re-enter password"
                  style={{ ...fStyle("confirmPwd"), paddingRight:48 }} />
                <button onClick={() => setShowCPwd(p=>!p)} type="button"
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#5a5650", display:"flex" }}>
                  <EyeIcon open={showCPwd} />
                </button>
              </Field>

              {/* T&C */}
              <p style={{ fontSize:12, color:"#5a5650", lineHeight:1.6, marginBottom:24 }}>
                By creating an account you agree to our{" "}
                <span style={{ color:"#c9a84c", cursor:"pointer" }}>Terms of Service</span> and{" "}
                <span style={{ color:"#c9a84c", cursor:"pointer" }}>Privacy Policy</span>.
              </p>

              <SubmitBtn onClick={handleSubmit} label={`Create ${role==="provider"?"Provider":"Homeowner"} Account`} />

              <p style={{ textAlign:"center", fontSize:13, color:"#5a5650", marginTop:24 }}>
                Already have an account?{" "}
                <span style={{ color:"#c9a84c", cursor:"pointer", fontWeight:600 }} onClick={() => switchMode("login")}>Sign In →</span>
              </p>
            </div>
          ) : (
            /* ════════ LOGIN FORM ════════ */
            <div key="login">
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:800, color:"#e8e4dc", marginBottom:6, letterSpacing:"-0.02em" }}>Welcome Back</h1>
              <p style={{ fontSize:13, color:"#7a7670", marginBottom:32 }}>Sign in to manage your bookings & services.</p>

              {/* METHOD TABS */}
              <div style={{ display:"flex", background:"#0c0e16", border:"1px solid rgba(201,168,76,0.15)", marginBottom:28, padding:4, gap:4 }}>
                {[["email","📧  Email"],["phone","📱  Phone"]].map(([m,label]) => (
                  <button key={m} className="method-tab"
                    onClick={() => { setLM(m); setErrors({}); }}
                    style={{
                      background: loginMethod===m ? "linear-gradient(135deg,#c9a84c,#e8c97a)" : "transparent",
                      color: loginMethod===m ? "#08090d" : "#7a7670",
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              {loginMethod === "email" ? (
                <Field label="Email Address" icon={<MailIcon />} error={errors.email}>
                  <input type="email" value={form.email} onChange={e => set("email",e.target.value)}
                    onFocus={() => setFocus("email")} onBlur={() => setFocus(null)}
                    placeholder="you@example.com"
                    style={fStyle("email")} />
                </Field>
              ) : (
                <Field label="Phone Number" icon={<PhoneIcon />} error={errors.phone}>
                  <div style={{ position:"absolute", left:44, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#5a5650", pointerEvents:"none", fontFamily:"'DM Sans',sans-serif" }}>+91</div>
                  <input type="tel" maxLength={10} value={form.phone} onChange={e => set("phone",e.target.value.replace(/\D/g,""))}
                    onFocus={() => setFocus("phone")} onBlur={() => setFocus(null)}
                    placeholder="98XXXXXXXX"
                    style={{ ...fStyle("phone"), paddingLeft:70 }} />
                </Field>
              )}

              <Field label="Password" icon={<LockIcon />} error={errors.password}>
                <input type={showPwd?"text":"password"} value={form.password} onChange={e => set("password",e.target.value)}
                  onFocus={() => setFocus("password")} onBlur={() => setFocus(null)}
                  placeholder="Enter your password"
                  style={{ ...fStyle("password"), paddingRight:48 }} />
                <button onClick={() => setShowPwd(p=>!p)} type="button"
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#5a5650", display:"flex" }}>
                  <EyeIcon open={showPwd} />
                </button>
              </Field>

              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:-8, marginBottom:28 }}>
                <span style={{ fontSize:12, color:"#c9a84c", cursor:"pointer", fontWeight:600 }}>Forgot Password?</span>
              </div>

              <SubmitBtn onClick={handleSubmit} label="Sign In to Dashboard" />

              {/* divider */}
              <div style={{ display:"flex", alignItems:"center", gap:16, margin:"28px 0" }}>
                <div style={{ flex:1, height:1, background:"rgba(201,168,76,0.1)" }} />
                <span style={{ fontSize:12, color:"#5a5650", whiteSpace:"nowrap" }}>or continue with</span>
                <div style={{ flex:1, height:1, background:"rgba(201,168,76,0.1)" }} />
              </div>

              {/* social */}
              <div style={{ display:"flex", gap:10 }}>
                <button className="social-btn">
                  <svg width={18} height={18} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button className="social-btn">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="#e8e4dc"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>

              <p style={{ textAlign:"center", fontSize:13, color:"#5a5650", marginTop:28 }}>
                Don't have an account?{" "}
                <span style={{ color:"#c9a84c", cursor:"pointer", fontWeight:600 }} onClick={() => switchMode("signup")}>Create one free →</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── gold submit button ─── */
function SubmitBtn({ onClick, label }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width:"100%", padding:"16px", border:"none", cursor:"pointer",
        background: hover ? "linear-gradient(135deg,#e8c97a,#c9a84c)" : "linear-gradient(135deg,#c9a84c,#e8c97a)",
        color:"#08090d",
        fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:14, letterSpacing:"0.12em", textTransform:"uppercase",
        clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 10px 36px rgba(201,168,76,0.4)" : "none",
        transition:"all 0.3s",
      }}>
      {label}
    </button>
  );
}
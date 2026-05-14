import { useEffect, useState } from "react";
import api from "./api/axios";
/* ─── Background decorative blobs (from your snippet) ─── */
function BgDecor() {
    return (
        <>
            <div
                className="blob-1"
                style={{
                    position: "fixed", top: "6%", right: "10%",
                    width: 260, height: 260, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(37,99,235,.1) 0%, transparent 70%)",
                    pointerEvents: "none", zIndex: 0,
                }}
            />
            <div
                className="blob-2"
                style={{
                    position: "fixed", bottom: "10%", left: "6%",
                    width: 200, height: 200, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(16,185,129,.1) 0%, transparent 70%)",
                    pointerEvents: "none", zIndex: 0,
                }}
            />
            <div
                style={{
                    position: "fixed", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 600, height: 600, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(37,99,235,.04) 0%, transparent 65%)",
                    pointerEvents: "none", zIndex: 0,
                }}
            />
        </>
    );
}

/* ─── Inline global CSS (animations + resets) ─── */
const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blob1 {
    0%,100% { transform: scale(1) translate(0,0); }
    50%     { transform: scale(1.1) translate(10px,-12px); }
  }
  @keyframes blob2 {
    0%,100% { transform: scale(1) translate(0,0); }
    50%     { transform: scale(0.9) translate(-8px,10px); }
  }
  @keyframes pop {
    0%   { transform: scale(.6); opacity: 0; }
    70%  { transform: scale(1.1); }
    100% { transform: scale(1);  opacity: 1; }
  }
  .blob-1 { animation: blob1 7s ease-in-out infinite; }
  .blob-2 { animation: blob2 9s ease-in-out infinite; }
  .card-in { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
  .success-pop { animation: pop .45s cubic-bezier(.22,1,.36,1) both; }
  .nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    cursor: pointer; font-size: 14px; font-weight: 500;
    color: rgba(255,255,255,.65);
    transition: background .18s, color .18s;
    text-decoration: none; border: none; background: transparent; width: 100%;
  }
  .nav-link:hover, .nav-link.active {
    background: rgba(255,255,255,.14); color: #fff;
  }
  .apply-btn {
    width: 100%; padding: 10px; border-radius: 10px;
    font-size: 14px; font-weight: 700; cursor: pointer; border: none;
    transition: transform .18s, box-shadow .18s, background .18s;
    font-family: inherit;
  }
  .apply-btn.idle {
    background: #2563eb; color: #fff;
    box-shadow: 0 4px 14px rgba(37,99,235,.28);
  }
  .apply-btn.idle:hover {
    background: #1d4ed8; transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(37,99,235,.38);
  }
  .apply-btn.done {
    background: #d1fae5; color: #065f46; cursor: default;
  }
  .tab-btn {
    padding: 6px 16px; border-radius: 20px; font-size: 13px;
    font-weight: 600; cursor: pointer; border: 1.5px solid transparent;
    background: transparent; color: #64748b; transition: all .18s;
    font-family: inherit;
  }
  .tab-btn.active {
    background: #2563eb; color: #fff; border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37,99,235,.25);
  }
  .tab-btn:not(.active):hover { border-color: #2563eb; color: #2563eb; }
  .svc-card {
    background: #fff;
    border-radius: 18px;
    padding: 22px;
    border: 1px solid rgba(226,232,240,.9);
    box-shadow: 0 2px 8px rgba(0,0,0,.04), 0 12px 32px rgba(0,0,0,.07);
    display: flex; flex-direction: column; gap: 10px;
    transition: transform .2s, box-shadow .2s;
    position: relative; overflow: hidden;
    animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both;
  }
  .svc-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,.1), 0 24px 48px rgba(0,0,0,.1);
  }
  .stat-card {
    background: #fff;
    border-radius: 16px;
    padding: 18px 20px;
    border: 1px solid rgba(226,232,240,.9);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both;
  }
  input[type=text]:focus { outline: none; }
  @media (max-width: 768px) {
    .sidebar { display: none !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
    .svc-grid  { grid-template-columns: 1fr !important; }
  }
`;

/* ─── Data ─── */
// const SERVICES = [
//   { id: 1, svcname: "Web Development",   description: "Build responsive websites and web apps for clients.",      price: 4500, cat: "tech",   slots: 3, icon: "💻" },
//   { id: 2, svcname: "AC Repair",         description: "Full AC servicing, gas refilling & fault diagnosis.",       price: 800,  cat: "home",   slots: 8, icon: "❄️" },
//   { id: 3, svcname: "Physiotherapy",     description: "In-home physio sessions for recovery and mobility.",        price: 1200, cat: "health", slots: 5, icon: "🦴" },
//   { id: 4, svcname: "Mobile App Dev",    description: "Native & cross-platform mobile app development.",           price: 6000, cat: "tech",   slots: 2, icon: "📱" },
//   { id: 5, svcname: "Plumbing",          description: "Pipe repair, installation, and leakage fixing.",            price: 600,  cat: "home",   slots: 10, icon: "🔧" },
//   { id: 6, svcname: "Yoga & Wellness",   description: "Personalised yoga sessions and wellness coaching.",         price: 900,  cat: "health", slots: 6, icon: "🧘" },
//   { id: 7, svcname: "UI/UX Design",      description: "User-friendly interfaces and experience flow design.",      price: 3500, cat: "tech",   slots: 4, icon: "🎨" },
//   { id: 8, svcname: "Electrical Work",   description: "Wiring, fixture installation, and electrical repair.",      price: 700,  cat: "home",   slots: 7, icon: "⚡" },
// ];

const CAT_COLORS = {
    all: { bg: "#eff6ff", text: "#1e40af", border: "rgba(37,99,235,.2)" },
    tech: { bg: "#eff6ff", text: "#1e40af", border: "rgba(37,99,235,.2)" },
    home: { bg: "#f0fdf4", text: "#166534", border: "rgba(16,185,129,.2)" },
    health: { bg: "#fff7ed", text: "#9a3412", border: "rgba(249,115,22,.2)" },
};

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, sub, subColor, delay }) {
    return (
        <div className="stat-card" style={{ animationDelay: delay }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-.02em" }}>{value}</div>
            {sub && <div style={{ fontSize: 12, marginTop: 5, fontWeight: 600, color: subColor || "#64748b" }}>{sub}</div>}
        </div>
    );
}

/* ─── Service Card ─── */
function ServiceCard({ service, isApplied, onApply, delay }) {
    const cc = CAT_COLORS[service.cat] || CAT_COLORS.tech;
    return (
        <div className="svc-card" style={{ animationDelay: delay }}>
            {/* accent strip */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #2563eb, #06b6d4)", borderRadius: "18px 18px 0 0" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ fontSize: 32, lineHeight: 1 }}>{service.icon}</div>
                <span style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                    background: cc.bg, color: cc.text, border: `1px solid ${cc.border}`,
                    textTransform: "capitalize",
                }}>
                    {service.cat}
                </span>
            </div>

            <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{service.svcname}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>{service.description}</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#2563eb" }}>₹{service.price.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>👥 {service.slots} slots</span>
            </div>

            <button
                className={`apply-btn ${isApplied ? "done success-pop" : "idle"}`}
                onClick={() => !isApplied && onApply(service.id)}
                disabled={isApplied}
            >
                {isApplied ? "✓ Applied" : "Apply Now"}
            </button>
        </div>
    );
}

/* ─── Main Dashboard ─── */
export default function ProviderDashboard() {
    const [services, setServices] = useState([]);
    const [applied, setApplied] = useState([]);
    const [activeNav, setActiveNav] = useState("services");
    const [activeCat, setActiveCat] = useState("all");
    const [search, setSearch] = useState("");

    /* Replace with your real API calls */
    useEffect(() => {

        const fetchServices = async () => {
            const res = await api.get('/services');
            console.log(res.data.service);
            setServices(res.data.service);
        };

        fetchServices();

    }, []);
    const applyService = async (id) => {
        // await api.post(`http://127.0.0.1:8000/api/apply-service/${id}`);
        setApplied((prev) => [...prev, id]);
    };

    const totalEarnings = services
        .filter((s) => applied.includes(s.id))
        .reduce((acc, s) => acc + s.price, 0);

    // const filtered = services.filter((s) => {
    //     const catOk = activeCat === "all" || s.cat === activeCat;
    //     const q = search.toLowerCase();
    //     const searchOk = !q || s.svcname.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    //     const navOk = activeNav === "applied" ? applied.includes(s.id) : true;
    //     return catOk && searchOk && navOk;
    // });

    const navItems = [
        { id: "services", label: "Dashboard", icon: "🏠" },
        { id: "services", label: "All Services", icon: "📋", badge: services.length },
        { id: "applied", label: "My Applications", icon: "✅", badge: applied.length || null },
        { id: "earnings", label: "Earnings", icon: "💰" },
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <>
            {/* Inject global CSS */}
            <style>{BASE_CSS}</style>

            {/* Page wrapper — your background gradient */}
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(150deg, #f0f7ff 0%, #f8fafc 55%, #f0fdf4 100%)",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                position: "relative",
                overflow: "hidden",
            }}>
                <BgDecor />

                {/* Layout */}
                <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1 }}>

                    {/* ── SIDEBAR ── */}
                    <aside className="sidebar" style={{
                        width: 230,
                        background: "linear-gradient(180deg, #1e3a5f 0%, #1e3a6e 100%)",
                        display: "flex",
                        flexDirection: "column",
                        flexShrink: 0,
                        boxShadow: "4px 0 24px rgba(0,0,0,.12)",
                    }}>
                        {/* Logo */}
                        <div style={{ padding: "24px 16px 16px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 18, boxShadow: "0 4px 12px rgba(37,99,235,.4)",
                                }}>🛠️</div>
                                <div>
                                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "-.01em" }}>ServiceHub</div>
                                    <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11 }}>Provider Portal</div>
                                </div>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav style={{ flex: 1, padding: "14px 10px" }}>
                            {navItems.map((item, i) => (
                                <button
                                    key={i}
                                    className={`nav-link ${activeNav === item.id && item.label !== "All Services" ? "active" : activeNav === "services" && item.label === "All Services" ? "active" : ""}`}
                                    onClick={() => setActiveNav(item.id)}
                                    style={{ marginBottom: 2 }}
                                >
                                    <span style={{ fontSize: 17 }}>{item.icon}</span>
                                    <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                                    {item.badge != null && (
                                        <span style={{
                                            background: "rgba(255,255,255,.18)", color: "#fff",
                                            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                                        }}>{item.badge}</span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* Provider info */}
                        <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0,
                                }}>{localStorage.getItem('name')?.[0].toUpperCase()}</div>
                                <div>
                                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{localStorage.getItem('name')}</div>
                                    <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11 }}>✔ Verified Provider</div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── MAIN ── */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

                        {/* Topbar */}
                        <header style={{
                            background: "rgba(255,255,255,.85)",
                            backdropFilter: "blur(12px)",
                            borderBottom: "1px solid rgba(226,232,240,.9)",
                            padding: "14px 28px",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            boxShadow: "0 1px 12px rgba(0,0,0,.06)",
                            position: "sticky", top: 0, zIndex: 10,
                        }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-.02em" }}>
                                    {activeNav === "applied" ? "My Applications" : "Available Services"}
                                </h2>
                                <p style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                                    {activeNav === "applied"
                                        ? `${applied.length} service${applied.length !== 1 ? "s" : ""} applied`
                                        : "Browse and apply for services"}
                                </p>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                {/* Search */}
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    background: "#f8fafc", border: "1.5px solid #e2e8f0",
                                    borderRadius: 12, padding: "8px 14px",
                                    boxShadow: "inset 0 1px 3px rgba(0,0,0,.04)",
                                }}>
                                    <span style={{ fontSize: 16, color: "#94a3b8" }}>🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search services…"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{
                                            border: "none", background: "transparent",
                                            fontSize: 14, color: "#0f172a", fontFamily: "inherit", width: 160,
                                        }}
                                    />
                                </div>

                                {/* Notif */}
                                <button style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    border: "1.5px solid #e2e8f0", background: "#fff",
                                    cursor: "pointer", fontSize: 18, display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    position: "relative", boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                                }}>
                                    🔔
                                    <span style={{
                                        position: "absolute", top: 6, right: 6,
                                        width: 8, height: 8, background: "#ef4444",
                                        borderRadius: "50%", border: "2px solid #fff",
                                    }} />
                                </button>

                                {/* Avatar */}
                                <div style={{
                                    width: 40, height: 40, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(37,99,235,.35)",
                                }}>{localStorage.getItem('name')?.[0].toUpperCase()}</div>
                            </div>
                        </header>

                        {/* Content */}
                        <main style={{ flex: 1, padding: "28px 28px", overflowY: "auto" }}>

                            {/* Stats */}
                            {activeNav !== "applied" && (
                                <div className="stats-grid" style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                    gap: 14,
                                    marginBottom: 28,
                                }}>
                                    <StatCard icon="📋" label="Total Services" value={services.length} sub="↑ 2 new this week" subColor="#16a34a" delay="0s" />
                                    <StatCard icon="✅" label="Applied" value={applied.length} sub={applied.length ? `${applied.length} pending review` : "None yet"} delay=".05s" />
                                    <StatCard icon="💰" label="Est. Earnings" value={`₹${totalEarnings.toLocaleString()}`} sub="Based on applied services" subColor="#2563eb" delay=".1s" />
                                    <StatCard icon="⭐" label="Profile Score" value="87%" sub="↑ 5% this month" subColor="#16a34a" delay=".15s" />
                                </div>
                            )}

                            <div>

                                <div style={{
                                    height: "5px",
                                    width: "100%",
                                    background: "#3b82f6",
                                    borderRadius: "10px",
                                    marginBottom: "12px"
                                }} />

                                <h2 style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    margin: 0
                                }}>
                                    Apply the Services
                                </h2>

                            </div>


                            {services.length === 0 ? (
                                <div style={{
                                    textAlign: "center",
                                    padding: "60px 20px",
                                    background: "#fff",
                                    borderRadius: 18,
                                    border: "1px solid rgba(226,232,240,.9)",
                                }}>
                                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>

                                    <div style={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: "#0f172a",
                                        marginBottom: 6
                                    }}>
                                        No services found
                                    </div>

                                    <div style={{ fontSize: 14, color: "#64748b" }}>
                                        No services available right now.
                                    </div>
                                </div>
                            ) : (

                                <div
                                    className="svc-grid"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                                        gap: 16,
                                    }}
                                >

                                    {services.map((service, i) => (
                                        <div
                                            key={service.id}
                                            style={{
                                                background: "linear-gradient(145deg, #ffffff, #f8fafc)",
                                                borderRadius: 22,
                                                padding: 22,
                                                border: "1px solid rgba(226,232,240,.9)",
                                                boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                                                transition: "0.3s ease",
                                                position: "relative",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                            }}

                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-6px)";
                                                e.currentTarget.style.boxShadow = "0 18px 40px rgba(15,23,42,0.14)";
                                            }}

                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0px)";
                                                e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,0.08)";
                                            }}
                                        >

                                            {/* Top Glow */}
                                            <div style={{
                                                position: "absolute",
                                                top: -40,
                                                right: -40,
                                                width: 120,
                                                height: 120,
                                                borderRadius: "50%",
                                                background: "rgba(59,130,246,0.08)",
                                            }} />

                                            {/* Icon */}
                                            <div style={{
                                                width: 62,
                                                height: 62,
                                                borderRadius: 18,
                                                background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 28,
                                                color: "#fff",
                                                marginBottom: 18,
                                                boxShadow: "0 10px 25px rgba(59,130,246,.35)"
                                            }}>
                                                ⚡
                                            </div>

                                            {/* Service Name */}
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: 22,
                                                fontWeight: 700,
                                                color: "#0f172a",
                                                marginBottom: 10,
                                                letterSpacing: "-0.3px"
                                            }}>
                                                {service.svcname}
                                            </h3>

                                            {/* Description */}
                                            {/* <p style={{
                                                fontSize: 14,
                                                color: "#64748b",
                                                lineHeight: 1.7,
                                                marginBottom: 20,
                                            }}>
                                                Professional and trusted service provider available for quick booking and reliable support.
                                            </p> */}

                                            {/* Footer */}
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: 10
                                            }}>

                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column"
                                                }}>
                                                    <span style={{
                                                        fontSize: 12,
                                                        color: "#94a3b8",
                                                        marginBottom: 3
                                                    }}>
                                                        Service ID
                                                    </span>

                                                    <span style={{
                                                        fontSize: 15,
                                                        fontWeight: 700,
                                                        color: "#0f172a"
                                                    }}>
                                                        #{service.id}
                                                    </span>
                                                </div>

                                                <button
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                                                        color: "#fff",
                                                        padding: "12px 18px",
                                                        borderRadius: 12,
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                        boxShadow: "0 8px 18px rgba(37,99,235,.28)",
                                                        transition: ".3s"
                                                    }}

                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = "scale(1.05)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = "scale(1)";
                                                    }}
                                                >
                                                    Apply
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}
                            {/* Filters */}
                            {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                                    {activeNav === "applied" ? `Applied Services (${applied.length})` : `All Services (${filtered.length})`}
                                </h3>
                                {activeNav !== "applied" && (
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {["all", "tech", "home", "health"].map((cat) => (
                                            <button
                                                key={cat}
                                                className={`tab-btn ${activeCat === cat ? "active" : ""}`}
                                                onClick={() => setActiveCat(cat)}
                                            >
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div> */}

                            {/* Service grid */}
                            {/* {filtered.length === 0 ? (
                                <div style={{
                                    textAlign: "center", padding: "60px 20px",
                                    background: "#fff", borderRadius: 18,
                                    border: "1px solid rgba(226,232,240,.9)",
                                }}>
                                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>No services found</div>
                                    <div style={{ fontSize: 14, color: "#64748b" }}>
                                        {activeNav === "applied" ? "You haven't applied to any services yet." : "Try adjusting your search or filter."}
                                    </div>
                                </div>
                            ) : (
                                <div className="svc-grid" style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                                    gap: 16,
                                }}> */}
                            {/* {filtered.map((service, i) => (
                                        <ServiceCard
                                            key={service.id}
                                            service={service}
                                            isApplied={applied.includes(service.id)}
                                            onApply={applyService}
                                            delay={`${i * 0.05}s`}
                                        />
                                    ))} */}
                            {/* </div>
                            )} */}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
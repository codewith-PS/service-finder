import { useEffect, useState, useRef } from "react";
import api from "./api/axios";

/* ─── Background decorative blobs ─── */
function BgDecor() {
    return (
        <>
            <div className="blob-1" style={{
                position: "fixed", top: "6%", right: "10%",
                width: 260, height: 260, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(37,99,235,.1) 0%, transparent 70%)",
                pointerEvents: "none", zIndex: 0,
            }} />
            <div className="blob-2" style={{
                position: "fixed", bottom: "10%", left: "6%",
                width: 200, height: 200, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(16,185,129,.1) 0%, transparent 70%)",
                pointerEvents: "none", zIndex: 0,
            }} />
            <div style={{
                position: "fixed", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 600, height: 600, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(37,99,235,.04) 0%, transparent 65%)",
                pointerEvents: "none", zIndex: 0,
            }} />
        </>
    );
}

/* ─── Global CSS ─── */
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

/* ─── localStorage helpers ─────────────────────────────────────
   Sirf applied service IDs save karte hain (per user).
   Key: "appliedServiceIds_<userId>" → JSON array of ids
────────────────────────────────────────────────────────────── */
const getStorageKey = () => {
    const uid = localStorage.getItem("id") || "guest";
    return `appliedServiceIds_${uid}`;
};

const loadAppliedIds = () => {
    try {
        return JSON.parse(localStorage.getItem(getStorageKey())) || [];
    } catch {
        return [];
    }
};

const saveAppliedIds = (ids) => {
    localStorage.setItem(getStorageKey(), JSON.stringify(ids));
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
function ServiceCardUI({ service, isApplied, onApply }) {
    return (
        <div
            style={{
                background: "linear-gradient(145deg, #ffffff, #f8fafc)",
                borderRadius: 22,
                padding: 22,
                border: isApplied ? "1.5px solid #86efac" : "1px solid rgba(226,232,240,.9)",
                boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
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
                position: "absolute", top: -40, right: -40,
                width: 120, height: 120, borderRadius: "50%",
                background: isApplied ? "rgba(34,197,94,0.08)" : "rgba(59,130,246,0.08)",
            }} />

            {/* Applied Badge */}
            {isApplied && (
                <div style={{
                    position: "absolute", top: 14, right: 14,
                    background: "#dcfce7", color: "#16a34a",
                    fontSize: 11, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 20, border: "1px solid #86efac",
                }}>
                    ✓ Applied
                </div>
            )}

            {/* Icon */}
            <div style={{
                width: 62, height: 62, borderRadius: 18,
                background: isApplied
                    ? "linear-gradient(135deg,#22c55e,#16a34a)"
                    : "linear-gradient(135deg,#3b82f6,#2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, color: "#fff", marginBottom: 18,
                boxShadow: isApplied
                    ? "0 10px 25px rgba(34,197,94,.35)"
                    : "0 10px 25px rgba(59,130,246,.35)",
            }}>
                ⚡
            </div>

            {/* Service Name */}
            <h3 style={{
                margin: 0, fontSize: 20, fontWeight: 700,
                color: "#0f172a", marginBottom: 10, letterSpacing: "-0.3px",
            }}>
                {service.svcname}
            </h3>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", marginBottom: 3 }}>Service ID</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>#{service.id}</span>
                </div>

                {isApplied ? (
                    <span style={{
                        fontSize: 13, fontWeight: 600, color: "#16a34a",
                        background: "#f0fdf4", padding: "8px 14px",
                        borderRadius: 10, border: "1px solid #86efac",
                    }}>
                        ✓ Applied
                    </span>
                ) : (
                    <button
                        onClick={() => onApply(service)}
                        style={{
                            border: "none", outline: "none",
                            background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                            color: "#fff", padding: "12px 18px", borderRadius: 12,
                            fontSize: 14, fontWeight: 600, cursor: "pointer",
                            boxShadow: "0 8px 18px rgba(37,99,235,.28)", transition: "transform .3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        Apply
                    </button>
                )}
            </div>
        </div>
    );
}

/* ─── Main Dashboard ─── */
export default function ProviderDashboard() {
    const [services, setServices] = useState([]);

    // ✅ applied: service objects — initially empty, phir services + localStorage se sync hoga
    const [applied, setApplied] = useState([]);
    // appliedIds: sirf IDs ka set — localStorage se seedha load
    const [appliedIds, setAppliedIds] = useState(() => new Set(loadAppliedIds()));

    const [activeNav, setActiveNav] = useState("services");
    const [search, setSearch] = useState("");

    // Apply modal state
    const [applyModal, setApplyModal] = useState({ open: false, service: null });
    const [applyLocation, setApplyLocation] = useState("");
    const [applyExperience, setApplyExperience] = useState("");
    const [applyLoading, setApplyLoading] = useState(false);

    // ─── Fetch Services ───────────────────────────────────────
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get("/services");
                const allServices = res.data.service;
                setServices(allServices);

                // Services aane ke baad, localStorage ke IDs se applied objects rebuild karo
                const savedIds = loadAppliedIds();
                if (savedIds.length > 0) {
                    const restoredApplied = allServices.filter((s) =>
                        savedIds.includes(s.id)
                    );
                    setApplied(restoredApplied);
                }
            } catch (err) {
                console.error("Services fetch failed:", err);
            }
        };
        fetchServices();
    }, []);

    // ─── Open / Close Modal ───────────────────────────────────
    const openApplyModal = (service) => {
        setApplyLocation("");
        setApplyExperience("");
        setApplyModal({ open: true, service });
    };

    const closeApplyModal = () => {
        setApplyModal({ open: false, service: null });
    };

    // ─── Submit Application ───────────────────────────────────
    const handleSubmitApplication = async () => {
        const { service } = applyModal;

        if (!applyLocation.trim() || !applyExperience) {
            alert("Please fill all fields!");
            return;
        }

        setApplyLoading(true);
        try {
            const payload = {
                user_id: localStorage.getItem("id"),
                service_id: service.id,
                location: applyLocation,
                experience: applyExperience,
            };

            console.log(payload);
            const res = await api.post("/providerservice", payload);

            // ✅ API success → state + localStorage dono update karo
            setApplied((prev) => {
                if (prev.find((s) => s.id === service.id)) return prev;
                return [...prev, service];
            });

            setAppliedIds((prev) => {
                const updated = new Set(prev);
                updated.add(service.id);
                saveAppliedIds([...updated]); // localStorage mein persist karo
                return updated;
            });

            closeApplyModal();
        } catch (err) {
            alert(err.response?.data?.message || "Application failed");
            // alert("Application failed. Please try again.");
        } finally {
            setApplyLoading(false);
        }
    };

    // console.log("appied", appliedIds);
    // ─── Derived ──────────────────────────────────────────────
    const totalEarnings = applied.reduce((acc, s) => acc + (s.price || 0), 0);

    const filteredServices = services.filter((s) => {
        const q = search.toLowerCase();
        return !q || s.svcname.toLowerCase().includes(q);
    });

    const navItems = [
        { id: "services", label: "Dashboard", icon: "🏠" },
        { id: "services", label: "All Services", icon: "📋", badge: services.length },
        { id: "applied", label: "My Applications", icon: "✅", badge: applied.length || null },
        { id: "earnings", label: "Earnings", icon: "💰" },
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "settings", label: "Settings", icon: "⚙️" },
    ];

    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        const handleOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
        };
    }, []);

    return (
        <>
            <style>{BASE_CSS}</style>

            {/* ─── Apply Modal ─── */}
            {applyModal.open && (
                <div
                    onClick={(e) => e.target === e.currentTarget && closeApplyModal()}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(10,20,50,.55)",
                        backdropFilter: "blur(6px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 200,
                    }}
                >
                    <div style={{
                        background: "#fff", borderRadius: 24,
                        padding: "32px 30px 28px",
                        width: "100%", maxWidth: 440,
                        boxShadow: "0 30px 80px rgba(10,20,50,.2)",
                        position: "relative",
                        animation: "fadeUp .35s cubic-bezier(.22,1,.36,1)",
                    }}>
                        {/* Close */}
                        <button
                            onClick={closeApplyModal}
                            style={{
                                position: "absolute", top: 18, right: 18,
                                width: 32, height: 32, borderRadius: 10,
                                border: "1.5px solid #e2e8f0", background: "#f8fafc",
                                cursor: "pointer", fontSize: 16, display: "flex",
                                alignItems: "center", justifyContent: "center", color: "#64748b",
                            }}
                        >✕</button>

                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 14,
                                background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 22, boxShadow: "0 8px 20px rgba(37,99,235,.35)",
                            }}>⚡</div>
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-.02em" }}>
                                    Apply for Service
                                </div>
                                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                                    {applyModal.service?.svcname}
                                </div>
                            </div>
                        </div>

                        {/* Auto-filled row */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                            {[
                                { label: "User ID", value: localStorage.getItem("id") || "N/A" },
                                { label: "Service ID", value: `#${applyModal.service?.id}` },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>
                                        {label}{" "}
                                        <span style={{ background: "#dbeafe", color: "#2563eb", fontSize: 10, padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>Auto</span>
                                    </div>
                                    <input
                                        readOnly
                                        value={value}
                                        style={{
                                            width: "100%", padding: "11px 13px",
                                            border: "1.5px solid #e2e8f0", borderRadius: 12,
                                            fontSize: 14, color: "#64748b", background: "#f1f5f9",
                                            fontFamily: "inherit", cursor: "not-allowed",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Location */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Location</div>
                            <input
                                type="text"
                                placeholder="e.g. Mumbai, Maharashtra"
                                value={applyLocation}
                                onChange={(e) => setApplyLocation(e.target.value)}
                                style={{
                                    width: "100%", padding: "11px 13px",
                                    border: "1.5px solid #e2e8f0", borderRadius: 12,
                                    fontSize: 14, color: "#0f172a", background: "#f8fafc",
                                    fontFamily: "inherit", outline: "none",
                                }}
                                onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,.12)"; }}
                                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                            />
                        </div>

                        {/* Experience */}
                        <div style={{ marginBottom: 22 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Experience</div>
                            <select
                                value={applyExperience}
                                onChange={(e) => setApplyExperience(e.target.value)}
                                style={{
                                    width: "100%", padding: "11px 13px",
                                    border: "1.5px solid #e2e8f0", borderRadius: 12,
                                    fontSize: 14, color: "#0f172a", background: "#f8fafc",
                                    fontFamily: "inherit", outline: "none", cursor: "pointer",
                                }}
                            >
                                <option value="">Select experience level</option>
                                <option value="fresher">Fresher (0–1 yr)</option>
                                <option value="junior">Junior (1–3 yrs)</option>
                                <option value="mid">Mid-level (3–5 yrs)</option>
                                <option value="senior">Senior (5+ yrs)</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmitApplication}
                            disabled={applyLoading}
                            style={{
                                width: "100%", padding: 14,
                                background: applyLoading ? "#93c5fd" : "linear-gradient(135deg,#3b82f6,#2563eb)",
                                color: "#fff", border: "none", borderRadius: 14,
                                fontSize: 15, fontWeight: 700,
                                cursor: applyLoading ? "not-allowed" : "pointer",
                                boxShadow: "0 8px 24px rgba(37,99,235,.3)",
                                fontFamily: "inherit", letterSpacing: "-.01em",
                                transition: "background .2s",
                            }}
                        >
                            {applyLoading ? "Submitting…" : "Submit Application →"}
                        </button>
                    </div>
                </div>
            )}

            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(150deg, #f0f7ff 0%, #f8fafc 55%, #f0fdf4 100%)",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                position: "relative", overflow: "hidden",
            }}>
                <BgDecor />

                <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1 }}>

                    {/* ── SIDEBAR ── */}
                    <aside className="sidebar" style={{
                        width: 230,
                        background: "linear-gradient(180deg, #1e3a5f 0%, #1e3a6e 100%)",
                        display: "flex", flexDirection: "column", flexShrink: 0,
                        boxShadow: "4px 0 24px rgba(0,0,0,.12)",
                    }}>
                        <div style={{ padding: "24px 16px 16px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 18, boxShadow: "0 4px 12px rgba(37,99,235,.4)",
                                }}>🛠️</div>
                                <div>
                                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "-.01em" }}>ServiceFinder</div>
                                    <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11 }}>Provider Portal</div>
                                </div>
                            </div>
                        </div>

                        <nav style={{ flex: 1, padding: "14px 10px" }}>
                            {navItems.map((item, i) => (
                                <button
                                    key={i}
                                    className={`nav-link ${activeNav === item.id && item.label !== "All Services"
                                        ? "active"
                                        : activeNav === "services" && item.label === "All Services"
                                            ? "active" : ""
                                        }`}
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

                        <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0,
                                }}>
                                    {localStorage.getItem("name")?.[0]?.toUpperCase() || ""}
                                </div>
                                <div>
                                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                                        {localStorage.getItem("name") || "Provider"}
                                    </div>
                                    <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11 }}>✔ Verified Provider</div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── MAIN ── */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

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

                                {/* <div style={{
                                    width: 40, height: 40, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(37,99,235,.35)",
                                }}>
                                    {localStorage.getItem("name")?.[0]?.toUpperCase() || ""}
                                </div> */}
                                <div
                                    ref={boxRef}
                                    onMouseEnter={() => setOpen(true)}
                                    onMouseLeave={() => setOpen(false)}
                                    style={{
                                        position: "relative",
                                        display: "inline-flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    {/* Avatar */}
                                    <div
                                        onClick={() => setOpen(!open)}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#fff",
                                            fontWeight: 800,
                                            fontSize: 14,
                                            cursor: "pointer",
                                            userSelect: "none",
                                            boxShadow: "0 2px 8px rgba(37,99,235,.35)",
                                        }}
                                    >
                                        {localStorage.getItem("name")?.[0]?.toUpperCase() || ""}
                                    </div>

                                    {/* Dropdown */}
                                    {open && (
                                        <div
                                            style={{
                                                marginTop: 8,
                                                background: "#fff",
                                                borderRadius: 10,
                                                padding: 8,
                                                minWidth: 120,
                                                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                                border: "1px solid #eee",
                                                zIndex: 100,
                                            }}
                                        >
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('role');
                                                    window.location.reload();
                                                }}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px 12px",
                                                    border: "none",
                                                    borderRadius: 8,
                                                    background: "#ef4444",
                                                    color: "#fff",
                                                    cursor: "pointer",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </header>

                        <main style={{ flex: 1, padding: "28px 28px", overflowY: "auto" }}>

                            {/* ══ ALL SERVICES TAB ══ */}
                            {activeNav !== "applied" && (
                                <>
                                    <div className="stats-grid" style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: 14, marginBottom: 28,
                                    }}>
                                        <StatCard icon="📋" label="Total Services" value={services.length} sub="↑ 2 new this week" subColor="#16a34a" delay="0s" />
                                        <StatCard icon="✅" label="Applied" value={applied.length} sub={applied.length ? `${applied.length} pending review` : "None yet"} delay=".05s" />
                                        <StatCard icon="💰" label="Est. Earnings" value={`₹${totalEarnings.toLocaleString()}`} sub="Based on applied services" subColor="#2563eb" delay=".1s" />
                                        <StatCard icon="⭐" label="Profile Score" value="87%" sub="↑ 5% this month" subColor="#16a34a" delay=".15s" />
                                    </div>

                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ height: 5, width: "100%", background: "#3b82f6", borderRadius: 10, marginBottom: 12 }} />
                                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Apply the Services</h2>
                                    </div>

                                    {filteredServices.length === 0 ? (
                                        <div style={{
                                            textAlign: "center", padding: "60px 20px",
                                            background: "#fff", borderRadius: 18,
                                            border: "1px solid rgba(226,232,240,.9)",
                                        }}>
                                            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>No services found</div>
                                            <div style={{ fontSize: 14, color: "#64748b" }}>No services available right now.</div>
                                        </div>
                                    ) : (
                                        <div className="svc-grid" style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                                            gap: 16,
                                        }}>
                                            {filteredServices.map((service) => (
                                                <ServiceCardUI
                                                    key={service.id}
                                                    service={service}
                                                    isApplied={appliedIds.has(service.id)}
                                                    onApply={openApplyModal}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ══ MY APPLICATIONS TAB ══ */}
                            {activeNav === "applied" && (
                                <>
                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ height: 5, width: "100%", background: "#22c55e", borderRadius: 10, marginBottom: 12 }} />
                                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                                            My Applications ({applied.length})
                                        </h2>
                                    </div>

                                    {applied.length === 0 ? (
                                        <div style={{
                                            textAlign: "center", padding: "60px 20px",
                                            background: "#fff", borderRadius: 18,
                                            border: "1px solid rgba(226,232,240,.9)",
                                        }}>
                                            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                                                No Applied Services Yet
                                            </div>
                                            <div style={{ fontSize: 14, color: "#64748b" }}>
                                                Go to All Services and apply to get started.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="svc-grid" style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                                            gap: 16,
                                        }}>
                                            {applied.map((service) => (
                                                <ServiceCardUI
                                                    key={service.id}
                                                    service={service}
                                                    isApplied={true}
                                                    onApply={() => { }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
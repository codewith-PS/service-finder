import { useState, useEffect } from "react";
import api from "./api/axios";

// ── DATA ──────────────────────────────────────────────────────────────────────
// const SERVICES = [
//     { id: 1, name: "Cleaning", icon: "🧹", color: "#34D399", desc: "Home & office", bookings: 24, rating: 4.8 },
//     { id: 2, name: "Plumbing", icon: "🔧", color: "#60A5FA", desc: "Pipes & leaks", bookings: 18, rating: 4.7 },
//     { id: 3, name: "Electrician", icon: "⚡", color: "#FBBF24", desc: "Wiring & fitting", bookings: 31, rating: 4.9 },
//     { id: 4, name: "Painting", icon: "🎨", color: "#F472B6", desc: "Interior & exterior", bookings: 12, rating: 4.6 },
//     { id: 5, name: "Carpentry", icon: "🪵", color: "#A78BFA", desc: "Furniture & repair", bookings: 9, rating: 4.5 },
//     { id: 6, name: "AC Repair", icon: "❄️", color: "#22D3EE", desc: "Service & gas refill", bookings: 27, rating: 4.8 },
// ];



// const PROVIDERS = {
//     1: [
//         { id: 101, name: "Sunita Devi", avatar: "SD", rating: 4.8, jobs: 312, price: "₹299/hr", badge: "Top Rated", exp: "5 yrs", area: "Noida, Delhi" },
//         { id: 102, name: "CleanPro Services", avatar: "CP", rating: 4.6, jobs: 189, price: "₹349/hr", badge: "Verified", exp: "3 yrs", area: "Gurgaon" },
//         { id: 103, name: "Ramesh Kumar", avatar: "RK", rating: 4.5, jobs: 98, price: "₹249/hr", badge: null, exp: "2 yrs", area: "Faridabad" },
//     ],
//     2: [
//         { id: 201, name: "PipeFix Co.", avatar: "PF", rating: 4.9, jobs: 431, price: "₹399/hr", badge: "Top Rated", exp: "7 yrs", area: "Delhi NCR" },
//         { id: 202, name: "Suresh Plumber", avatar: "SP", rating: 4.7, jobs: 207, price: "₹349/hr", badge: "Verified", exp: "4 yrs", area: "Noida" },
//         { id: 203, name: "QuickFlow Services", avatar: "QF", rating: 4.4, jobs: 155, price: "₹299/hr", badge: null, exp: "2 yrs", area: "Ghaziabad" },
//     ],
//     3: [
//         { id: 301, name: "Bright Sparks", avatar: "BS", rating: 4.9, jobs: 520, price: "₹449/hr", badge: "Top Rated", exp: "8 yrs", area: "Pan Delhi" },
//         { id: 302, name: "Vikram Electricals", avatar: "VE", rating: 4.6, jobs: 340, price: "₹379/hr", badge: "Verified", exp: "5 yrs", area: "Noida" },
//         { id: 303, name: "PowerOn Services", avatar: "PS", rating: 4.3, jobs: 110, price: "₹329/hr", badge: null, exp: "2 yrs", area: "Greater Noida" },
//     ],
//     4: [
//         { id: 401, name: "ColorCraft Studio", avatar: "CC", rating: 4.8, jobs: 278, price: "₹499/hr", badge: "Top Rated", exp: "6 yrs", area: "South Delhi" },
//         { id: 402, name: "Mohan Painter", avatar: "MP", rating: 4.5, jobs: 194, price: "₹399/hr", badge: "Verified", exp: "4 yrs", area: "West Delhi" },
//     ],
//     5: [
//         { id: 501, name: "WoodWorks", avatar: "WW", rating: 4.7, jobs: 162, price: "₹549/hr", badge: "Top Rated", exp: "9 yrs", area: "Delhi NCR" },
//         { id: 502, name: "Ajay Carpenter", avatar: "AC", rating: 4.5, jobs: 89, price: "₹449/hr", badge: null, exp: "3 yrs", area: "Gurgaon" },
//     ],
//     6: [
//         { id: 601, name: "CoolAir Experts", avatar: "CE", rating: 4.9, jobs: 612, price: "₹599/hr", badge: "Top Rated", exp: "10 yrs", area: "Pan NCR" },
//         { id: 602, name: "FreezeFix", avatar: "FF", rating: 4.6, jobs: 321, price: "₹499/hr", badge: "Verified", exp: "5 yrs", area: "Noida" },
//         { id: 603, name: "Ravi AC Repair", avatar: "RA", rating: 4.4, jobs: 143, price: "₹449/hr", badge: null, exp: "3 yrs", area: "Ghaziabad" },
//     ],
// };

const NAV = [
    //   { id: "dashboard", icon: "⊞",  label: "Dashboard" },
    { id: "services", icon: "✦", label: "Services" },
    { id: "bookings", icon: "🗒️", label: "My Bookings" },
    { id: "profile", icon: "◎", label: "Profile" },
];

const STATS = [
    { label: "Total Bookings", value: "47", icon: "🗒️", color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Active Services", value: "6", icon: "✦", color: "#10B981", bg: "#ECFDF5" },
    { label: "Saved Providers", value: "12", icon: "♥", color: "#EC4899", bg: "#FDF2F8" },
    { label: "Avg. Rating", value: "4.8", icon: "★", color: "#F59E0B", bg: "#FFFBEB" },
];

function Stars({ r }) {
    return <span style={{ color: "#F59E0B", fontSize: 12, letterSpacing: 1 }}>{"★".repeat(Math.floor(r))}{"☆".repeat(5 - Math.floor(r))}</span>;
}

function ProviderModal({ service, onClose, providers, handleBooking }) {
    const [booked, setBooked] = useState({});
    // const providers = PROVIDERS[service.id] || [];
    return (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 560, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", overflow: "hidden", animation: "fadeUp 0.28s ease both", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {/* Header */}
                <div style={{ padding: "22px 24px", background: `linear-gradient(135deg, ${service.color}18, ${service.color}06)`, borderBottom: `2px solid ${service.color}25`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 14, background: service.color + "30", border: `2px solid ${service.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{service.icon}</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 19, color: "#0F172A" }}>{service.name}</div>
                            <div style={{ color: "#64748B", fontSize: 13 }}>{providers.length} providers available</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", borderRadius: 10, width: 34, height: 34, cursor: "pointer", fontSize: 14, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
                {/* List */}

                <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12, maxHeight: 430, overflowY: "auto" }}>
                    {providers.map((p, i) => (
                        <div key={p.id} style={{
                            display: "flex", alignItems: "center", gap: 14,
                            background: "#F8FAFC", borderRadius: 14,
                            padding: "14px 16px", border: "1px solid #F1F5F9",
                            animation: `fadeUp 0.35s ease ${i * 0.07}s both`
                        }}>
                            {/* Avatar */}
                            <div style={{
                                width: 44, height: 44, borderRadius: "50%",
                                background: service.color + "35",
                                border: `2px solid ${service.color}`,
                                display: "flex", alignItems: "center",
                                justifyContent: "center", fontWeight: 800,
                                fontSize: 14, color: "#0F172A", flexShrink: 0
                            }}>
                                {p.user.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                                    <span style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>
                                        {p.user.name}
                                    </span>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700,
                                        padding: "2px 8px", borderRadius: 20,
                                        background: service.color + "20", color: "#374151",
                                        border: `1px solid ${service.color}45`
                                    }}>
                                        {p.experience}
                                    </span>
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 5 }}>
                                    <span style={{ fontSize: 12, color: "#94A3B8" }}>📍 {p.location}</span>
                                    <span style={{ fontSize: 12, color: "#94A3B8" }}>📞 {p.user.contactno}</span>
                                    <span style={{ fontSize: 12, color: "#94A3B8" }}>✉️ {p.user.email}</span>
                                    <span style={{ fontSize: 12, color: service.color, fontWeight: 700 }}>🔧 {p.service.svcname}</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                                <button
                                    onClick={() => handleBooking(p.id)}
                                    disabled={booked}
                                    style={{
                                        background: booked[p.id] ? "#D1FAE5" : "#475569",
                                        color: booked[p.id] ? "#065F46" : "#fff",
                                        border: "1px solid #E2E8F0", borderRadius: 10,
                                        padding: "8px 14px", fontWeight: 700,
                                        fontSize: 12, cursor: "pointer",
                                        whiteSpace: "nowrap", transition: "all 0.2s"
                                    }}
                                >
                                    {booked[p.id] ? "✓ Booked" : "Book Now"}
                                </button>
                                {/* <button
                                    onClick={() => window.open(`tel:${p.user.contactno}`)}
                                    style={{
                                        background: "#F1F5F9", color: "#475569",
                                        border: "1px solid #E2E8F0", borderRadius: 10,
                                        padding: "8px 14px", fontSize: 12,
                                        cursor: "pointer", whiteSpace: "nowrap"
                                    }}
                                >
                                    📞 Contact
                                </button> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [activeNav, setActiveNav] = useState("dashboard");
    const [selectedService, setSelectedService] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [loggedOut, setLoggedOut] = useState(false);
    const [service, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [booked, setBooked] = useState(false);
    const [providerLoading, setProviderLoading] = useState(false);


    const handleBooking = async (providerId) => {

        const user_id = localStorage.getItem('id');

        const bookingData = {
            user_id: user_id,
            provider_id: providerId,
            service_id: selectedService.id,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };

        // console.log(bookingData);

        try {

            const res = await api.post('/booking', bookingData);

            console.log(res.data);
            if (res.status === 201) {
                setBooked(true);
            }

            // alert("Booking Request Sent");
        } catch (err) {

            console.log(err.response?.data || err);
        }
    };
    useEffect(() => {
        // console.log(localStorage.getItem('token'));
        api.get('/services')
            .then((res) => {
                setServices(res.data.service);
                // console.log(res.data.service);
            })
            .catch((err) => {
                console.log(err.response?.data || "Error");
            })
    }, []);

    const getProviders = (id) => {
        setProviderLoading(true);
        setProviders([]);
        api.get(`/getprovideruser/${id}`)
            .then((res) => {
                console.log(res.data.providers);
                setProviders(res.data.providers);
            })
            .catch((err) => {
                console.log(err.response?.data || "Error");
            });
    };

    if (loggedOut) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F1F5F9", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <div style={{ background: "#fff", borderRadius: 24, padding: "52px 60px", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", animation: "fadeUp 0.4s ease both" }}>
                <div style={{ fontSize: 52 }}>👋</div>
                <h2 style={{ margin: "14px 0 6px", color: "#0F172A", fontWeight: 800 }}>Aap logout ho gaye!</h2>
                <p style={{ color: "#94A3B8", marginBottom: 28 }}>Dobara milte hain.</p>
                <button onClick={() => setLoggedOut(false)} style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 14, padding: "12px 36px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Login karein</button>
            </div>
        </div>
    );

    const sw = collapsed ? 68 : 232;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
        input:focus { outline:none; }
      `}</style>

            {/* ── SIDEBAR ── */}
            <aside style={{ width: sw, background: "#fff", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", transition: "width 0.22s ease", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden", boxShadow: "2px 0 12px rgba(0,0,0,0.04)", zIndex: 10 }}>
                {/* Logo Row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 14px", borderBottom: "1px solid #F1F5F9", minHeight: 64 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#3B82F6,#34D399)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 17, fontWeight: 900, flexShrink: 0 }}>⚙</div>
                    {!collapsed && <span style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", whiteSpace: "nowrap", flex: 1 }}>ServiceFinder</span>}
                    <button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: 11, padding: 4, marginLeft: "auto", flexShrink: 0 }}>
                        {collapsed ? "▶" : "◀"}
                    </button>
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
                    {NAV.map(n => {
                        const active = activeNav === n.id;
                        return (
                            <button key={n.id} onClick={() => setActiveNav(n.id)} title={n.label} style={{ display: "flex", alignItems: "center", gap: 10, background: active ? "#EFF6FF" : "transparent", color: active ? "#3B82F6" : "#64748B", border: active ? "1px solid #BFDBFE" : "1px solid transparent", borderRadius: 11, padding: collapsed ? "11px" : "10px 13px", cursor: "pointer", transition: "all 0.15s", width: "100%", justifyContent: collapsed ? "center" : "flex-start", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                                <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                                {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 700 : 600 }}>{n.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div style={{ padding: "10px", borderTop: "1px solid #F1F5F9" }}>
                    {!collapsed ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8FAFC", borderRadius: 12, padding: "10px 12px" }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#34D399)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{localStorage.getItem("name")?.[0]?.toUpperCase()}</div>
                            <div style={{ flex: 1, overflow: "hidden" }}>
                                <div style={{ fontWeight: 700, fontSize: 12, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{localStorage.getItem('name')}</div>
                                <div style={{ fontSize: 10, color: "#94A3B8" }}>Premium</div>
                            </div>
                            <button onClick={() => setLoggedOut(true)} title="Logout" style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", flexShrink: 0 }}>🚪</button>
                        </div>
                    ) : (
                        <button onClick={() => setLoggedOut(true)} title="Logout" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, width: "100%", padding: "8px 0", display: "flex", justifyContent: "center" }}>🚪</button>
                    )}
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

                {/* Top Bar */}
                <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 9, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div>
                        <h1 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                            {activeNav === "dashboard" && "Dashboard"}{activeNav === "services" && "Services"}{activeNav === "bookings" && "My Bookings"}{activeNav === "profile" && "Profile"}
                        </h1>
                        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>Hello {localStorage.getItem("name")} 🙏</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 11, padding: "8px 14px" }}>
                            <span style={{ color: "#94A3B8", fontSize: 14 }}>🔍</span>
                            <input placeholder="Search..." style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", background: "transparent", width: 140, fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
                        </div>
                        <div style={{ position: "relative", cursor: "pointer", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 11, padding: "8px 14px", fontSize: 16 }}>
                            🔔<span style={{ width: 7, height: 7, background: "#EF4444", borderRadius: "50%", position: "absolute", top: 8, right: 9, display: "block" }} />
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#34D399)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>{localStorage.getItem("name")?.[0]?.toUpperCase()}</div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, padding: "26px 28px", overflowY: "auto" }}>

                    {/* ── DASHBOARD ── */}
                    {/* {activeNav === "dashboard" && (
                        <div style={{ animation: "fadeUp 0.4s ease both" }}> */}
                    {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 16, marginBottom: 26 }}>
                                {STATS.map((s, i) => (
                                    <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9", animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
                                        <div style={{ width: 46, height: 46, borderRadius: 13, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                                        <div>
                                            <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{s.value}</div>
                                            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600, marginTop: 3 }}>{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div> */}


                    {/* <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}> */}
                    {/* Services */}
                    {/* <div style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                        <h2 style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>Quick Services</h2>
                                        <button onClick={() => setActiveNav("services")} style={{ background: "none", border: "none", color: "#3B82F6", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>View All →</button>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {SERVICES.map((svc, i) => (
                                            <div key={svc.id} onClick={() => setSelectedService(svc)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, cursor: "pointer", border: `1px solid ${svc.color}28`, background: svc.color + "08", transition: "transform 0.15s,box-shadow 0.15s", animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${svc.color}25` }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}>
                                                <div style={{ width: 38, height: 38, borderRadius: 10, background: svc.color + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{svc.icon}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0F172A" }}>{svc.name}</div>
                                                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{svc.desc}</div>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: svc.color }}>{svc.bookings}</div>
                                                    <div style={{ fontSize: 10, color: "#CBD5E1" }}>bookings</div>
                                                </div>
                                                <span style={{ fontSize: 12, color: svc.color, fontWeight: 700 }}>→</span>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}

                    {/* Recent Activity */}
                    {/* <div style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" }}>
                                    <h2 style={{ fontWeight: 800, fontSize: 16, color: "#0F172A", marginBottom: 16 }}>Recent Activity</h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                        {[
                                            { svc: "Cleaning", prov: "Sunita Devi", status: "Completed", date: "Today, 10 AM", color: "#34D399", icon: "🧹" },
                                            { svc: "Electrician", prov: "Bright Sparks", status: "Upcoming", date: "Tomorrow, 2 PM", color: "#FBBF24", icon: "⚡" },
                                            { svc: "Plumbing", prov: "PipeFix Co.", status: "Completed", date: "2 days ago", color: "#60A5FA", icon: "🔧" },
                                            { svc: "AC Repair", prov: "CoolAir Experts", status: "Cancelled", date: "4 days ago", color: "#EF4444", icon: "❄️" },
                                        ].map((a, i, arr) => (
                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                                                <div style={{ width: 34, height: 34, borderRadius: 9, background: a.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{a.icon}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 600, fontSize: 13, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.svc}</div>
                                                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{a.date}</div>
                                                </div>
                                                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: a.status === "Cancelled" ? "#FEE2E2" : a.color + "18", color: a.status === "Cancelled" ? "#EF4444" : a.color, whiteSpace: "nowrap" }}>{a.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                    {/* </div> */}
                    {/* </div> */}
                    {/* )} */}

                    {/* ── SERVICES ── */}
                    {activeNav === "services" && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 18, animation: "fadeUp 0.4s ease both" }}>
                            {/* {service.map((svc, i) => (
                                <div key={svc.id} onClick={() => setSelectedService(svc)} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 14px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", transition: "transform 0.2s,box-shadow 0.2s", animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 14px 36px ${svc.color}28` }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 14px rgba(0,0,0,0.05)" }}>
                                    <div style={{ height: 100, background: `linear-gradient(135deg,${svc.color}25,${svc.color}0a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, borderBottom: `2px solid ${svc.color}25` }}>{svc.icon}</div>
                                    <div style={{ padding: "16px 18px 18px" }}>
                                        <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A" }}>{svc.svcname}</div>
                                        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>{svc.desc}</div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                                            <button style={{ background: svc.color, color: "#fff", border: "none", borderRadius: 9, padding: "6px 13px", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>See Providers</button>
                                        </div>
                                    </div>
                                </div>
                            ))} */}

                            {service.map((svc, i) => (
                                <div
                                    key={svc.id}
                                    onClick={() => {
                                        setSelectedService(svc);
                                        getProviders(svc.id);
                                    }}
                                    style={{
                                        position: "relative",
                                        background: "#fff",
                                        borderRadius: 20,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        border: "1px solid #E2E8F0",
                                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                                        transition: "all 0.3s ease",
                                        animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-6px)";
                                        e.currentTarget.style.boxShadow = `0 16px 35px ${svc.color}25`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                            "0 4px 14px rgba(0,0,0,0.06)";
                                    }}
                                >
                                    {/* Top Accent Bar */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: "4px",
                                            background: `linear-gradient(90deg, ${svc.color}, #6366F1)`,
                                        }}
                                    />

                                    {/* Icon Section */}
                                    <div
                                        style={{
                                            height: 20,
                                            background: `linear-gradient(135deg, ${svc.color}18, ${svc.color}08)`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderBottom: `1px solid ${svc.color}20`,
                                            position: "relative",
                                        }}
                                    >
                                        {/* <div
                                            style={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 18,
                                                background: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 34,
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                            }}
                                        >
                                            {svc.icon}
                                        </div> */}

                                        {/* Popular Badge */}
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: 14,
                                                right: 14,
                                                background: "#DCFCE7",
                                                color: "#15803D",
                                                fontSize: "10px",
                                                fontWeight: "700",
                                                padding: "5px 10px",
                                                borderRadius: "999px",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            Popular
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: "18px" }}>
                                        <div
                                            style={{
                                                fontWeight: 800,
                                                fontSize: 16,
                                                color: "#0F172A",
                                                marginBottom: 5,
                                            }}
                                        >
                                            {svc.svcname}
                                        </div>

                                        {/* <div
                                            style={{
                                                fontSize: 13,
                                                color: "#64748B",
                                                lineHeight: 1.5,
                                                minHeight: 38,
                                            }}
                                        >
                                            {svc.desc}
                                        </div> */}

                                        {/* Footer */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: 18,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    color: "#94A3B8",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                ID: {svc.id}
                                            </span>

                                            {/* Providers Button Same */}
                                            <button
                                                style={{
                                                    backgroundColor: 'blue',
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: 9,
                                                    padding: "6px 13px",
                                                    fontWeight: 700,
                                                    fontSize: 11,
                                                    cursor: "pointer",
                                                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                                                }}
                                            >
                                                See Providers
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── BOOKINGS ── */}
                    {activeNav === "bookings" && (
                        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9", overflow: "hidden", animation: "fadeUp 0.4s ease both" }}>
                            <div style={{ padding: "18px 22px", borderBottom: "1px solid #F1F5F9" }}>
                                <h2 style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>All Bookings</h2>
                            </div>
                            {[
                                { svc: "Cleaning", icon: "🧹", color: "#34D399", prov: "Sunita Devi", status: "Completed", date: "19 May 2025, 10:00 AM", price: "₹598" },
                                { svc: "Electrician", icon: "⚡", color: "#FBBF24", prov: "Bright Sparks", status: "Upcoming", date: "20 May 2025, 2:00 PM", price: "₹898" },
                                { svc: "Plumbing", icon: "🔧", color: "#60A5FA", prov: "PipeFix Co.", status: "Completed", date: "17 May 2025, 11:00 AM", price: "₹798" },
                                { svc: "AC Repair", icon: "❄️", color: "#22D3EE", prov: "CoolAir Experts", status: "Cancelled", date: "15 May 2025, 9:00 AM", price: "₹1,198" },
                            ].map((b, i, arr) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", borderBottom: i < arr.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: b.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{b.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{b.svc}</div>
                                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{b.prov} · {b.date}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A" }}>{b.price}</div>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginTop: 4, display: "inline-block", background: b.status === "Cancelled" ? "#FEE2E2" : b.color + "18", color: b.status === "Cancelled" ? "#EF4444" : b.color }}>{b.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── PROFILE ── */}
                    {activeNav === "profile" && (
                        <div style={{ maxWidth: 520, animation: "fadeUp 0.4s ease both" }}>
                            <div style={{ background: "#fff", borderRadius: 20, padding: "28px 30px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" }}>
                                <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #F1F5F9" }}>
                                    <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#34D399)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 22 }}>AS</div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: 20, color: "#0F172A" }}>Arjun Sharma</div>
                                        <div style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>arjun@example.com</div>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#EFF6FF", color: "#2563EB", marginTop: 6, display: "inline-block" }}>Premium User</span>
                                    </div>
                                </div>
                                {[["📞 Phone", "+91 98765 43210"], ["📍 Location", "Ghaziabad, UP"], ["🗓️ Member Since", "Jan 2024"], ["📦 Total Bookings", "47"]].map(([k, v]) => (
                                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid #F8FAFC" }}>
                                        <span style={{ color: "#64748B", fontSize: 14 }}>{k}</span>
                                        <span style={{ fontWeight: 600, color: "#0F172A", fontSize: 14 }}>{v}</span>
                                    </div>
                                ))}
                                <button onClick={() => setLoggedOut(true)} style={{ marginTop: 24, width: "100%", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", borderRadius: 13, padding: "13px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    )}

                </main>
            </div >

            {/* Modal */}
            {selectedService && <ProviderModal service={selectedService} onClose={() => setSelectedService(null)} providers={providers} handleBooking={handleBooking} />}
        </div >
    );
}
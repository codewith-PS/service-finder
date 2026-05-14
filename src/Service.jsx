import { useEffect, useState } from "react";
import axios from "axios";
import api from "./api/axios";


function ServiceCard({ service }) {
    return (
        <div style={{
            background: "#fff",
            border: "1.5px solid #f1f5f9",
            borderRadius: 18,
            padding: "26px 22px 22px",
            height: "100%",
        }}>
            <div style={{ ...styles.cardBadge, background: service.bg, color: service.color }}>
                {service.badge}
            </div>
            <div style={{ ...styles.iconWrap, background: service.bg }}>{service.icon}</div>
            <div style={styles.cardTitle}>{service.title}</div>
            <div style={styles.cardDesc}>{service.desc}</div>
            <div style={styles.cardMeta}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>{service.rating}</span>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>From {service.price}</span>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>⏱ {service.time}</span>
            </div>
        </div>
    );
}

export default function Services() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [services, setServices] = useState([]);
    // const filtered = SERVICES.filter((s) => {
    //     const matchCat = activeFilter === "All" || s.category === activeFilter;
    //     const matchQ = !search ||
    //         s.title.toLowerCase().includes(search.toLowerCase()) ||
    //         s.desc.toLowerCase().includes(search.toLowerCase());
    //     return matchCat && matchQ;
    // }); 

    useEffect(() => {
        // console.log(localStorage.getItem('token'));
        api.get('http://127.0.0.1:8000/api/services')
            .then((res) => {
                setServices(res.data.service);
                // console.log(res.data.service);
            })
            .catch((err) => {
                console.log(err.response?.data || "Error");
            })
    }, []);

    return (
        <>
            <div style={styles.page}>
                <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .services-grid { 
          display: grid; 
          grid-template-columns: repeat(4,1fr); 
          gap: 20px; 
          max-width: 1200px; 
          margin: 24px auto 0; 
          padding: 0 24px 80px;
        }
        @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 560px) { .services-grid { grid-template-columns: 1fr !important; } }
      `}</style>

                <div style={styles.pageHeader}>
                    <h1 style={styles.pageTitle}>All Services</h1>
                    <p style={styles.pageSubtitle}>Professional home services across India</p>
                </div>

                <div style={styles.controls}>
                    <div style={styles.searchWrap}>
                        <span style={{ padding: "0 12px", color: "#94a3b8", fontSize: 18 }}>🔍</span>
                        <input
                            style={styles.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search services..."
                        />
                    </div>

                    <button
                        style={{
                            ...styles.filterBtn,
                            background: activeFilter === "All" ? "#2563eb" : "#fff",
                            color: activeFilter === "All" ? "#fff" : "#475569",
                            borderColor: activeFilter === "All" ? "#2563eb" : "#e2e8f0",
                        }}
                        onClick={() => setActiveFilter("All")}
                    >
                        All Services
                    </button>
                </div>

                <div style={styles.resultsBar}>
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                        Showing {services.length}
                    </span>
                </div>



                {/* <div className="services-grid"> */}
                {/* {filtered.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
                {filtered.length === 0 && (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                        <div style={{ fontSize: 48 }}>🔍</div>
                        <div style={{ fontWeight: 700, fontSize: 18, marginTop: 16, color: "#475569" }}>No services found</div>
                    </div>
                )} */}
                {/* {services.map((service) => (
                    <div key={service.id} style={styles.card}>

                        <h2 style={styles.title}>{service.svcname}</h2>

                        <p style={styles.text}>
                            {service.description || "No description available"}
                        </p>

                        <p style={styles.price}>
                            💰 Price: ₹{service.price}
                        </p>

                    </div>
                ))}
            </div> */}

                {/* <div className="flex flex-wrap gap-6 justify-evenly p-[90px]">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="w-64 rounded-2xl overflow-hidden shadow-xl transform transition duration-300 hover:-translate-y-2 hover:scale-105 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white"
                    >
                        <div className="p-5 h-40">

                            <h5 className="text-lg font-bold mb-2">
                                {service.svcname}
                            </h5>

                            <p className="text-sm opacity-90 mb-4">
                                {service.description || "Modern service card with beautiful UI design."}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="font-semibold">
                                    ₹{service.price}
                                </span>

                                <a
                                    href="#"
                                    className="bg-white text-purple-600 px-4 py-1.5 rounded-full font-medium hover:bg-yellow-300 hover:text-black transition"
                                >
                                    View →
                                </a>
                            </div>

                        </div>
                    </div>
                ))}
            </div> */}

                {/* <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
                {services.map((service) => (
                    <div key={service.id} className="service-card"
                        style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 16, padding: "28px 20px", cursor: "pointer" }}>
                        <div style={{ width: 52, height: 52, background: bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{icon}</div>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{service.svcname}</h3>
                        <p style={{ color: "#64748b", fontSize: 13.5, marginTop: 6, lineHeight: 1.6 }}>{desc}</p>
                        <div style={{ marginTop: 16, color, fontWeight: 700, fontSize: 13 }}>Book now →</div>
                    </div>
                </div> */}
                <div
                    style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '40px' }}
                >
                    {services.length > 0 ? (
                        services.map((service) => (
                            <div
                                key={service.id}
                                className="group relative bg-white rounded-2xl p-5
                                flex flex-col gap-3.5 overflow-hidden
                                transition-all duration-300
                                hover:-translate-y-1.5 hover:shadow-xl
                                cursor-pointer w-[280px]
                                border border-gray-100 shadow-md"
                            >
                                {/* Top accent bar */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-none" />

                                {/* Icon + Badge row */}
                                <div className="flex items-start justify-between">
                                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">
                                        {service.icon || "🛠️"}
                                    </div>
                                    <span className="bg-green-50 text-green-700 text-[10px] font-semibold px-2.5 py-12 rounded-full tracking-wide mt-[10px] mr-[10px]">
                                        Popular
                                    </span>
                                </div>

                                {/* Name */}
                                <h3 className="font-medium text-[15px] text-slate-900 leading-snug">
                                    {service.svcname}
                                </h3>

                                {/* Book Button */}
                                <button className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 active:scale-[0.97] text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200">
                                    Book Now →
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-400 py-10">
                            No service found
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

const styles = {
    page: {
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: "#0f172a",
        background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 50%, #fefce8 100%)",
        minHeight: "100vh",
    },
    pageHeader: {
        maxWidth: 1200, margin: "0 auto",
        padding: "56px 24px 0", textAlign: "center",
    },
    pageTitle: {
        fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: 900, letterSpacing: "-1.5px",
        color: "#0f172a", lineHeight: 1.1,
    },
    pageSubtitle: {
        color: "#64748b", marginTop: 14,
        fontSize: 15, lineHeight: 1.75, maxWidth: 520,
        marginLeft: "auto", marginRight: "auto",
    },
    controls: {
        maxWidth: 1200, margin: "36px auto 0", padding: "0 24px",
        display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center",
    },
    searchWrap: {
        flex: 1, minWidth: 220,
        display: "flex", alignItems: "center",
        background: "#fff", border: "1.5px solid #e2e8f0",
        borderRadius: 12, overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,.06)",
    },
    searchInput: {
        flex: 1, border: "none", padding: "13px 12px 13px 0",
        fontSize: 14, background: "transparent", color: "#0f172a",
        fontFamily: "inherit",
    },
    filterBtn: {
        padding: "10px 16px", borderRadius: 10,
        border: "1.5px solid #e2e8f0",
        fontSize: 13, fontWeight: 600,
        cursor: "pointer", transition: "all .2s",
        fontFamily: "inherit",
    },
    resultsBar: {
        maxWidth: 1200, margin: "28px auto 0", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    cardBadge: {
        position: "absolute", top: 16, right: 16,
        borderRadius: 99, padding: "3px 10px",
        fontSize: 11, fontWeight: 700,
    },
    iconWrap: {
        width: 54, height: 54, borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, marginBottom: 16,
    },
    cardTitle: { fontWeight: 800, fontSize: 16, color: "#0f172a" },
    cardDesc: { color: "#64748b", fontSize: 13, marginTop: 6, lineHeight: 1.65 },
    cardMeta: { display: "flex", alignItems: "center", gap: 14, marginTop: 16, flexWrap: "wrap" },
};
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const services = [
    { icon: "🔧", title: "Plumbing", desc: "Leaks, installations & pipe repairs", color: "#0ea5e9", bg: "#e0f2fe" },
    { icon: "💡", title: "Electrical", desc: "Wiring, panels & safety checks", color: "#f59e0b", bg: "#fef3c7" },
    { icon: "🧹", title: "Cleaning", desc: "Deep clean, move-in/out & more", color: "#10b981", bg: "#d1fae5" },
    { icon: "🛠️", title: "Repairs", desc: "Appliances, furniture & fixtures", color: "#8b5cf6", bg: "#ede9fe" },
    { icon: "🎨", title: "Painting", desc: "Interior, exterior & touch-ups", color: "#f43f5e", bg: "#ffe4e6" },
    { icon: "❄️", title: "AC & HVAC", desc: "Service, repair & installation", color: "#06b6d4", bg: "#cffafe" },
    { icon: "🪟", title: "Carpentry", desc: "Doors, windows & custom work", color: "#d97706", bg: "#fde68a" },
    { icon: "🔒", title: "Security", desc: "Locks, cameras & alarms", color: "#64748b", bg: "#f1f5f9" },
];

const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "2K+", label: "Verified Pros" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "4.9★", label: "Average Rating" },
];

const testimonials = [
    {
        name: "Priya Sharma",
        location: "Delhi",
        text: "Found a plumber within 20 minutes. He was professional, quick, and the pricing was completely transparent. Will use FixIt every time.",
        service: "Plumbing",
        avatar: "PS",
        color: "#0ea5e9",
    },
    {
        name: "Rahul Mehra",
        location: "Mumbai",
        text: "The electrician fixed our entire panel issue in one visit. Booking was smooth and the technician arrived right on time.",
        service: "Electrical",
        avatar: "RM",
        color: "#f59e0b",
    },
    {
        name: "Anjali Kapoor",
        location: "Bangalore",
        text: "Deep cleaning service was absolutely thorough. My apartment looks brand new. Highly recommend their cleaning team!",
        service: "Cleaning",
        avatar: "AK",
        color: "#10b981",
    },
];

const howItWorks = [
    { step: "01", title: "Choose a Service", desc: "Browse from 50+ home services and pick what you need." },
    { step: "02", title: "Book Instantly", desc: "Select a time slot that works for you — same day available." },
    { step: "03", title: "Pro Arrives", desc: "A vetted professional arrives at your door, fully equipped." },
    { step: "04", title: "Pay Securely", desc: "Pay only after the job is done, fully transparent pricing." },
];

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const navigate = useNavigate();


    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const navLinks = ["Services", "How it Works", "About", "Blog"];

    return (
        <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#0f172a", overflowX: "hidden" }}>
            <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: .6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .fade-up { animation: fadeUp .7s ease both; }
        .fade-up-2 { animation: fadeUp .7s .15s ease both; }
        .fade-up-3 { animation: fadeUp .7s .3s ease both; }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.10); }
        .service-card { transition: transform .25s, box-shadow .25s; }
        .stat-card:hover { background: #1d4ed8 !important; }
        .stat-card { transition: background .2s; }
        .nav-link { position: relative; text-decoration: none; color: #374151; font-weight: 500; font-size: 15px; transition: color .2s; }
        .nav-link::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 0; height: 2px; background: #2563eb; transition: width .25s; }
        .nav-link:hover { color: #2563eb; }
        .nav-link:hover::after { width: 100%; }
        .primary-btn:hover { background: #1d4ed8 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,.35); }
        .primary-btn { transition: all .2s; }
        .ghost-btn:hover { background: rgba(255,255,255,.15) !important; }
        .ghost-btn { transition: background .2s; }
        .search-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,.25); }
        .step-card:hover .step-num { background: #2563eb; color: #fff; }
        .step-num { transition: background .2s, color .2s; }
        @media (max-width: 768px) {
          .hero-title { font-size: 2.2rem !important; }
          .hero-sub { font-size: 1rem !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .services-grid { grid-template-columns: repeat(2,1fr) !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .testimonial-card { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .services-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

            {/* ─── NAVBAR ─── */}
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
                background: scrolled ? "rgba(255,255,255,.96)" : "transparent",
                backdropFilter: scrolled ? "blur(12px)" : "none",
                boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,.08)" : "none",
                transition: "all .3s",
                padding: "0 24px",
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 34, height: 34, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔩</div>
                        <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>Fix<span style={{ color: "#2563eb" }}>It</span></span>
                    </div>

                    {/* Desktop Nav Links */}
                    <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
                        {navLinks.map((link) => (
                            <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="nav-link">{link}</a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <Link to="/login">
                        <button style={{ padding: "8px 18px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "transparent", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#374151" }}
                            className="ghost-btn">
                            Login
                        </button>
                        </Link>
                        <Link to="/register">
                            <button style={{ padding: "8px 18px", border: "none", borderRadius: 8, background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                                className="primary-btn">
                                Register
                            </button>
                        </Link>
                        {/* Hamburger */}
                        <button onClick={() => setMenuOpen(!menuOpen)}
                            style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 22, padding: 4, "@media(max-width:768px)": { display: "block" } }}>
                            {menuOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ─── */}
            <section style={{
                minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 50%, #fefce8 100%)",
                padding: "120px 24px 80px", textAlign: "center", position: "relative",
            }}>
                {/* Decorative circles */}
                <div style={{ position: "absolute", top: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "rgba(37,99,235,.06)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 200, height: 200, borderRadius: "50%", background: "rgba(16,185,129,.08)", pointerEvents: "none" }} />

                <div style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 99, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20, display: "inline-block" }}
                    className="fade-up">
                    🏆 India's #1 Home Services Platform
                </div>

                <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px", maxWidth: 780, color: "#0f172a" }}
                    className="hero-title fade-up-2">
                    Trusted Professionals,<br />
                    <span style={{ color: "#2563eb" }}>At Your Doorstep</span>
                </h1>

                <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#64748b", marginTop: 20, maxWidth: 560, lineHeight: 1.7 }}
                    className="hero-sub fade-up-3">
                    From plumbing to painting — book verified experts in minutes. Same-day availability across 50+ cities.
                </p>

                {/* Search Bar */}
                <div className="fade-up-3" style={{ marginTop: 36, display: "flex", gap: 0, maxWidth: 560, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,.12)", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", paddingLeft: 16, color: "#94a3b8", fontSize: 20 }}>🔍</div>
                    <input
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a service, e.g. Plumber..."
                        style={{ flex: 1, border: "none", padding: "16px 12px", fontSize: 15, background: "transparent", color: "#0f172a" }}
                    />
                    <button className="primary-btn" style={{ padding: "14px 28px", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>
                        Search
                    </button>
                </div>

                {/* Popular tags */}
                <div className="fade-up-3" style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                    {["Plumber", "Electrician", "AC Repair", "Deep Cleaning", "Painter"].map((tag) => (
                        <button key={tag} onClick={() => setSearchQuery(tag)}
                            style={{ padding: "6px 14px", border: "1.5px solid #e2e8f0", borderRadius: 99, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#475569", transition: "all .2s" }}>
                            {tag}
                        </button>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="fade-up-3" style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
                    <button className="primary-btn"
                        style={{ padding: "14px 32px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 16 }}>
                        Book a Service →
                    </button>
                    <button className="ghost-btn"
                        style={{ padding: "14px 32px", background: "#fff", color: "#374151", border: "1.5px solid #e2e8f0", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 16 }}>
                        ▶ Watch How it Works
                    </button>
                </div>
            </section>

            {/* ─── STATS BANNER ─── */}
            <section style={{ background: "#2563eb", padding: "48px 24px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="stats-grid">
                    {stats.map(({ value, label }) => (
                        <div key={label} className="stat-card" style={{ textAlign: "center", padding: "24px 16px", borderRadius: 12, background: "rgba(255,255,255,.10)", cursor: "default" }}>
                            <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>{value}</div>
                            <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)", marginTop: 6, fontWeight: 500 }}>{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── SERVICES ─── */}
            <section id="services" style={{ padding: "88px 24px", background: "#f8fafc" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 56 }}>
                        <span style={{ color: "#2563eb", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2 }}>What We Offer</span>
                        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, marginTop: 10, letterSpacing: "-0.5px" }}>All Your Home Needs, Covered</h2>
                        <p style={{ color: "#64748b", marginTop: 12, maxWidth: 480, margin: "12px auto 0", lineHeight: 1.7 }}>
                            Browse from our wide range of professional services, all quality-checked and guaranteed.
                        </p>
                    </div>
                    <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
                        {services.map(({ icon, title, desc, color, bg }) => (
                            <div key={title} className="service-card"
                                style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 16, padding: "28px 20px", cursor: "pointer" }}>
                                <div style={{ width: 52, height: 52, background: bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{icon}</div>
                                <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{title}</h3>
                                <p style={{ color: "#64748b", fontSize: 13.5, marginTop: 6, lineHeight: 1.6 }}>{desc}</p>
                                <div style={{ marginTop: 16, color, fontWeight: 700, fontSize: 13 }}>Book now →</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section id="how-it-works" style={{ padding: "88px 24px", background: "#fff" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 56 }}>
                        <span style={{ color: "#2563eb", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2 }}>Simple Process</span>
                        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, marginTop: 10, letterSpacing: "-0.5px" }}>How FixIt Works</h2>
                    </div>
                    <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
                        {howItWorks.map(({ step, title, desc }, i) => (
                            <div key={step} className="step-card" style={{ position: "relative", padding: "32px 24px", borderRadius: 16, background: "#f8fafc", border: "1.5px solid #e2e8f0", cursor: "default" }}>
                                {i < 3 && (
                                    <div style={{ position: "absolute", top: "44px", right: "-18px", width: 36, height: 2, background: "#dbeafe", zIndex: 1 }} />
                                )}
                                <div className="step-num" style={{ width: 44, height: 44, borderRadius: 10, background: "#eff6ff", color: "#2563eb", fontWeight: 900, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>{step}</div>
                                <h3 style={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>{title}</h3>
                                <p style={{ color: "#64748b", fontSize: 14, marginTop: 8, lineHeight: 1.65 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ─── */}
            <section style={{ padding: "88px 24px", background: "linear-gradient(135deg, #eff6ff, #f0fdf4)" }}>
                <div style={{ maxWidth: 860, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <span style={{ color: "#2563eb", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2 }}>Reviews</span>
                        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, marginTop: 10, letterSpacing: "-0.5px" }}>Loved by Thousands</h2>
                    </div>

                    <div style={{ background: "#fff", borderRadius: 20, padding: "40px 40px", boxShadow: "0 12px 48px rgba(0,0,0,.08)", transition: "all .4s" }}>
                        {testimonials.map((t, i) => (
                            <div key={t.name} style={{ display: i === activeTestimonial ? "flex" : "none", gap: 28, alignItems: "flex-start" }} className="testimonial-card">
                                <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>{t.avatar}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 22, color: "#f59e0b", marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
                                    <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.75, fontStyle: "italic" }}>"{t.text}"</p>
                                    <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{t.name}</div>
                                            <div style={{ fontSize: 13, color: "#94a3b8" }}>{t.location} · {t.service}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                        {testimonials.map((_, i) => (
                            <button key={i} onClick={() => setActiveTestimonial(i)}
                                style={{ width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 99, background: i === activeTestimonial ? "#2563eb" : "#cbd5e1", border: "none", cursor: "pointer", transition: "all .3s" }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TRUST BADGES ─── */}
            <section style={{ padding: "64px 24px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 32 }}>Why Professionals & Customers Trust Us</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 4vw, 60px)", flexWrap: "wrap" }}>
                        {[
                            { icon: "✅", label: "Verified Pros" },
                            { icon: "💳", label: "Secure Payments" },
                            { icon: "🛡️", label: "Service Guarantee" },
                            { icon: "📞", label: "24/7 Support" },
                            { icon: "📍", label: "50+ Cities" },
                        ].map(({ icon, label }) => (
                            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                <div style={{ fontSize: 28 }}>{icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA BANNER ─── */}
            <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>Ready to Get Started?</h2>
                    <p style={{ color: "rgba(255,255,255,.75)", marginTop: 16, fontSize: 16, lineHeight: 1.7 }}>
                        Join over 50,000 happy customers who trust FixIt for all their home service needs.
                    </p>
                    <button className="primary-btn"
                        style={{ marginTop: 32, padding: "16px 40px", background: "#fff", color: "#2563eb", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 800, fontSize: 17, boxShadow: "0 8px 24px rgba(0,0,0,.2)" }}>
                        Book Your First Service →
                    </button>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "64px 24px 32px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <div style={{ width: 32, height: 32, background: "#2563eb", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔩</div>
                                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Fix<span style={{ color: "#60a5fa" }}>It</span></span>
                            </div>
                            <p style={{ fontSize: 14, lineHeight: 1.75, maxWidth: 260 }}>Making home services simple, reliable, and affordable across India.</p>
                            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                                {["f", "in", "tw", "yt"].map((s) => (
                                    <div key={s} style={{ width: 34, height: 34, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#60a5fa", fontSize: 12, fontWeight: 700 }}>{s}</div>
                                ))}
                            </div>
                        </div>
                        {[
                            { title: "Services", links: ["Plumbing", "Electrical", "Cleaning", "AC Repair", "Painting"] },
                            { title: "Company", links: ["About Us", "Careers", "Press", "Blog", "Contact"] },
                            { title: "Support", links: ["Help Center", "Safety", "Terms", "Privacy", "Refund Policy"] },
                        ].map(({ title, links }) => (
                            <div key={title}>
                                <h4 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{title}</h4>
                                <ul style={{ listStyle: "none" }}>
                                    {links.map((link) => (
                                        <li key={link} style={{ marginBottom: 10 }}>
                                            <a href="#" style={{ color: "#64748b", fontSize: 14, textDecoration: "none", transition: "color .2s" }}
                                                onMouseOver={(e) => (e.target.style.color = "#94a3b8")}
                                                onMouseOut={(e) => (e.target.style.color = "#64748b")}>
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: "1px solid #1e293b", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                        <span style={{ fontSize: 13 }}>© 2025 FixIt. All rights reserved.</span>
                        <span style={{ fontSize: 13 }}>Made with ❤️ in India</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
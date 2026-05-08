import React from "react";
import { useNavigate } from "react-router-dom";

const Homme = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>FixIt</h2>
        <div>
          <button style={styles.btn} onClick={() => navigate("/login")}>
            Login
          </button>
          <button style={styles.btn} onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1>Find Trusted Services Near You</h1>
        <p>Plumber, Electrician, Cleaning & more — all in one place</p>

        <button
          style={styles.primaryBtn}
          onClick={() => navigate("/services")}
        >
          Go to Services
        </button>
      </div>

      {/* Services Preview */}
      <div style={styles.services}>
        <div style={styles.card}>🔧 Plumber</div>
        <div style={styles.card}>💡 Electrician</div>
        <div style={styles.card}>🧹 Cleaning</div>
        <div style={styles.card}>🛠️ Repair</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial",
    textAlign: "center",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#222",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  btn: {
    marginLeft: "10px",
    padding: "8px 15px",
    border: "none",
    cursor: "pointer",
  },
  hero: {
    padding: "60px 20px",
    background: "#f4f4f4",
  },
  primaryBtn: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  services: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "30px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "120px",
  },
};

export default Homme;
// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: 'hidden',
      position: 'relative'
    },
    floatingCircle1: {
      position: 'absolute',
      top: '20%',
      left: '10%',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
      animation: 'float 8s ease-in-out infinite'
    },
    floatingCircle2: {
      position: 'absolute',
      top: '40%',
      right: '15%',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
      animation: 'float 10s ease-in-out infinite'
    },
    content: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      textAlign: 'center'
    },
    title: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      marginBottom: '20px'
    },
    subtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.5rem)',
      color: '#e2e8f0',
      maxWidth: '800px',
      margin: '0 auto 40px'
    },
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '30px',
      marginBottom: '60px'
    },
    card: {
      flex: '1 1 300px',
      maxWidth: '400px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    cardHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
    },
    iconContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto 20px'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    cardText: {
      color: '#e2e8f0',
      marginBottom: '20px'
    },
    button: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
      color: 'white',
      border: 'none',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    buttonHover: {
      background: 'linear-gradient(to right, #3b82f6, #22d3ee)'
    },
    features: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '20px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    featureCard: {
      flex: '1 1 250px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '15px',
      padding: '25px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease'
    },
    featureCardHover: {
      transform: 'translateY(-10px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
    },
    featureIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto 15px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Floating background elements */}
      <div style={styles.floatingCircle1}></div>
      <div style={styles.floatingCircle2}></div>
      
      {/* Main content */}
      <div style={styles.content}>
        <h1 style={styles.title}>AIU Venue Booking</h1>
        <p style={styles.subtitle}>
          Revolutionizing campus space management with cutting-edge technology and seamless user experience
        </p>
        
        {/* Login cards */}
        <div style={styles.cardContainer}>
          {/* Student/Staff card */}
          <div 
            style={styles.card}
            onClick={() => navigate('/login')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={styles.iconContainer}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"></path>
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Student & Staff</h3>
            <p style={styles.cardText}>Book venues, manage reservations, and explore campus facilities</p>
            <button 
              style={styles.button}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #3b82f6, #22d3ee)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #22d3ee, #3b82f6)'}
            >
              Login to Portal
            </button>
          </div>
          
          {/* Admin card */}
          <div 
            style={styles.card}
            onClick={() => navigate('/admin/login')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{...styles.iconContainer, background: 'linear-gradient(to right, #a855f7, #6366f1)'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M10 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Administrator</h3>
            <p style={styles.cardText}>Manage bookings, configure venues, and oversee system operations</p>
            <button 
              style={{...styles.button, background: 'linear-gradient(to right, #a855f7, #6366f1)'}}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #6366f1, #a855f7)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #a855f7, #6366f1)'}
            >
              Admin Dashboard
            </button>
          </div>
        </div>
        
        {/* Features */}
        <div style={styles.features}>
          {[
            { 
              title: "Smart Booking", 
              desc: "AI-powered suggestions for optimal venue selection", 
              icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            },
            { 
              title: "Real-time Updates", 
              desc: "Instant notifications for all booking activities", 
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            },
            { 
              title: "Advanced Analytics", 
              desc: "Comprehensive reports and usage insights", 
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            }
          ].map((feature, index) => (
            <div 
              key={index}
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d={feature.icon}></path>
                </svg>
              </div>
              <h4 style={{...styles.cardTitle, fontSize: '1.2rem'}}>{feature.title}</h4>
              <p style={styles.cardText}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
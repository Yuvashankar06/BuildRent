import React from "react";
import "../styles/about.scss";

function About() {
  return (
    <section className="about-page">

      {/* Hero */}

      <div className="about-hero">
        <div className="about-hero-content">
          <span>ABOUT BUILARENT</span>

          <h1>
            Making construction
            <br />
            equipment rental simpler.
          </h1>

          <p>
            BuildRent connects construction equipment owners
            with people and businesses looking for reliable
            equipment for their projects.
          </p>
        </div>
      </div>

      {/* About */}

      <div className="about-container">

        <div className="about-section">

          <div className="about-section-heading">
            <span>WHO WE ARE</span>
            <h2>Built for modern construction rental.</h2>
          </div>

          <div className="about-section-content">
            <p>
              BuildRent is a construction equipment rental
              platform designed to make equipment discovery,
              rental requests and rental management easier.
            </p>

            <p>
              Equipment owners can list their machinery,
              manage rental requests and keep track of
              equipment availability. Customers can browse
              equipment, check rental details and submit
              rental requests.
            </p>
          </div>

        </div>

        {/* Features */}

        <div className="about-features">

          <div className="about-feature-card">
            <div className="about-feature-icon">
              🚜
            </div>

            <h3>Wide Equipment Choice</h3>

            <p>
              Browse construction equipment from different
              categories in one place.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon">
              📅
            </div>

            <h3>Easy Rental Management</h3>

            <p>
              Select rental dates and manage rental requests
              through a simple platform.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon">
              🔐
            </div>

            <h3>Transparent Records</h3>

            <p>
              The platform is designed to support secure and
              transparent rental records.
            </p>
          </div>

        </div>

        {/* How it works */}

        <div className="about-process">

          <div className="about-process-header">
            <span>HOW IT WORKS</span>

            <h2>
              From equipment search to return.
            </h2>
          </div>

          <div className="process-grid">

            <div className="process-item">
              <span>01</span>

              <h3>Browse</h3>

              <p>
                Find construction equipment based on your
                project requirements.
              </p>
            </div>

            <div className="process-item">
              <span>02</span>

              <h3>Request</h3>

              <p>
                Select your rental period and submit a
                rental request.
              </p>
            </div>

            <div className="process-item">
              <span>03</span>

              <h3>Approval</h3>

              <p>
                The equipment owner reviews and manages
                the rental request.
              </p>
            </div>

            <div className="process-item">
              <span>04</span>

              <h3>Return</h3>

              <p>
                Complete the rental and update the equipment
                return status.
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default About;
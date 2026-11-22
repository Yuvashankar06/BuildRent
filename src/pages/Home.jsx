import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEquipment } from "../context/EquipmentContext";
import "../styles/home.scss";

function Home() {
  const { equipment } = useEquipment();

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(equipment.length / itemsPerPage);

  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const featuredEquipment = equipment.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="home-page">
      {/* ================= HERO ================= */}

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-label">
              SMART CONSTRUCTION EQUIPMENT RENTAL
            </span>

            <h1>
              Build Bigger.
              <br />
              <span>Rent Smarter.</span>
            </h1>

            <p>
              Find reliable construction equipment for your
              next project. Browse equipment, check availability,
              and submit your rental request with ease.
            </p>

            <div className="hero-buttons">
              <Link to="/equipment" className="hero-primary-btn">
                Browse Equipment
              </Link>

              <Link to="/register" className="hero-secondary-btn">
                Get Started
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="/Images/excavator.jpeg"
              alt="Construction Excavator"
            />

            <div className="hero-image-card">
              <strong>Reliable Equipment</strong>
              <span>Ready for your next project</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="home-stats">
        <div className="home-stats-container">
          <div className="stat-item">
            <strong>{equipment.length}+</strong>
            <span>Equipment Listed</span>
          </div>

          <div className="stat-item">
            <strong>24/7</strong>
            <span>Rental Management</span>
          </div>

          <div className="stat-item">
            <strong>100%</strong>
            <span>Transparent Records</span>
          </div>

          <div className="stat-item">
            <strong>Easy</strong>
            <span>Rental Process</span>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}

      <section className="why-section">
        <div className="home-container">
          <div className="section-heading">
            <span>WHY BUILDrent?</span>

            <h2>
              Everything you need to manage
              equipment rentals
            </h2>

            <p>
              A simple platform for users and equipment owners
              to manage the complete rental process.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🚜</div>
              <h3>Quality Equipment</h3>
              <p>
                Browse construction equipment with detailed
                specifications, pricing, and availability.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">📅</div>
              <h3>Easy Rental Process</h3>
              <p>
                Select your equipment, choose rental dates,
                and submit your request through a simple process.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">🔐</div>
              <h3>Secure Records</h3>
              <p>
                Rental transactions are designed to provide
                transparent and secure records.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">📊</div>
              <h3>Rental Tracking</h3>
              <p>
                Track rental requests, approvals, equipment
                returns, and completion status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section">
        <div className="home-container">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>Rent equipment in four simple steps</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Create Account</h3>
              <p>
                Register and login to start using the rental platform.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Choose Equipment</h3>
              <p>
                Browse equipment and check its details and availability.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Send Request</h3>
              <p>
                Select your rental dates and submit a rental request.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Rent & Return</h3>
              <p>
                After owner approval, use the equipment and complete
                the return process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED EQUIPMENT ================= */}

      <section className="featured-section">
        <div className="home-container">
          <div className="featured-heading">
            <div>
              <span>FEATURED EQUIPMENT</span>
              <h2>Find the right equipment</h2>
            </div>

            <Link to="/equipment">
              View All Equipment →
            </Link>
          </div>

          {equipment.length === 0 ? (
            <div className="featured-empty">
              <h3>No equipment available yet</h3>
              <p>
                Equipment added to BuildRent will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="featured-grid">
                {featuredEquipment.map((item) => (
                  <div className="featured-card" key={item.id}>
                    <div className="featured-image">
                      <img
                        src={
                          item.image ||
                          "https://placehold.co/600x400?text=Construction+Equipment"
                        }
                        alt={item.name || "Construction equipment"}
                      />

                      <span
                        className={
                          item.available
                            ? "available"
                            : "unavailable"
                        }
                      >
                        {item.available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>

                    <div className="featured-content">
                      <span className="featured-category">
                        {item.category}
                      </span>

                      <h3>{item.name}</h3>

                      <p>{item.description}</p>

                      <div className="featured-bottom">
                        <div>
                          <span>Rental Price</span>

                          <strong>
                            ₹
                            {Number(item.price || 0).toLocaleString(
                              "en-IN"
                            )}
                            <small> / day</small>
                          </strong>
                        </div>

                        <Link to={`/equipment/${item.id}`}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (
                <div className="equipment-pagination">
                  <button
                    type="button"
                    className="pagination-arrow"
                    onClick={() =>
                      setCurrentPage((page) => page - 1)
                    }
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>

                  <div className="pagination-numbers">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        type="button"
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? "pagination-number active"
                            : "pagination-number"
                        }
                        aria-current={
                          currentPage === page ? "page" : undefined
                        }
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pagination-arrow"
                    onClick={() =>
                      setCurrentPage((page) => page + 1)
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}

              <p className="pagination-info">
                Showing {startIndex + 1}–
                {Math.min(startIndex + itemsPerPage, equipment.length)}{" "}
                of {equipment.length} equipment items
              </p>
            </>
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="home-cta">
        <div className="home-cta-container">
          <div>
            <span>READY TO GET STARTED?</span>

            <h2>
              Find the equipment
              your project needs.
            </h2>

            <p>
              Browse our construction equipment and
              start your rental request today.
            </p>
          </div>

          <Link to="/equipment" className="cta-button">
            Browse Equipment →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
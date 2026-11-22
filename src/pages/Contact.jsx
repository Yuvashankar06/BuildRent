import React, { useState } from "react";
import "../styles/contact.scss";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Thank you for contacting BuildRent. We will get back to you soon."
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="contact-page">

      {/* Header */}

      <div className="contact-hero">

        <div className="contact-hero-content">

          <span>CONTACT BUILARENT</span>

          <h1>
            Let's talk about
            <br />
            your project.
          </h1>

          <p>
            Have a question about equipment rental?
            Get in touch with the BuildRent team.
          </p>

        </div>

      </div>

      {/* Contact Content */}

      <div className="contact-container">

        <div className="contact-grid">

          {/* Contact Information */}

          <div className="contact-info">

            <span className="contact-label">
              GET IN TOUCH
            </span>

            <h2>
              We're here to help.
            </h2>

            <p>
              Whether you are looking for equipment,
              managing rentals or need help with the
              platform, send us a message.
            </p>

            <div className="contact-info-list">

              <div className="contact-info-item">

                <div className="contact-icon">
                  📧
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    support@buildrent.com
                  </strong>
                </div>

              </div>

              <div className="contact-info-item">

                <div className="contact-icon">
                  📞
                </div>

                <div>
                  <span>Phone</span>

                  <strong>
                    +91 98765 43210
                  </strong>
                </div>

              </div>

              <div className="contact-info-item">

                <div className="contact-icon">
                  📍
                </div>

                <div>
                  <span>Location</span>

                  <strong>
                    Maharashtra, India
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* Contact Form */}

          <div className="contact-form-card">

            <h2>Send us a message</h2>

            <p>
              Fill in the details below and we'll get
              back to you.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="contact-form-row">

                <div className="contact-form-group">

                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="contact-form-group">

                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="contact-form-group">

                <label>Subject</label>

                <input
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="contact-form-group">

                <label>Message</label>

                <textarea
                  name="message"
                  rows="6"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

              </div>

              <button
                type="submit"
                className="contact-submit-btn"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Contact;
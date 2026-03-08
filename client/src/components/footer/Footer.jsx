import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="top">
          <div className="brandSection">
            <h2>Workhive</h2>
            <p>
              Connect with trusted service providers for home improvement,
              repairs, cleaning, and everyday essentials.
            </p>
          </div>

          <div className="linksGrid">
            <div className="item">
              <h3>Categories</h3>
              <span>Plumbing</span>
              <span>Carpentry</span>
              <span>Electrician</span>
              <span>Arborist</span>
              <span>AC Services</span>
              <span>Gardening</span>
              <span>Bathroom Renovation</span>
              <span>Cleaning</span>
              <span>Painters</span>
            </div>

            <div className="item">
              <h3>About</h3>
              <span>Press & News</span>
              <span>Partnerships</span>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Intellectual Property Claims</span>
              <span>Investor Relations</span>
              <span>Contact Sales</span>
            </div>

            <div className="item">
              <h3>Support</h3>
              <span>Help & Support</span>
              <span>Trust & Safety</span>
              <span>Service Providers</span>
              <span>Users</span>
            </div>

            <div className="item">
              <h3>Community</h3>
              <span>Customer Success Stories</span>
              <span>Community Hub</span>
              <span>Forum</span>
              <span>Events</span>
              <span>Blog</span>
              <span>Influencers</span>
              <span>Affiliates</span>
              <span>Podcast</span>
              <span>Invite a Friend</span>
              <span>Become a Seller</span>
              <span>Community Standards</span>
            </div>
          </div>
        </div>

        <hr />

        <div className="bottom">
          <div className="left">
            <h2>Workhive</h2>
            <span>© 2025 Workhive. All rights reserved.</span>
          </div>

          <div className="right">
            <div className="social">
              <img src="/img/twitter.png" alt="Twitter" />
              <img src="/img/facebook.png" alt="Facebook" />
              <img src="/img/linkedin.png" alt="LinkedIn" />
              <img src="/img/pinterest.png" alt="Pinterest" />
              <img src="/img/instagram.png" alt="Instagram" />
            </div>

            <div className="metaLinks">
              <div className="link">
                <img src="/img/language.png" alt="Language" />
                <span>English</span>
              </div>

              <div className="link">
                <img src="/img/coin.png" alt="Currency" />
                <span>INR</span>
              </div>

              <div className="link">
                <img src="/img/accessibility.png" alt="Accessibility" />
                <span>Accessibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
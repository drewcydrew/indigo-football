function PrivacyPolicy({ onAccept }) {
  return (
    <>
      <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

      <p className="introduction">
        Thank you for using Indigo Football. Your privacy is important to us. This
        Privacy Policy outlines how your data is handled when you use our services.
      </p>

      <div className="section">
        <h2 className="section-title">Information We Collect</h2>
        <p className="paragraph">
          We may collect the following types of information:
        </p>
        <div className="bullet-points">
          <p className="bullet-point">
            • Personal information you provide (name, email, etc.)
          </p>
          <p className="bullet-point">
            • Usage data and analytics
          </p>
          <p className="bullet-point">
            • Device information and IP addresses
          </p>
          <p className="bullet-point">
            • Cookies and similar tracking technologies
          </p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">How We Use Your Information</h2>
        <p className="paragraph">
          We use collected information to:
        </p>
        <div className="bullet-points">
          <p className="bullet-point">
            • Provide and improve our services
          </p>
          <p className="bullet-point">
            • Communicate with you
          </p>
          <p className="bullet-point">
            • Analyze usage patterns
          </p>
          <p className="bullet-point">
            • Ensure security and prevent fraud
          </p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Information Sharing</h2>
        <p className="paragraph">
          We do not sell or rent your personal information to third parties. We may share information only in the following circumstances:
        </p>
        <div className="bullet-points">
          <p className="bullet-point">
            • With your explicit consent
          </p>
          <p className="bullet-point">
            • To comply with legal obligations
          </p>
          <p className="bullet-point">
            • To protect our rights and safety
          </p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Data Security</h2>
        <p className="paragraph">
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">Your Rights</h2>
        <p className="paragraph">
          You have the right to:
        </p>
        <div className="bullet-points">
          <p className="bullet-point">
            • Access your personal information
          </p>
          <p className="bullet-point">
            • Correct inaccurate data
          </p>
          <p className="bullet-point">
            • Request deletion of your data
          </p>
          <p className="bullet-point">
            • Opt-out of certain communications
          </p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Contact Us</h2>
        <p className="paragraph">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="paragraph">
          Email: andrewjovaras@gmail.com
        </p>
      </div>

      <div className="action-buttons-container">
        <button className="accept-button" onClick={onAccept}>
          <span>I Accept</span>
          <span className="checkmark">✓</span>
        </button>
      </div>
    </>
  )
}

export default PrivacyPolicy
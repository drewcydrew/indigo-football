import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <>
      <div className="privacy-policy">
        <h1>Privacy Policy</h1>
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>Personal information you provide (name, email, etc.)</li>
            <li>Usage data and analytics</li>
            <li>Device information and IP addresses</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Communicate with you</li>
            <li>Analyze usage patterns</li>
            <li>Ensure security and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2>Information Sharing</h2>
          <p>We do not sell or rent your personal information to third parties. We may share information only in the following circumstances:</p>
          <ul>
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
          </ul>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of certain communications</li>
          </ul>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: privacy@yourapp.com</p>
        </section>
      </div>
    </>
  )
}

export default App

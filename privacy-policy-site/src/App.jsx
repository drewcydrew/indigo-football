import { useState, useEffect } from 'react'
import PrivacyPolicy from './components/PrivacyPolicy'
import UserGuide from './components/UserGuide'
import './App.css'

function App() {
  const [accepted, setAccepted] = useState(false)
  const [activeTab, setActiveTab] = useState('privacy')
  
  useEffect(() => {
    // Check URL parameters on mount
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    if (tab === 'user-guide' || tab === 'privacy') {
      setActiveTab(tab === 'user-guide' ? 'guide' : 'privacy')
    }
  }, [])

  const handleAccept = () => {
    setAccepted(true)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Update URL parameter
    const url = new URL(window.location)
    url.searchParams.set('tab', tab === 'guide' ? 'user-guide' : 'privacy')
    window.history.pushState({}, '', url)
  }

  if (accepted) {
    return (
      <div className="accepted-container">
        <h1>Thank you!</h1>
        <p>You have accepted the privacy policy.</p>
        <button 
          className="tab-button" 
          onClick={() => {
            setAccepted(false)
            handleTabChange('guide')
          }}
        >
          View User Guide
        </button>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="privacy-container">
        <div className="tab-header">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => handleTabChange('privacy')}
            >
              Privacy Policy
            </button>
            <button 
              className={`tab-button ${activeTab === 'guide' ? 'active' : ''}`}
              onClick={() => handleTabChange('guide')}
            >
              User Guide
            </button>
          </div>
        </div>

        <div className="modal-header">
          <h1 className="modal-title">
            {activeTab === 'privacy' ? 'Privacy Policy' : 'Indigo Football User Guide'}
          </h1>
        </div>

        <div className="scroll-content">
          <div className="content-container">
            {activeTab === 'privacy' ? (
              <PrivacyPolicy onAccept={handleAccept} />
            ) : (
              <UserGuide />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
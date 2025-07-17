function UserGuide() {
  const VideoSection = ({ src, title }) => (
    <div className="video-section">
      <video 
        controls 
        muted
        autoPlay
        loop
        className="demo-video"
        style={{ objectFit: 'fill' }}
        poster={`/videos/${title.toLowerCase()}-poster.jpg`}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="video-caption">{title} Demo</p>
    </div>
  )

  return (
    <>
      <p className="introduction">
        Indigo Football is designed to help organize teams for Monday night football games.
      </p>

      <p className="introduction">
        Add players and assign them a score from 1 to 5. On game day, set player attendance and choose the number of teams. Then use the app to generate balanced lineups.
      </p>

      <div className="section-with-video">
        <div className="section-content">
          <h2 className="section-title">Player Screen</h2>
          <p className="paragraph">
            Use this screen to manage your list of players. Tap an existing player to edit their name, score, or description.
          </p>
          <p className="paragraph">
            Tap the plus button in the top-right corner to add a new player and assign a score from 1 to 5.
          </p>
          <p className="paragraph">
            Tap the cloud button in the top left to back up your player collection, or to load an online collection.
          </p>
          <p className="paragraph">
            Be aware: loading a collection is a destructive action—it will overwrite your current data. Several example collections are available: Celtic FC, Tottenham Hotspurs, AC Milan, Real Madrid.
          </p>
        </div>
        <VideoSection src="/videos/players-demo.mov" title="Players" />
      </div>

      <div className="section-with-video">
        <div className="section-content">
          <h2 className="section-title">Attendance Screen</h2>
          <p className="paragraph">
            Once your player list is ready, use this screen on match night to select who is attending.
          </p>
          <p className="paragraph">
            Tap the button in the top-right corner to select or deselect all players.
          </p>
        </div>
        <VideoSection src="/videos/attendance-demo.mov" title="Attendance" />
      </div>

      <div className="section-with-video">
        <div className="section-content">
          <h2 className="section-title">Matches Screen</h2>
          <p className="paragraph">
            Use this screen to generate teams. Tap the generate button in the top-right corner to re-roll the teams.
          </p>
          <p className="paragraph">
            Tap a jersey panel to change that team's jersey color.
          </p>
          <p className="paragraph">
            Use the settings icon in the top-left corner to choose the number of teams and customize team creation options.
          </p>
          
          <h3 className="section-title">Creation Algorithm</h3>
          <p className="paragraph">
            You can choose between score-based sorting or random player assignment.
          </p>
          <p className="paragraph">
            Score-based sorting aims to create balanced teams by distributing higher-rated players evenly across all teams, resulting in more competitive matches.
          </p>
          <p className="paragraph">
            Random assignment treats all players equally and shuffles them without considering scores. This method is ideal for a more casual or unpredictable experience.
          </p>
          
          <h3 className="section-title">Repulsors</h3>
          <p className="paragraph">
            Repulsors prevent certain pairs of players from being placed on the same team—helpful for avoiding conflicts, shaking up familiar lineups, or managing rivalries.
          </p>
          <p className="paragraph">
            When generating teams, the app checks for repulsor violations. If any are found, it retries the configuration—up to 50 times. If all attempts fail, it applies a 'best effort' solution that may not respect every repulsor but ensures teams are still formed.
          </p>
        </div>
        <VideoSection src="/videos/matches-demo.mov" title="Matches" />
      </div>

      <div className="section">
        <h2 className="section-title">Contact Us</h2>
        <p className="paragraph">
          If you're experiencing any issues or have questions about the app, please reach out to our support team.
        </p>
        <div className="bullet-points">
          <p className="bullet-point">
            • Email: <a href="mailto:andrewjovaras@gmail.com" style={{color: '#646cff', textDecoration: 'underline'}}>andrewjovaras@gmail.com</a>
          </p>
        </div>
        <p className="paragraph">
          We typically respond within 24-48 hours during business days.
        </p>
      </div>
    </>
  )
}

export default UserGuide
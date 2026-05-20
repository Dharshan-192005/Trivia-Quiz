import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Sliders, Save, Check } from 'lucide-react';

const Settings = ({ user }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [avatarSeed, setAvatarSeed] = useState(
    user?.avatar?.split('seed=')[1] || 'Felix'
  );
  
  // Quiz preferences
  const [category, setCategory] = useState(
    localStorage.getItem('trivia_pref_category') || '9'
  );
  const [difficulty, setDifficulty] = useState(
    localStorage.getItem('trivia_pref_difficulty') || 'medium'
  );

  const [saved, setSaved] = useState(false);

  const categories = [
    { id: '9', name: 'General Knowledge' },
    { id: '17', name: 'Science & Nature' },
    { id: '18', name: 'Computers & Technology' },
    { id: '21', name: 'Sports' },
    { id: '22', name: 'Geography' },
    { id: '23', name: 'History' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    
    // Save quiz preferences
    localStorage.setItem('trivia_pref_category', category);
    localStorage.setItem('trivia_pref_difficulty', difficulty);

    // Save avatar / username update locally
    const updatedUser = {
      ...user,
      username: username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload(); // Reload to apply avatar & username changes in layout
    }, 1500);
  };

  const rollAvatar = () => {
    const seeds = ['Felix', 'Max', 'Jack', 'Luna', 'Lily', 'Bella', 'Oliver', 'Leo', 'Milo', 'Coco', 'Cookie', 'Rocky'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)] + Math.floor(Math.random() * 100);
    setAvatarSeed(randomSeed);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '2rem',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #f8fafc 0%, #eef2f7 50%, #f8fafc 100%)',
      }}
    >
      <div className="page-container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            <SettingsIcon size={36} color="var(--accent-primary)" /> System Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 500 }}>Customize your gaming profile and quiz experience.</p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Profile Card Settings */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.35rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              <User size={20} color="var(--accent-primary)" /> Profile Customization
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} 
                  alt="avatar preview" 
                  style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid var(--border)', background: '#f8fafc' }}
                />
                <button 
                  type="button" 
                  onClick={rollAvatar}
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                >
                  Roll Avatar
                </button>
              </div>
              
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label className="label" style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Challenger Username</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Trivia Preferences */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.35rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              <Sliders size={20} color="var(--accent-secondary)" /> Trivia Preferences
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label className="label" style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Default Category</label>
                <select 
                  className="input-field" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ background: '#ffffff', color: 'var(--text-primary)' }}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Default Difficulty</label>
                <select 
                  className="input-field" 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{ background: '#ffffff', color: 'var(--text-primary)' }}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ 
                padding: '1rem 2.25rem', 
                fontSize: '1rem',
                borderRadius: '14px',
                background: saved ? 'var(--success)' : undefined,
                borderBottomColor: saved ? '#047857' : undefined,
                boxShadow: saved ? '0 4px 12px rgba(16, 185, 129, 0.3)' : undefined
              }}
              disabled={saved}
            >
              {saved ? (
                <>
                  <Check size={20} /> Settings Saved!
                </>
              ) : (
                <>
                  <Save size={20} /> Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState } from 'react';
import { Check, RotateCcw, Save, Settings as SettingsIcon, Sliders, User } from 'lucide-react';

const Settings = ({ user }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [avatarSeed, setAvatarSeed] = useState(user?.avatar?.split('seed=')[1] || 'Felix');
  const [category, setCategory] = useState(localStorage.getItem('trivia_pref_category') || '9');
  const [difficulty, setDifficulty] = useState(localStorage.getItem('trivia_pref_difficulty') || 'medium');
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
    localStorage.setItem('trivia_pref_category', category);
    localStorage.setItem('trivia_pref_difficulty', difficulty);

    const updatedUser = {
      ...user,
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload();
    }, 1200);
  };

  const rollAvatar = () => {
    const seeds = ['Felix', 'Max', 'Jack', 'Luna', 'Lily', 'Bella', 'Oliver', 'Leo', 'Milo', 'Coco', 'Cookie', 'Rocky'];
    setAvatarSeed(seeds[Math.floor(Math.random() * seeds.length)] + Math.floor(Math.random() * 100));
  };

  return (
    <main className="page-shell animate-fade-in scene-page settings-scene">
      <div className="page-container" style={{ maxWidth: 880 }}>
        <header style={{ marginBottom: '1.6rem' }}>
          <div className="eyebrow">
            <SettingsIcon size={16} />
            Preferences
          </div>
          <h1 style={{ marginTop: '0.5rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Settings</h1>
          <p style={{ marginTop: '0.55rem', color: 'var(--text-secondary)' }}>Tune your profile and default quiz setup.</p>
        </header>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem' }}>
          <section className="card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.25rem' }}>
              <User size={20} />
              Profile
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', gap: '1.3rem', alignItems: 'center' }}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: '0.75rem' }}>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                  alt="avatar preview"
                  style={{ width: 96, height: 96, borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.08)' }}
                />
                <button type="button" className="btn btn-secondary" onClick={rollAvatar} style={{ minHeight: 36, padding: '0.45rem 0.7rem' }}>
                  <RotateCcw size={16} />
                  Roll
                </button>
              </div>

              <div>
                <label className="label">Challenger username</label>
                <input className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>
          </section>

          <section className="card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.25rem' }}>
              <Sliders size={20} />
              Quiz Defaults
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label">Default category</label>
                <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Default difficulty</label>
                <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saved}>
              {saved ? <Check size={19} /> : <Save size={19} />}
              {saved ? 'Saved' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Settings;

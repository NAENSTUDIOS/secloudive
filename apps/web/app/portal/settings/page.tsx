import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Settings' };

const privacyToggles = [
  {
    id: 'analytics',
    label: 'Usage analytics',
    description: 'Allow aggregated, anonymised usage data to improve the platform.',
    default: false,
  },
  {
    id: 'ai_memory',
    label: 'AI memory',
    description: 'Allow the AI mentor to retain context between sessions.',
    default: false,
  },
  {
    id: 'streaks',
    label: 'Learning streaks',
    description: 'Track and display your daily learning streak.',
    default: false,
  },
  {
    id: 'marketing',
    label: 'Product updates',
    description: 'Receive emails about new features and content.',
    default: false,
  },
];

export default function SettingsPage() {
  return (
    <section>
      <p className="eyebrow">Privacy and settings</p>
      <h1>Control your account and data.</h1>
      <p className="hero-summary">
        All privacy controls default to off. You choose what to enable. Changes take effect
        immediately and can be reversed at any time.
      </p>

      <div className="settings-section">
        <h2>Privacy preferences</h2>
        <p className="portal-muted" style={{ marginBottom: '1.5rem' }}>
          Live controls will be enabled after authentication is connected.
        </p>
        <div className="settings-toggle-list">
          {privacyToggles.map((toggle) => (
            <div className="settings-toggle-row" key={toggle.id}>
              <div>
                <strong>{toggle.label}</strong>
                <p className="microcopy">{toggle.description}</p>
              </div>
              <label className="toggle-switch" aria-label={toggle.label}>
                <input defaultChecked={toggle.default} disabled type="checkbox" />
                <span className="toggle-track" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2>Visibility</h2>
        <div className="settings-toggle-list">
          <div className="settings-toggle-row">
            <div>
              <strong>Instructor visibility</strong>
              <p className="microcopy">Who can see your progress and evidence.</p>
            </div>
            <select className="settings-select" disabled defaultValue="private">
              <option value="private">Private</option>
              <option value="assigned_work">Assigned work only</option>
            </select>
          </div>
          <div className="settings-toggle-row">
            <div>
              <strong>Portfolio visibility</strong>
              <p className="microcopy">Who can view your portfolio evidence.</p>
            </div>
            <select className="settings-select" disabled defaultValue="private">
              <option value="private">Private</option>
              <option value="reviewers">Reviewers I choose</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Account</h2>
        <div className="settings-action-list">
          <div className="settings-action-row">
            <div>
              <strong>Export your data</strong>
              <p className="microcopy">Download all your notes, progress, and evidence as JSON.</p>
            </div>
            <button className="button button-secondary" disabled type="button">
              Export data
            </button>
          </div>
          <div className="settings-action-row settings-danger-row">
            <div>
              <strong>Delete account</strong>
              <p className="microcopy">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
            <button className="button button-danger" disabled type="button">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

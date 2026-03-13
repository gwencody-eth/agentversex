import { useState } from 'react';

const initialState = {
  name: '',
  alias: '',
  description: '',
  endpoint: '',
  skills: 'research, sentiment, execution',
  priceHbar: '0.10',
  riskProfile: 'balanced',
};

export default function AgentForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialState);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({
      ...form,
      skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      priceHbar: Number(form.priceHbar),
    });
    setForm(initialState);
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h3>Register agent</h3>
      <input name="name" placeholder="Agent name" value={form.name} onChange={handleChange} required />
      <input name="alias" placeholder="Alias" value={form.alias} onChange={handleChange} required />
      <input name="endpoint" placeholder="Callback endpoint" value={form.endpoint} onChange={handleChange} />
      <input name="priceHbar" placeholder="Price in HBAR" value={form.priceHbar} onChange={handleChange} />
      <select name="riskProfile" value={form.riskProfile} onChange={handleChange}>
        <option value="low">Low risk</option>
        <option value="balanced">Balanced</option>
        <option value="high">High risk</option>
      </select>
      <input name="skills" placeholder="Comma separated skills" value={form.skills} onChange={handleChange} />
      <textarea name="description" placeholder="What this agent does" value={form.description} onChange={handleChange} rows={4} />
      <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register agent'}</button>
    </form>
  );
}

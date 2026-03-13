import { useState } from 'react';

const initialState = {
  title: '',
  description: '',
  rewardHbar: '0.25',
  skillTag: 'sentiment',
  postedByAgentId: '',
};

export default function TaskForm({ agents, onSubmit, loading }) {
  const [form, setForm] = useState(initialState);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({ ...form, rewardHbar: Number(form.rewardHbar) });
    setForm(initialState);
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h3>Post task</h3>
      <input name="title" placeholder="Task title" value={form.title} onChange={handleChange} required />
      <input name="skillTag" placeholder="Skill tag" value={form.skillTag} onChange={handleChange} required />
      <input name="rewardHbar" placeholder="Reward in HBAR" value={form.rewardHbar} onChange={handleChange} required />
      <select name="postedByAgentId" value={form.postedByAgentId} onChange={handleChange}>
        <option value="">Select poster agent</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>{agent.name}</option>
        ))}
      </select>
      <textarea name="description" placeholder="Task details" value={form.description} onChange={handleChange} rows={4} required />
      <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post task'}</button>
    </form>
  );
}

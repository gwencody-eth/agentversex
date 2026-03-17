import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  explainWithGemini,
  chatWithAgent,
  findBestAgent,
  getAgents,
  registerAgent,
  addReview,
  hireAgent,
} from "./services/api";

export default function App() {
  const [taskText, setTaskText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);

  const [chatMessage, setChatMessage] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  const [agentTask, setAgentTask] = useState("");
  const [bestAgentResult, setBestAgentResult] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  const [agentName, setAgentName] = useState("");
  const [agentSpecialty, setAgentSpecialty] = useState("");
  const [agentPrice, setAgentPrice] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const [reviewer, setReviewer] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [selectedReviewAgentId, setSelectedReviewAgentId] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  const [selectedHireAgentId, setSelectedHireAgentId] = useState("");
  const [hireMessage, setHireMessage] = useState("");

  const [ownerAccountId, setOwnerAccountId] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      setLoadingAgents(true);
      const data = await getAgents();
      setAgents(data);
      if (data.length > 0) {
        setSelectedReviewAgentId(data[0].id);
        setSelectedHireAgentId(data[0].id);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load agents.");
    } finally {
      setLoadingAgents(false);
    }
  }

  async function handleRegisterAgent() {
    if (!agentName.trim() || !agentSpecialty.trim() || !agentPrice.trim()) {
      setError("Please fill in agent name, specialty, and price.");
      return;
    }

    try {
      setError("");
      setRegisterMessage("");

      const result = await registerAgent({
        name: agentName,
        specialty: agentSpecialty,
        price: agentPrice,
        description: agentDescription,
        ownerAccountId,
      });

      setRegisterMessage(
        `Agent "${result.agent.name}" registered successfully.
        HOL Agent ID: ${result.agent.holAgentId || "Not available"}
        HOL Registered: ${result.agent.holRegistered ? "Yes" : "No"}
        HOL Protocol: ${result.agent.holProtocol || "N/A"}
        Hedera Ref: ${result.agent.hederaReferenceId || "N/A"}
        Hedera Tx ID: ${result.agent.hederaTxId || "N/A"}`
      );

      setOwnerAccountId("");
      setAgentName("");
      setAgentSpecialty("");
      setAgentPrice("");
      setAgentDescription("");

      await loadAgents();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to register agent.");
    }
  }

  async function handleExplain() {
    if (!taskText.trim()) {
      setError("Please enter a task to explain.");
      return;
    }

    try {
      setError("");
      setLoadingExplain(true);
      const result = await explainWithGemini(taskText);
      setExplanation(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoadingExplain(false);
    }
  }

  async function handleChat() {
    if (!chatMessage.trim()) {
      setError("Please enter a message for the agent.");
      return;
    }

    try {
      setError("");
      setLoadingChat(true);

      const agentProfile = {
        name: "AgentMarket Assistant",
        role: "Helpful AI marketplace agent",
        specialty: "task guidance and agent selection",
      };

      const result = await chatWithAgent(chatMessage, agentProfile);
      setChatReply(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoadingChat(false);
    }
  }

  async function handleFindBestAgent() {
    if (!agentTask.trim()) {
      setError("Please enter a task.");
      return;
    }

    try {
      setError("");
      setLoadingMatch(true);
      const result = await findBestAgent(agentTask);
      setBestAgentResult(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoadingMatch(false);
    }
  }

  async function handleAddReview() {
    if (!selectedReviewAgentId || !reviewer.trim() || !reviewRating) {
      setError("Please select an agent, reviewer name, and rating.");
      return;
    }

    try {
      setError("");
      setReviewMessage("");

      const result = await addReview(selectedReviewAgentId, {
        reviewer,
        rating: Number(reviewRating),
        comment: reviewComment,
      });

      setReviewMessage(
        `Review added. New average rating for ${result.agent.name}: ${result.agent.averageRating}`
      );

      setReviewer("");
      setReviewRating("");
      setReviewComment("");

      await loadAgents();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to add review.");
    }
  }

  async function handleHireAgent(agentId) {
    try {
      setError("");
      setHireMessage("");

      const result = await hireAgent(agentId, {
        hirerName: "Ruth",
      });

      setHireMessage(
        `Hired ${result.payment.agentName}.
Payment ID: ${result.payment.paymentId}
Hedera Tx ID: ${result.payment.hederaPaymentTxId}
Receipt Status: ${result.payment.receiptStatus}
Amount: ${result.payment.amount}
Receiver: ${result.payment.receiverAccountId}
Network: ${result.payment.network}`
      );
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to hire agent.");
    }
  }

  function handleClearAll() {
    setTaskText("");
    setExplanation("");
    setChatMessage("");
    setChatReply("");
    setAgentTask("");
    setBestAgentResult(null);
    setError("");
    setRegisterMessage("");
    setReviewMessage("");
    setHireMessage("");
  }

  function getMarketplaceStats() {
    const totalAgents = agents.length;

    const totalReviews = agents.reduce(
      (sum, agent) => sum + (agent.reviews?.length || 0),
      0
    );

    const totalHederaRegistered = agents.filter(
      (agent) => agent.hederaReferenceId || agent.hederaTxId
    ).length;

    const totalHolRegistered = agents.filter(
      (agent) => agent.holRegistered
    ).length;

    const averageMarketplaceRating =
      totalAgents > 0
        ? (
            agents.reduce(
              (sum, agent) => sum + Number(agent.averageRating || 0),
              0
            ) / totalAgents
          ).toFixed(1)
        : "0.0";

    return {
      totalAgents,
      totalReviews,
      totalHederaRegistered,
      totalHolRegistered,
      averageMarketplaceRating,
    };
  }

  const stats = getMarketplaceStats();

  return (
    <div className="page">
      <div className="container">
        <h1>AgentVerseX</h1>
        <h3>Building the Future Workforce with Autonomous AI Agents</h3>
        <p>
          <i>
            AgentVerseX is a decentralized marketplace where AI agents discover
            tasks, collaborate with other agents, and execute work autonomously
            using Artificial Intelligence and Hedera’s fast, secure
            infrastructure.
          </i>
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalAgents}</h3>
            <p>Registered Agents</p>
          </div>

          <div className="stat-card">
            <h3>{stats.totalReviews}</h3>
            <p>Total Reviews</p>
          </div>

          <div className="stat-card">
            <h3>{stats.totalHederaRegistered}</h3>
            <p>Hedera-Logged Agents</p>
          </div>

          <div className="stat-card">
            <h3>{stats.totalHolRegistered}</h3>
            <p>HOL-Registered Agents</p>
          </div>

          <div className="stat-card">
            <h3>{stats.averageMarketplaceRating}</h3>
            <p>Average Rating</p>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="grid">
          <section className="card">
            <h2>Register Agent</h2>

            <input
              type="text"
              placeholder="Agent name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Agent specialty"
              value={agentSpecialty}
              onChange={(e) => setAgentSpecialty(e.target.value)}
            />

            <input
              type="text"
              placeholder="Agent price in HBAR"
              value={agentPrice}
              onChange={(e) => setAgentPrice(e.target.value)}
            />

            <input
              type="text"
              placeholder="Agent Hedera payout account ID (e.g. 0.0.123456)"
              value={ownerAccountId}
              onChange={(e) => setOwnerAccountId(e.target.value)}
            />

            <textarea
              placeholder="Agent description"
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
            />

            <button onClick={handleRegisterAgent}>Register Agent</button>

            <div className="output-box">
              <h3>Registration Status</h3>
              <p>{registerMessage || "Agent registration result will appear here."}</p>
            </div>
          </section>

          <section className="card">
            <h2>Explain a Task</h2>

            <textarea
              placeholder="Enter a task you want Gemini to explain..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />

            <button onClick={handleExplain} disabled={loadingExplain}>
              {loadingExplain ? "Explaining..." : "Explain Task"}
            </button>

            <div className="output-box">
              <h3>Explanation</h3>
              <ReactMarkdown>
                {explanation || "Your explanation will appear here."}
              </ReactMarkdown>
            </div>
          </section>

          <section className="card">
            <h2>Chat with Agent</h2>

            <textarea
              placeholder="Type your message to the AI agent..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />

            <button onClick={handleChat} disabled={loadingChat}>
              {loadingChat ? "Sending..." : "Chat with Agent"}
            </button>

            <div className="output-box">
              <h3>Agent Reply</h3>
              <p>{chatReply || "The agent reply will appear here."}</p>
            </div>
          </section>

          <section className="card">
            <h2>Find the Best Agent</h2>

            <textarea
              placeholder="Describe the task so Gemini can choose the best agent..."
              value={agentTask}
              onChange={(e) => setAgentTask(e.target.value)}
            />

            <button onClick={handleFindBestAgent} disabled={loadingMatch}>
              {loadingMatch ? "Matching..." : "Find Best Agent"}
            </button>

            <button onClick={handleClearAll}>Clear All</button>

            <div className="output-box">
              <h3>Best Match Result</h3>

              {bestAgentResult ? (
                <>
                  <p>Best Agent ID: {bestAgentResult.bestAgentId}</p>
                  <p>Reason: {bestAgentResult.reason}</p>
                  <p>Confidence: {bestAgentResult.confidence}%</p>
                  {bestAgentResult.bestAgent && (
                    <>
                      <p>Name: {bestAgentResult.bestAgent.name}</p>
                      <p>Specialty: {bestAgentResult.bestAgent.specialty}</p>
                      <p>Price: {bestAgentResult.bestAgent.price}</p>
                    </>
                  )}
                </>
              ) : (
                <p>The best agent result will appear here.</p>
              )}
            </div>
          </section>

          <section className="card full-width">
            <h2>Marketplace Agents</h2>

            {loadingAgents ? (
              <p>Loading agents...</p>
            ) : agents.length === 0 ? (
              <p>No agents found.</p>
            ) : (
              <div className="agent-list">
                {agents.map((agent) => (
                  <div key={agent.id} className="agent-card">
                    <h4>{agent.name}</h4>
                    <p><strong>ID:</strong> {agent.id}</p>
                    <p><strong>Specialty:</strong> {agent.specialty}</p>
                    <p><strong>Price:</strong> {agent.price}</p>
                    <p><strong>Risk:</strong> {agent.riskLevel}</p>
                    <p><strong>Description:</strong> {agent.description || "None"}</p>
                    <p><strong>Avg Rating:</strong> {agent.averageRating || 0}</p>
                    <p><strong>HOL Agent ID:</strong> {agent.holAgentId || "Not registered yet"}</p>
                    <p><strong>HOL Registered:</strong> {agent.holRegistered ? "Yes" : "No"}</p>
                    <p><strong>HOL Protocol:</strong> {agent.holProtocol || "N/A"}</p>
                    <p><strong>HOL Endpoint:</strong> {agent.holEndpoint || "N/A"}</p>
                    <p><strong>Hedera Ref:</strong> {agent.hederaReferenceId || "N/A"}</p>
                    <p><strong>Hedera Tx:</strong> {agent.hederaTxId || "N/A"}</p>
                    <p><strong>Payout Account:</strong> {agent.ownerAccountId || "Not set"}</p>

                    <button onClick={() => handleHireAgent(agent.id)}>
                      Hire Agent
                    </button>

                    <div className="reviews-box">
                      <h5>Reviews</h5>
                      {agent.reviews?.length ? (
                        agent.reviews.map((review) => (
                          <div key={review.id} className="review-item">
                            <p>
                              <strong>{review.reviewer}</strong> - {review.rating}/5
                            </p>
                            <p>{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p>No reviews yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="output-box">
              <h3>Hire Status</h3>
              <p>{hireMessage || "Marketplace payment result will appear here."}</p>
            </div>
          </section>

          <section className="card full-width">
            <h2>Add Review</h2>

            <select
              value={selectedReviewAgentId}
              onChange={(e) => setSelectedReviewAgentId(e.target.value)}
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Reviewer name"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
            />

            <input
              type="number"
              min="1"
              max="5"
              placeholder="Rating (1-5)"
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
            />

            <textarea
              placeholder="Write your review"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />

            <button onClick={handleAddReview}>Submit Review</button>

            <div className="output-box">
              <h3>Review Status</h3>
              <p>{reviewMessage || "Review submission result will appear here."}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
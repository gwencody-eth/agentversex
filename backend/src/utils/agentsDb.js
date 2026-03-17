import { supabase } from "../config/supabase.js";

export async function readAgents() {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map((agent) => ({
    ...agent,
    riskLevel: agent.risk_level,
    holAgentId: agent.hol_agent_id,
    holRegistered: agent.hol_registered,
    holProtocol: agent.hol_protocol,
    holProfileUrl: agent.hol_profile_url,
    holEndpoint: agent.hol_endpoint,
    registeredOnHedera: agent.registered_on_hedera,
    hederaTxId: agent.hedera_tx_id,
    hederaReferenceId: agent.hedera_reference_id,
    ownerAccountId: agent.owner_account_id,
    averageRating: Number(agent.average_rating || 0),
    reviews: agent.reviews || [],
  }));
}

export async function insertAgent(agent) {
  const payload = {
    id: agent.id,
    name: agent.name,
    specialty: agent.specialty,
    price: agent.price,
    description: agent.description || "",
    risk_level: agent.riskLevel || "medium",
    hol_agent_id: agent.holAgentId || null,
    hol_registered: !!agent.holRegistered,
    hol_protocol: agent.holProtocol || null,
    hol_profile_url: agent.holProfileUrl || null,
    hol_endpoint: agent.holEndpoint || null,
    registered_on_hedera: !!agent.registeredOnHedera,
    hedera_tx_id: agent.hederaTxId || null,
    hedera_reference_id: agent.hederaReferenceId || null,
    owner_account_id: agent.ownerAccountId || null,
    average_rating: Number(agent.averageRating || 0),
    reviews: agent.reviews || [],
  };

  const { data, error } = await supabase
    .from("agents")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateAgent(agentId, updates) {
  const payload = {};

  if ("averageRating" in updates) payload.average_rating = Number(updates.averageRating || 0);
  if ("reviews" in updates) payload.reviews = updates.reviews || [];
  if ("name" in updates) payload.name = updates.name;
  if ("specialty" in updates) payload.specialty = updates.specialty;
  if ("price" in updates) payload.price = updates.price;
  if ("description" in updates) payload.description = updates.description;
  if ("ownerAccountId" in updates) payload.owner_account_id = updates.ownerAccountId;
  if ("hederaTxId" in updates) payload.hedera_tx_id = updates.hederaTxId;
  if ("hederaReferenceId" in updates) payload.hedera_reference_id = updates.hederaReferenceId;

  const { data, error } = await supabase
    .from("agents")
    .update(payload)
    .eq("id", agentId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

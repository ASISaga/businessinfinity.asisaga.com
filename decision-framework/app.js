import { API_BASE_URL } from '../assets/js/config.js';
import { BoardroomAPI } from '../assets/js/boardroom/boardroomApi.js';

const api = new BoardroomAPI();

async function runDecision() {
  let evidence;
  try { 
    evidence = JSON.parse(document.getElementById("evidence").value || "{}"); 
  } catch { 
    showToast('Invalid JSON format', 'error');
    return; 
  }
  
  try {
    // Use the new backend API for strategic decisions
    const type = evidence.type || 'strategic';
    const context = evidence.context || JSON.stringify(evidence);
    const stakeholders = evidence.stakeholders || ['CEO', 'CFO', 'CTO'];
    
    const result = await api.createDecision(type, context, stakeholders, evidence);
    
    // Display the decision result
    renderDecisionResult(result);
    
    // Show toast notification
    showToast('Decision created successfully', 'success');
  } catch (error) {
    console.error('Error creating decision:', error);
    showToast('Failed to create decision: ' + error.message, 'error');
  }
}

function renderDecisionResult(result) {
  const pathElem = document.getElementById("pathpre");
  pathElem.textContent = JSON.stringify(result, null, 2);
  
  const heatmapElem = document.getElementById("heatmap");
  heatmapElem.innerHTML = '';
  
  const card = document.createElement("div");
  card.className = "decision-card";
  
  const title = document.createElement("h3");
  title.textContent = `Decision ${result.decision_id}`;
  card.appendChild(title);
  
  const status = document.createElement("p");
  status.innerHTML = `<span class="badge badge-${result.status}">${result.status}</span>`;
  card.appendChild(status);
  
  heatmapElem.appendChild(card);
}

function renderPath(path) {
  document.getElementById("pathpre").textContent = JSON.stringify(path, null, 2);
}

function renderHeatmap(path) {
  const container = document.getElementById("heatmap");
  container.innerHTML = "";
  path.forEach(step => {
    const card = document.createElement("div");
    card.className = "card";
    const title = document.createElement("h3");
    title.textContent = `Node ${step.node_id} → ${step.result.choice}`;
    card.appendChild(title);
    const legends = step.result.legend_heatmap;
    legends.forEach((scores, idx) => {
      const p = document.createElement("p");
      p.innerHTML = Object.entries(scores).map(([k, v]) => `<span class="badge">${k}: ${(v*100).toFixed(0)}%</span>`).join("");
      card.appendChild(p);
    });
    container.appendChild(card);
  });
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

let ws;
function connectMCP() {
  const wsUrl = `ws://${location.hostname}:8765`;
  ws = new WebSocket(wsUrl);
  ws.onopen = () => console.log("MCP connected");
  ws.onmessage = (ev) => console.log("MCP:", ev.data);
  ws.onclose = () => setTimeout(connectMCP, 1000);
  ws.onerror = () => console.log("MCP connection error - this is optional");
}
// MCP is optional, don't fail if it's not available
try {
  connectMCP();
} catch (e) {
  console.log("MCP not available:", e);
}

document.getElementById("run").onclick = runDecision;

document.getElementById("setBlend").onclick = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    showToast('MCP not connected', 'error');
    return;
  }
  const nodeId = document.getElementById("nodeId").value;
  const blend = document.getElementById("blend").value;
  ws.send(JSON.stringify({ jsonrpc: "2.0", id: "1", method: "set_blend", params: { node_id: nodeId, blend } }));
};

document.getElementById("switchAdapter").onclick = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    showToast('MCP not connected', 'error');
    return;
  }
  const role = document.getElementById("role").value;
  const legend = document.getElementById("legend").value;
  ws.send(JSON.stringify({ jsonrpc: "2.0", id: "2", method: "switch_adapter", params: { role, legend } }));
};
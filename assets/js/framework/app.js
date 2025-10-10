const api = (path) => `${location.origin.replace(/:\d+$/, ":8000")}${path}`; // assume server runs on 8000
const wsUrl = `ws://${location.hostname}:8765`;

async function runDecision() {
  let evidence;
  try { evidence = JSON.parse(document.getElementById("evidence").value || "{}"); }
  catch { alert("Invalid JSON"); return; }
  const res = await fetch(api("/decisions/run"), {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ data: evidence })
  });
  const data = await res.json();
  renderPath(data.path);
  renderHeatmap(data.path);
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

let ws;
function connectMCP() {
  ws = new WebSocket(wsUrl);
  ws.onopen = () => console.log("MCP connected");
  ws.onmessage = (ev) => console.log("MCP:", ev.data);
  ws.onclose = () => setTimeout(connectMCP, 1000);
}
connectMCP();

document.getElementById("run").onclick = runDecision;

document.getElementById("setBlend").onclick = () => {
  const nodeId = document.getElementById("nodeId").value;
  const blend = document.getElementById("blend").value;
  ws.send(JSON.stringify({ jsonrpc: "2.0", id: "1", method: "set_blend", params: { node_id: nodeId, blend } }));
};

document.getElementById("switchAdapter").onclick = () => {
  const role = document.getElementById("role").value;
  const legend = document.getElementById("legend").value;
  ws.send(JSON.stringify({ jsonrpc: "2.0", id: "2", method: "switch_adapter", params: { role, legend } }));
};
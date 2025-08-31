// call_endpoint.js
// Vanilla JS for calling Azure ML online endpoint (used by call_endpoint.html)

async function callEndpoint() {
  const endpointUrl = "https://<your-endpoint-name>.<region>.inference.ml.azure.com/score";
  const apiKey = "<your-endpoint-key>";
  const payload = {
    adapter_name: "qv", // or "ko" or any available adapter
    input_data: "your input here"
  };
  const resElem = document.getElementById('result');
  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    resElem.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    resElem.textContent = 'Error: ' + err;
  }
}

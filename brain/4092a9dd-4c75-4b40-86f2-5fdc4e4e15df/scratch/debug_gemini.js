const API_KEY = "AIzaSyCpBurYDk1pQcgAiuRNrsJGfp4XLosYbRo";

async function run() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    console.log("Listing models from:", url);
    const res = await fetch(url);
    console.log("Status:", res.status, res.statusText);
    const body = await res.json();
    console.log("Response:", JSON.stringify(body, null, 2));
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

run();

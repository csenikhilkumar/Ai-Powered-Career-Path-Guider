
async function testApi() {
  try {
    const response = await fetch("http://localhost:3004/ai/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        careerPathTitle: "Blockchain Developer",
        currentStage: "Beginner",
        interests: ["Crypto", "Coding"]
      })
    });
    
    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Body:", text);
  } catch (e) {
    console.error("Error:", e);
  }
}

testApi();


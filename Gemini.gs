// Constants for project information
const PROJECT_ID = 'stellar-horizon-438503-s6';
const LOCATION = 'us-central1';
const GEMINI_MODEL_ID = 'gemini-1.5-flash-002'; // Change as necessary
const CACHE = CacheService.getUserCache();

function auth() { 
  token = ScriptApp.getOAuthToken();  
  CACHE.put("token", token);
}
// Helper function to get OAuth token from cache
function getOAuthToken() {
  const token = CACHE.get("token");
  if (!token) {
    Logger.log("Token not found");
    return null;
  }
  return token;
}


// Function to generate content using the Gemini API
function askGemini(inputText) {
  const token = getOAuthToken();
  if (!token) return "ERROR: Missing OAuth token";

  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${GEMINI_MODEL_ID}:generateContent`;
  const data = {
    contents: {
      role: "USER",
      parts: [{ "text": inputText }]
    },
    generation_config: {
      temperature: 0.3,
      topP: 1,
      maxOutputTokens: 256
    }
  };

  const options = {
    method: "post",
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify(data)
  };

  return fetchDataFromGemini(url, options);
}

function askGeminiAdvanced(inputText,temperature,topP,maxOutputTokens) {
  const token = getOAuthToken();
  if (!token) return "ERROR: Missing OAuth token";

  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${GEMINI_MODEL_ID}:generateContent`;
  const data = {
    contents: {
      role: "USER",
      parts: [{ "text": inputText }]
    },
    generation_config: {
      temperature:temperature,
      topP: topP,
      maxOutputTokens: maxOutputTokens
    }
  };

  const options = {
    method: "post",
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify(data)
  };

  return fetchDataFromGemini(url, options);
}

// Helper function to handle API response from Gemini
function fetchDataFromGemini(url, options) {
  try {
    const response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() === 200) {
      const json = JSON.parse(response.getContentText());
      return json.candidates[0].content.parts[0].text;
    } else {
      Logger.log(`Error response: ${response.getContentText()}`);
      return "ERROR: API request failed";
    }
  } catch (error) {
    Logger.log('Error: ' + error.message);
    return `ERROR: ${error.message}`;
  }
}

// Translate input text using Gemini API
function translate(inputText) {
  const token = getOAuthToken();
  if (!token) return "ERROR: Missing OAuth token";

  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-1.0-pro:generateContent`;
  const data = {
    contents: {
      role: "USER",
      parts: [{ "text": "translate to Spanish: " + inputText }]
    },
    generation_config: {
      temperature: 0.3,
      topP: 1,
      maxOutputTokens: 256
    }
  };

  const options = {
    method: "post",
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify(data)
  };

  return fetchDataFromGemini(url, options);
}

// Generate report from input data
function report(inputText) {
  const token = getOAuthToken();
  if (!token) return "ERROR: Missing OAuth token";

  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-1.0-pro:generateContent`;
  const prompt = `Role: You are a financial analyst and you are required to summarise the key insights of given numerical tables. Task: List important highlights from the figures, and write a summary of net income comparing years.`;
  const data = {
    contents: { role: "USER", parts: [{ "text": prompt + inputText }] },
    generation_config: { temperature: 0.3, topP: 1, maxOutputTokens: 2000 }
  };

  const options = {
    method: "post",
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify(data)
  };

  return fetchDataFromGemini(url, options);
}

// Convert a range of data into a markdown table and then call report function
function reported(cellRange) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const values = sheet.getRange(cellRange).getValues();
  
  if (!values.length || !values[0].length) return "ERROR: Empty range or missing headers";

  let markdownTable = "|";
  values[0].forEach(header => markdownTable += ` ${header} |`);
  markdownTable += "\n| " + "-".repeat(values[0].length * 4) + " |\n";

  values.slice(1).forEach(row => {
    markdownTable += "| " + row.join(" | ") + " |\n";
  });

  return report(markdownTable);
}


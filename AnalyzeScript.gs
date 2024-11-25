// General function to analyze various types of data based on the range and prompt
function analyzeData(rangeCell, promptCell, dataType) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Get the values from the user-provided range
  const data = sheet.getRange(rangeCell).getValues();
  
  // Initialize a variable to hold the formatted data
  let formattedData = "";
  
  // Format the data based on the data type
  switch (dataType) {
    case 'feedback':
      data.forEach(row => {
        formattedData += `Customer ${row[0]} rated ${row[1]}: ${row[2]}\n`;
      });
      break;
    
    case 'marketResearch':
      data.forEach(row => {
        formattedData += `Product: ${row[1]} | Rating: ${row[2]} | Review: ${row[3]}\n`;
      });
      break;
    
    case 'employeeSurvey':
      data.forEach(row => {
        formattedData += `Employee ${row[0]} | Job Satisfaction: ${row[1]} | Work-life Balance: ${row[2]} | Feedback: ${row[3]} | Department: ${row[4]} | Date: ${row[5]}\n`;
      });
      break;
    
    default:
      throw new Error('Unknown data type');
  }
  
  // Combine the prompt with the formatted data
  const prompt = promptCell + '\n\n' + formattedData;
  
  // Call the Gemini API for insights
  const insights = askGemini(prompt); 
  
  return insights;
}

// General function to analyze various types of data based on the range and prompt
function analyzeDataAdvanced(rangeCell, promptCell, dataType,temperature,topP,maxOutputTokens) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Get the values from the user-provided range
  const data = sheet.getRange(rangeCell).getValues();
  
  // Initialize a variable to hold the formatted data
  let formattedData = "";
  
  // Format the data based on the data type
  switch (dataType) {
    case 'feedback':
      data.forEach(row => {
        formattedData += `Customer ${row[0]} rated ${row[1]}: ${row[2]}\n`;
      });
      break;
    
    case 'marketResearch':
      data.forEach(row => {
        formattedData += `Product: ${row[1]} | Rating: ${row[2]} | Review: ${row[3]}\n`;
      });
      break;
    
    case 'employeeSurvey':
      data.forEach(row => {
        formattedData += `Employee ${row[0]} | Job Satisfaction: ${row[1]} | Work-life Balance: ${row[2]} | Feedback: ${row[3]} | Department: ${row[4]} | Date: ${row[5]}\n`;
      });
      break;
    
    default:
      throw new Error('Unknown data type');
  }
  
  // Combine the prompt with the formatted data
  const prompt = promptCell + '\n\n' + formattedData;
  
  // Call the Gemini API for insights
  const insights = askGeminiAdvanced(prompt,temperature,topP,maxOutputTokens); 
  
  return insights;
}


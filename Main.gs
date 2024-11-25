// Main.gs
function startApp() {
   // Call the function from UI.gs
}

// Add custom menu in Google Sheets
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('BigQuery Menu')
    .addItem('Fetch Data from BigQuery','showSheetAndTablePrompt')
    .addToUi();
}
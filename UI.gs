function showSheetAndTablePrompt() {
  var ui = SpreadsheetApp.getUi();
  
  // Prompt for sheet name
  var sheetResponse = ui.prompt('Enter the sheet name:', 'Example: "Sheet1"', ui.ButtonSet.OK_CANCEL);
  var sheetName = sheetResponse.getResponseText();

  if (sheetResponse.getSelectedButton() != ui.Button.OK || !sheetName) {
    ui.alert('No sheet name provided or action cancelled.');
    return;
  }

  // Prompt for table name
  var tableResponse = ui.prompt('Enter the BigQuery table name (in the format project_id.dataset.table):', 'Example: "my_project.my_dataset.my_table"', ui.ButtonSet.OK_CANCEL);
  var tableName = tableResponse.getResponseText();

  if (tableResponse.getSelectedButton() != ui.Button.OK || !tableName) {
    ui.alert('No table name provided or action cancelled.');
    return;
  }

  // Call the BigQuery function with the user inputs
  fetchDataFromBigQuery(sheetName, tableName);
}
function fetchDataFromBigQuery(sheetName, tableName) {
  var ui = SpreadsheetApp.getUi();

  try {
    var data = queryBigQuery(tableName);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      ui.alert('Sheet "' + sheetName + '" not found.');
      return;
    }

    // Optional: Clear the sheet before setting new data
    sheet.clear();
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    
    ui.alert('Data fetched successfully!');
  } catch (e) {
    ui.alert('Error: ' + e.message);
  }
}

function queryBigQuery(tableName) {
  var projectId = 'stellar-horizon-438503-s6';  // Replace with your actual project ID
  var query = `SELECT * FROM \`${tableName}\` LIMIT 10`;  // Dynamic query using the provided table name

  var request = {
    query: query,
    useLegacySql: false
  };

  var queryResults = BigQuery.Jobs.query(request, projectId);

  if (queryResults.rows) {
    var data = [];
    
    queryResults.rows.forEach(function(row) {
      var rowData = row.f.map(function(cell) {
        return cell.v;
      });
      data.push(rowData);
    });

    return data;
  } else {
    throw new Error('No data returned from BigQuery.');
  }
}
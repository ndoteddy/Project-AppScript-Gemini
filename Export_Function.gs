function exportToGoogleDoc() {
  // Get the active Google Sheets document
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = Browser.inputBox('Enter the range of data (e.g., A2:D10):');
  if (!range) {
    Browser.msgBox('No range entered. Please try again.');
    return;
  }

  var data = sheet.getRange(range).getValues(); // Get data from the range

  
  // Create a new Google Doc
  var doc = DocumentApp.create('AutoGen Doc - GDG Dev Fest KL 2024');
  var body = doc.getBody();
  
  // Loop through each row and column to write the data to the Google Doc
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var rowText = row.join(' | '); // Use '|' to separate the cells in each row (you can change it to any separator you like)
    body.appendParagraph(rowText); // Add the row data to the document
  }
  
  // Log the URL of the generated Google Doc
  Logger.log('Google Doc created: ' + doc.getUrl());
}


function exportToSlides() {
  // 1. Prompt the user for the data range and validate input
  const range = Browser.inputBox('Enter the range of data (e.g., A2:D10):');
  if (!range) {
    Browser.msgBox('No range entered. Please try again.');
    return;
  }

  // 2. Define the background image URL (example: galaxy image)
  const backgroundImageUrl = 'https://www.nasa.gov/wp-content/themes/nasa/assets/images/404-bg.jpg';

  // 3. Get the data from the specified range in the active sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getRange(range).getValues(); // Get data from the range

  // 4. Create a new Google Slides presentation
  const presentation = SlidesApp.create('AutoGen Slide - GDG Dev Fest KL 2024');

  // 5. Setup the first slide (title slide)
  const firstSlide = presentation.getSlides()[0];
  firstSlide.getBackground().setPictureFill(UrlFetchApp.fetch(backgroundImageUrl).getBlob());  // Set background image

  // Title and Subtitle Text for the first slide
  setTextStyle(firstSlide.getShapes()[0], 'Gemini Result - Final Presentation');
  setTextStyle(firstSlide.getShapes()[1], 'Hernando Ivan Teddy');

  // 6. Create slides based on data rows
  for (let i = 1; i < data.length; i++) {
    const [title, subtitle, content] = data[i];

    // Create a slide and set background image
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    setSlideBackground(slide, backgroundImageUrl);
    
    // Set the slide title and subtitle text
    setTextStyle(slide.getShapes()[0], title);
    setTextStyle(slide.getShapes()[1], subtitle);

    // Optionally, add content to the subtitle section
    if (content) {
      slide.getShapes()[1].getText().appendText('\n\n' + content);
    }
  }

  // 7. Add Q&A slide
  const qaSlide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_ONLY);
  setSlideBackground(qaSlide, backgroundImageUrl);
  const textBox = qaSlide.insertTextBox('Q&A');
  textBox.setLeft(200).setTop(180).setWidth(320).setHeight(180);  // Center text box
  textBox.getText().getTextStyle().setForegroundColor('#FFFFFF').setFontSize(60);  // White, larger text

  // 8. Log the URL of the generated presentation
  Logger.log('Presentation created: ' + presentation.getUrl());
  return presentation.getUrl();  // Return the URL of the new presentation
}

// Helper function to set text and style
function setTextStyle(shape, text) {
  const textBox = shape.getText();
  textBox.setText(text);
  textBox.getTextStyle().setForegroundColor('#FFFFFF');  // White text color
}

// Helper function to set background image for slides
function setSlideBackground(slide, imageUrl) {
  try {
    const imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();  // Fetch image and convert to Blob
    slide.getBackground().setPictureFill(imageBlob);  // Set as background
  } catch (e) {
    Logger.log('Failed to set background image: ' + e.message);
  }
}

// The 'start' function is called when the client library is loaded
function start() {
  gapi.client.init({
    'apiKey': ', // Replace with your actual API key
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    // Make the API request to get data from the spreadsheet
    return gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '', // Replace with your actual spreadsheet ID
      range: 'Sheet1!E1:E', // Adjust the range to target the correct cells
    });
  }).then(function(response) {
    // Process the response to get the data in the format needed for Chart.js
    const values = response.result.values;
    const data = processData(values);
    // Call the function to draw the chart
    drawChart(data);
  }, function(reason) {
    // Log any errors
    console.error('error: ' + reason.result.error.message);
  });
}

// The 'loadClient' function is called to load the Google API client library
function loadClient() {
  gapi.load('client', start);
}

// The 'processData' function takes the raw data from the Sheets API and counts the occurrences of each item
function processData(values) {
  let counts = {};
  values.forEach(function(row) {
    // Count each occurrence of an item
    const item = row[0];
    if (counts[item]) {
      counts[item]++;
    } else {
      counts[item] = 1;
    }
  });
  return counts;
}

// The 'drawChart' function initializes Chart.js with the data and draws the bar chart
function drawChart(data) {
  const ctx = document.getElementById('myChart').getContext('2d');
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: 'Number of Items',
      data: Object.values(data),
      backgroundColor: 'rgba(0, 123, 255, 0.5)',
      borderColor: 'rgba(0, 123, 255, 1)',
      borderWidth: 1
    }]
  };
  // Initialize a new Chart instance
  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Wait for the window to load, then load the Google API client
window.onload = loadClient;


const url = "https://fgsalomao.github.io/Project-3/resources/crime_data.json";
let donutData = null;
doughnutChart({});
let metadata = {};


// Fetch the JSON data and console log it
let dataPromise = d3.json(url).then(function(data) {
  metadata = data;

  d3.select("#selDataset").append("option").attr("value","").html('--Select one--');

  console.log(metadata);

  for (const key in data) {
    d3.select("#selDataset").append("option").attr("value",key).html(key);
  }
  
});


function optionChanged(district) {

  if (district != '') {
    console.log(district);

    let selected_district = metadata[district];
    console.log(selected_district)

    let crimeData = calculateTotalsForNeighborhood(selected_district);
    console.log(crimeData);
    updateChart(crimeData);
    
  }
  
}

function doughnutChart(data){
  const labels = Object.keys(data);
  const values = Object.values(data);

  // Obtain the 2D context of the canvas
  const canvas = d3.select("#doughnutChart").node().getContext("2d");

  if (donutData) {
    donutData.destroy(); // Destroy the existing chart if it exists
  }
  donutData = new Chart(canvas, {
    type:"doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Crime Distribution'
        }
      }
    },
  })
}

function updateChart(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  // Update chart data
  donutData.data.labels = labels;
  donutData.data.datasets[0].data = values;

  // Redraw the chart
  donutData.update();
}

function displayMetaData(m) {
  //console.log(m);
  d3.select("#sample-metadata").html('');
  //for (var key in m){
  //  let info = key + ": " + m[key];
  //  d3.select("#sample-metadata").append("h6").html(info);
  //}
}

//function for calculating the total of an array
function calculateTotal(array){
  let result = array.reduce((total,value) => total + value, 0);
  return result;
}

// Function to calculate crime totals for each neighborhood
function calculateTotalsForNeighborhood(neighborhood) {
  const totals = {};
  // Iterate through the keys
  for (let crime in neighborhood) {
    // Check if the value is an array
    if (Array.isArray(neighborhood[crime])) {
        let key = crime.substring(0, crime.indexOf('_'));

        // Calculate the total of the array and update the value
        totals[key] = calculateTotal(neighborhood[crime]);
    }
  }
  return totals;
}

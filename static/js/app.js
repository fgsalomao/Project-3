const url = "https://fgsalomao.github.io/Project-3/resources/crime_data.json";
let donutData = null;
let bubbleData = null; // Variable to hold bubble chart data
let lineData = null;

// Initialize both charts with empty data
doughnutChart({});
bubbleChart({});
linechart({});

let metadata = {};

// Fetch the JSON data and console log it
let dataPromise = d3.json(url).then(function(data) {
  metadata = data;

  // Clear previous options
  d3.select("#selDataset").html('');

  // Append default option
  d3.select("#selDataset").append("option").attr("value","").html('--Select one--');

  console.log(metadata);

  // Append options based on metadata
  for (const key in data) {
    d3.select("#selDataset").append("option").attr("value",key).html(key);
  }
});

// Function to handle option change in dropdown
function optionChanged(district) {
  if (district != '') {
    console.log(district);

    let selected_district = metadata[district];
    console.log(selected_district)

    let crimeData = calculateTotalsForNeighborhood(selected_district);
    console.log(crimeData);
    updateChart(crimeData);
    updateBubbleChart(crimeData); // Update bubble chart with new data
    linechart(selected_district);
  }
}

// Function to create and update the doughnut chart
function doughnutChart(data){
  const labels = Object.keys(data);
  const values = Object.values(data);

  const percentValues = calculatePercentage(values);

  // Obtain the context of the canvas
  const canvas = document.getElementById('doughnutChart').getContext('2d');

  donutData = new Chart(canvas, {
    type:"doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: percentValues,
        label: labels, // Main label for the dataset
        backgroundColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontColor: 'black', // Legend label color
            generateLabels: function(chart) {
              // Generate custom legend labels for doughnut chart
              return chart.data.labels.map(function(label, index) {
                return {
                  text: label, // Label text
                  fillStyle: chart.data.datasets[0].backgroundColor[index], // Match fill style with doughnut color
                  hidden: false, // Show all legends by default
                  strokeStyle: '',
                  lineWidth: 0, // Border width
                  pointStyle: 'circle' // Bubble shape
                };
              });
            }
          }
        },
        title: {
          display: true,
          text: 'Crime Distribution'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.parsed}%`;
            }
          }
        }
      }
    },
  });
}

// Function to update the doughnut chart with new data
function updateChart(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);
  
  const percentValues = calculatePercentage(values);
  
  // Update chart data
  donutData.data.labels = labels;
  donutData.data.datasets[0].data = percentValues;

  // Redraw the chart
  donutData.update();
}

// Function to create and update the bubble chart
function bubbleChart(data) {
  // Obtain the context of the canvas
  const canvas = document.getElementById('bubbleChart').getContext('2d');

  bubbleData = new Chart(canvas, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Crime Totals', // Main label for the dataset
        data: [], // Bubble chart data will be added dynamically
        backgroundColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      }]
    },
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Overall Total'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Totals by Crime'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Crime Totals'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Total: ${context.raw.x}, Overall Total: ${context.raw.y}`;
            }
          }
        },
        legend: {
          display: true,
          labels: {
            fontColor: 'black', // Legend label color
            fontSize: 12, // Legend label font size
            generateLabels: function(chart) {
              // Generate custom legend labels for bubble chart
              return chart.data.datasets[0].data.map(function(dataPoint, index) {
                return {
                  text: dataPoint.label, // Label text
                  fillStyle: bubbleData.data.datasets[0].backgroundColor[index], // Match fill style with bubble color
                  strokeStyle: bubbleData.data.datasets[0].borderColor[index], // Match border style with bubble color
                  hidden: false, // Show all legends by default
                  lineWidth: 1, // Border width
                  pointStyle: 'circle' // Bubble shape
                };
              });
            }
          }
        }
      }
    }
  });
}

// Function to update the bubble chart with new data
function updateBubbleChart(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  // Determine the scaling factor for the bubble sizes
  const maxTotal = Math.max(...values);
  const minTotal = Math.min(...values);
  const scalingFactor = 50 / (maxTotal - minTotal); // Adjust this value as needed to control bubble sizes

  // Generate bubble chart data
  const bubbleChartData = labels.map((label, index) => ({
    label: label,
    x: values[index],
    y: maxTotal, // Y-value remains constant to keep the bubble sizes consistent
    r: (values[index] - minTotal) * scalingFactor // Bubble size based on crime values and scaling factor
  }));

  // Update chart data
  bubbleData.data.datasets[0].data = bubbleChartData;

  // Redraw the chart
  bubbleData.update();
}

// Function to calculate the total of an array
function calculateTotal(array){
  return array.reduce((total,value) => total + value, 0);
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

// Function to calculate percentage
function calculatePercentage(total){
  let percentArray = [];
  let overallTotal = calculateTotal(total);
  for (let i=0;i<total.length; i++){
    let perc = ((total[i]/overallTotal)*100).toFixed(2);
    percentArray.push(perc);   
  }
  return percentArray;
}
function linechart (data){
  const ctx = document.getElementById('linechart').getContext('2d');
  const labels = [2014,2015,2016,2017,2018,2019,2020,2021,2022,2023];
  const datas = {
    labels: labels,
    datasets: [{
      label: 'Bike_Theft',
      data: data.BIKETHEFT_2014to2023,
      fill: false,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1
    },
    
    {
      label: 'Auto_Theft',
      data: data.AUTOTHEFT_2014to2023,
      fill: false,
      borderColor: 'rgba(255, 99, 132, 1)',
      tension: 0.1
    },

    {
      label: 'BreakEnter',
      data: data.BREAKENTER_2014to2023,
      fill: false,
      borderColor: 'rgba(54, 162, 235, 1)',
      tension: 0.1
    },

    {
      label: 'Shootings',
      data: data.SHOOTING_2014to2023,
      fill: false,
      borderColor: 'rgba(255, 206, 86, 1)',
      tension: 0.1
    }
]
  };
  linedata = new Chart(ctx, {
    type: 'line',
    data: datas
  });
}

function updatelinechart(data) {
  // Update chart data
  linedata.data.datasets[0].data = data.BIKETHEFT_2014to2023;
  linedata.data.datasets[1].data = data.AUTOTHEFT_2014to2023;
  linedata.data.datasets[2].data = data.BREAKENTER_2014to2023;
  linedata.data.datasets[3].data = data.SHOOTING_2014to2023;
  // Redraw the chart
  lineData.update();
}




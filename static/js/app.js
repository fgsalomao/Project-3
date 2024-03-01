const url = "https://fgsalomao.github.io/Project-3/resources/crime_data.json";


let metadata = {};


// Fetch the JSON data and console log it
let dataPromise = d3.json(url).then(function(data) {
  metadata = data;

  d3.select("#selDataset").append("option").attr("value","").html('--Choose an ID--');

  console.log(metadata);

  for (const key in data) {
    d3.select("#selDataset").append("option").attr("value",key).html(key);
  }
  
});


function optionChanged(district) {

  if (district != '') {
    console.log(district);

    //function select_by_id(x) {
    //  return x.id == id;
    //}

    let selected_district = metadata[district];
    console.log(selected_district)
  }
  
}

function displayMetaData(m) {
  //console.log(m);
  d3.select("#sample-metadata").html('');
  //for (var key in m){
  //  let info = key + ": " + m[key];
  //  d3.select("#sample-metadata").append("h6").html(info);
  //}
}

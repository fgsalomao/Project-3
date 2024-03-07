# Visual Analysis of Neighbourhood Crime in Toronto
A data visualization group project assignment for the University of Toronto Data Boot Camp - October 23 Cohort. 

## Team Members
**Ariana Kwapong**  
**Divya Sajjan**  
**Felipe Salomao**   
**Jeffrey Che**  
**Nes Atar**  
**Shileola Akinyele**  

## Overview
Exploring Trends in Crime Rates Analysis. This study looks at the Neighborhood crime rate in Toronto with a focus on 4 crime metrics (Bike theft, Auto theft, Break enter and Shooting), a period of 9 years is being considered (2014-2023). Data for this analysis was derived from the Toronto Police Service Public Safety Data Portal. The limitation associated with this study revolves around the completeness and timeliness of the data set. This can be linked to the way the data is being reported, approximate and not exact locations of crimes are being considered.

## Specification
- HTML, Javascript, CSS: Used to created static web application.
- Mongo DB: Data Storage.
    Command to import resources/Neighbourhood_Crime_Rates_Open_Data_chopped.geojson into MongoDB: "mongoimport --type json -d crime -c toronto_crime --drop --jsonArray Neighbourhood_Crime_Rates_Open_Data_chopped.geojson"
- Juypter Notebook: For data processing.
- Javascript Libraries:
    1) Boostrap - To create the navigation bar on top of the pages.
    2) Chart.js - To draw charts on index.html.
    3) D3 - For DOM tree element editing.
    4) Leaflet - To create map component and interactions.

## How to use
1) https://fgsalomao.github.io/Project-3/index.html
2) Download/Clone this repository.
    - Open index.html or map.html with a web browser.
    - On index.html, use the dropdown to filter selected data. Graphs will be populated onto the page.
    - On map.html, use the control panel to interact with the map.  
Extended GEOJSON data is also available via https: https://fgsalomao.github.io/Project-3/resources/Neighbourhood_Crime_Rates_Open_Data_Extended.geojson


## Ethical considerations
We used publicly available data for the purpose of our study and visuals. It does not contain any personal information. We have hosted it publicly on Github for any exploration of public interests. We do not have any algorithmic bias in the data that we are exploring or projecting as we are representing the crimes in the neighborhoods on crime statistics without reference to any individual or entity. 

## References
Neighbourhood Crime Rates Open Data. (n.d.). Data.torontopolice.on.ca. 
    https://data.torontopolice.on.ca/datasets/ea0cfecdb1de416884e6b0bf08a9e195_0/explore?location=43.680053%2C-79.355367%2C10.81

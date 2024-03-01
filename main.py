from flask import Flask, jsonify

app = Flask(__name__)

# Load GeoJSON data
with open('resources/Neighbourhood_Crime_Rates_Open_Data.geojson', 'r') as f:
    toronto_crime_data = f.read()

# Route to serve GeoJSON data
@app.route("/")
def get_crime_data():
    return toronto_crime_data


# Another route for displaying maps
@app.route('/toronto_crime_map')
def toronto_crime_map():
    return "This is another route."

if __name__ == '__main__':
    app.run(debug=True)
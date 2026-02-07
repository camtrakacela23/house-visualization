import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Census & Election Data Visualization</h1>
      <p>Hello World - Map Coming Soon!</p>
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: '500px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[39.8283, -98.5795]}>
          <Popup>
            Center of the United States! <br /> Ready for census and election data.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default App

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'
import SwingBarOption1 from './components/SwingBarOption1'
import SwingBarOption2 from './components/SwingBarOption2'

// Fix for default marker icons in bundled apps
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function App() {
  return (
    <div className="App">
      <h1>Census & Election Data Visualization</h1>
      <p>Generic Ballot Swing Bar - Design Comparison</p>

      {/* Swing Bar Visualizations */}
      <SwingBarOption1 />
      <SwingBarOption2 />

      {/* Map Section */}
      <div style={{ marginTop: '3rem' }}>
        <h2>Map View</h2>
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
    </div>
  )
}

export default App

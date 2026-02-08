import { useState } from 'react';
import Header from './components/common/Header';
import GenericBallotEstimator from './pages/GenericBallotEstimator';
import Explore from './pages/Explore';
import SeatProjections from './pages/SeatProjections';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('generic-ballot');

  const renderPage = () => {
    console.log('Rendering page for tab:', activeTab);
    try {
      switch (activeTab) {
        case 'generic-ballot':
          return <GenericBallotEstimator />;
        case 'explore':
          console.log('About to render Explore component');
          return <Explore />;
        case 'seat-projections':
          return <SeatProjections />;
        default:
          return <GenericBallotEstimator />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div style={{ padding: '2rem', color: 'red' }}>
          <h2>Error rendering page</h2>
          <p>{error.message}</p>
          <pre>{error.stack}</pre>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <ErrorBoundary>
        <main className="app-main">
          {renderPage()}
        </main>
      </ErrorBoundary>
    </div>
  );
}

export default App;

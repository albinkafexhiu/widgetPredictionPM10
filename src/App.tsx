import PredictionWidget from './components/PredictionWidget'

function App() {
  return (
    <div className="p-4">
      <PredictionWidget 
        latitude={41.9981}
        longitude={21.4254}
      />
    </div>
  );
}
export default App
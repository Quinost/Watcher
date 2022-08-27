import { Route, Routes } from 'react-router-dom';
import Player from './components/Player/Player';
import Remote from './components/Remote/Remote';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Player />} />
        <Route path='remote' element={<Remote />} />
      </Routes>
    </div>
  );
}

export default App;

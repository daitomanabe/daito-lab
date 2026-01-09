import { MainLayout } from './components/MainLayout';
import { Home } from './pages/Home';
import { OldKeynote } from './pages/OldKeynote';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/old-keynote" element={<OldKeynote />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;

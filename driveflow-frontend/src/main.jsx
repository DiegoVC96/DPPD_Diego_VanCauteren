import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PanelAdmin from './components/PanelAdmin';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* URL Principal: Renderiza el Home de clientes (Buscador, Categorías, Catálogo) */}
        <Route path="/" element={<App />} />
        
        {/* URL Requerida US #9: Aislada y protegida con menú administrativo exclusivo */}
        <Route path="/administración" element={<PanelAdmin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

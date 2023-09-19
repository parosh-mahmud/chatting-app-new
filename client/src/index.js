import React from 'react';
import { createRoot } from 'react-dom'; // Updated import
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import ChatProvider from './Context/ChatProvider';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <Router>
          <App />
        </Router>
      </ChakraProvider>
    </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>
);

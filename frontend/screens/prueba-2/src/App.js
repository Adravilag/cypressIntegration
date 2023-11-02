import logo from './logo.svg';
import './App.css';

function App() {

  return (
    <div className="App">
      <body>
        <h1>Prueba de Cypress - 2</h1>
        <button id='button1' onClick={() => { document.body.style.fontFamily = "Arial, Helvetica, sans-serif" }}>Cambiar tipo de letra</button>
      </body>
    </div>
  );
}

export default App;

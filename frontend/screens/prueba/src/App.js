import logo from './logo.svg';
import './App.css';

function App() {

  return (
    <div className="App">
      <body>
        <h1>Prueba de Cypress</h1>
        <button data-testid="button1" id="button1" onClick={() => {document.body.style.backgroundColor = "red"}}>Cambiar color de fondo</button>
        <button data-testid="button2" id="button2" onClick={() => {document.getElementById("button2").innerHTML = "Texto cambiado"}}>Cambiar texto</button>
      </body>
    </div>
  );
}

export default App;

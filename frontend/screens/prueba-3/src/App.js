import logo from './logo.svg';
import './App.css';

function App() {

  return (
    <div className="App">
      <body>
        <h1>Prueba de Cypress</h1>
        <button id="button1" onClick={() => {document.body.style.backgroundColor = "red"}}>Cambiar color de fondo</button>
        <button id="button2" onClick={() => {document.getElementById("button2").innerHTML = "Texto cambiado"}}>Cambiar texto</button>
      </body>
    </div>
  );
}

export default App;

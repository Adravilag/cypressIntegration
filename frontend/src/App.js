import React, { Component, createRef } from "react";
import axios from "axios";
import "./App.css"; // Importa el archivo CSS aquí
import IframeComponent from "./IframeComponent";
import TestSelector from "./TestSelector";
import Logs from "./Logs";
import { TEST_TO_PORT_MAPPING } from "./constants";
import { generateTestFile, downloadTestFile } from "./helpers";

class App extends Component {
  constructor(props) {
    super(props);
    this.iframeRef = createRef();
  }

  state = {
    logs: "",
    selectedTest: Object.keys(TEST_TO_PORT_MAPPING)[0],
    selectedScreen: "",
    isLoading: false,
    error: null,
    hasTestStarted: false,
    recording: false,
    actions: [],
  };

  handleTestChange = (event) => {
    this.setState({ selectedTest: event.target.value });
  };

  startTests = async () => {
    this.setState({ logs: "", isLoading: true, error: null });
    try {
      const { selectedTest } = this.state;
      const port = TEST_TO_PORT_MAPPING[selectedTest];
      if (!port) {
        throw new Error("No se encontró el puerto para la prueba seleccionada.");
      }
      this.setState({ selectedScreen: `http://localhost:${port}`, hasTestStarted: true });
      const response = await axios.post("http://localhost:8080/api/tests/start", { test: selectedTest, port });
      this.setState({ logs: response.data.logs });
    } catch (error) {
      this.setState({ error: "Error al iniciar las pruebas. Por favor, intente de nuevo." });
      console.error("Error al iniciar las pruebas:", error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  recordClick = (event) => {
    console.log("Click registrado:", event);
    if (this.state.recording) {
      const action = `cy.get('${event.target.tagName}').click();`;
      this.setState((prevState) => ({ actions: [...prevState.actions, action] }));
    }
  };

  startRecording = () => {
    console.log("Iniciando grabación");
    this.setState({ recording: true, actions: [] });
    //...
  };
  
  stopRecording = () => {
    console.log(this.state.actions); // Verifica si hay acciones grabadas
    this.setState({ recording: false });
    const testFileContent = generateTestFile(this.state.actions);
    downloadTestFile(testFileContent);
  };
  
  render() {
    const { selectedTest, isLoading, recording, logs, error, hasTestStarted, selectedScreen } = this.state;

    return (
      <div className="App">
        <h1>Cypress Test App</h1>
        <TestSelector value={selectedTest} onChange={this.handleTestChange} isLoading={isLoading} />
        <button className="Button" onClick={this.startTests} disabled={isLoading || !selectedTest}>
          Iniciar Pruebas
        </button>
        <button className="Button" onClick={recording ? this.stopRecording : this.startRecording} style={{ backgroundColor: recording ? "red" : undefined }}>
          {recording ? "Detener Grabación" : "Iniciar Grabación"}
        </button>
        {error && <div className="Error">{error}</div>}
        {hasTestStarted ? (
          <IframeComponent src={selectedScreen} onRecordClick={this.recordClick} ref={this.iframeRef} />
        ) : (
          <div className="Message">Por favor, selecciona una prueba y haz clic en "Iniciar Pruebas" para comenzar.</div>
        )}
        <Logs logs={logs} isLoading={isLoading} />
      </div>
    );
  }
}

export default App;

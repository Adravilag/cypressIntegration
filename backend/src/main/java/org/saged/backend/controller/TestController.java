package org.saged.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
public class TestController {
    private String os = System.getProperty("os.name").toLowerCase();
    private Process npmStartProcess;

    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startTests(@RequestBody Map<String, Object> payload) {

        // Configura el directorio y archivo de test para Cypress
        String testFile = payload.get("test").toString();

        // Obtener el nombre de la pantalla desde el payload
        String screen = testFile.replace("cypress/e2e/screens/", "").split("/")[0];

        Object portObj = payload.get("port");
        int port;
        if (portObj instanceof Integer) {
            port = (int) portObj;
        } else {
            port = 4001;  // valor por defecto si el puerto no se proporciona o no es un entero
        }

        // Obtener el directorio actual de trabajo
        String currentWorkingDirectory = System.getProperty("user.dir");

        // Rutas relativas desde el directorio actual de trabajo
        String cypressProjectDirectory = currentWorkingDirectory + "/../frontend";
        // Configurar el directorio para ejecutar npm start basado en la pantalla
        String npmStartDirectory = currentWorkingDirectory + "/../frontend/screens/" + screen;

        // Inicia la aplicación React en segundo plano
        startReactApp(npmStartDirectory);

        // Ejecuta los tests de Cypress
        return runCypressTests(cypressProjectDirectory, testFile, port);
    }

    private void killProcessesOnPort(int port) {
        try {
            Process findProcess;
            if (os.contains("win")) {
                findProcess = new ProcessBuilder("cmd.exe", "/c", "netstat -ano | findstr :" + port).start();
            } else {
                findProcess = new ProcessBuilder("/bin/bash", "-c", "lsof -i :" + port).start();
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(findProcess.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.trim().split("\\s+");
                String pid = parts[1];
                // Matar el proceso con el PID encontrado
                if (os.contains("win")) {
                    new ProcessBuilder("cmd.exe", "/c", "taskkill /F /PID " + pid).start();
                } else {
                    new ProcessBuilder("/bin/bash", "-c", "kill -9 " + pid).start();
                }
            }
            findProcess.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void startReactApp(String directory) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.directory(new File(directory));
            Map<String, String> environment = processBuilder.environment();
            environment.put("BROWSER", "none");

            if (os.contains("win")) {
                processBuilder.command("cmd.exe", "/c", "npm", "run", "start:test");
            } else {
                processBuilder.command("/bin/bash", "-c", "npm run start:test");
            }

            npmStartProcess = processBuilder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private ResponseEntity<Map<String, String>> runCypressTests(String directory, String testFile, int port) {
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.directory(new File(directory));

        // Set environment variable
        Map<String, String> environment = processBuilder.environment();
        environment.put("CYPRESS_ENV", "local");
        environment.put("PORT", String.valueOf(port));

        if (os.contains("win")) {
            processBuilder.command("cmd.exe", "/c", "npx", "cypress", "run", "--spec", testFile);
        } else {
            processBuilder.command("/bin/bash", "-c", "npx cypress run --spec \"" + testFile + "\"");
        }

        try {
            Process process = processBuilder.start();
            StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            int exitVal = process.waitFor();

            if (exitVal == 0) {
                Map<String, String> response = new HashMap<>();
                response.put("logs", output.toString());
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Error al ejecutar los tests");
                errorResponse.put("logs", output.toString());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al ejecutar los tests");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } finally {
            killProcessesOnPort(port);  // Matar cualquier proceso que escuche en el puerto asignado
        }
    }
}

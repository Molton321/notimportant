// AFD Classes
class SerialNumberAFD {
    constructor() {
        this.alphabet = new Set(['S', 'N', '-', ...this.getLetters(), ...this.getDigits()]);
        this.states = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'qf', 'qerror'];
        this.initialState = 'q0';
        this.finalStates = new Set(['qf']);

        this.transitions = {
            'q0': { 'S': 'q1' },
            'q1': { 'N': 'q2' },
            'q2': { '-': 'q3' },
            'q3': {}, 'q4': {}, 'q5': {}, 'q6': {},
            'q7': { '-': 'q8' },
            'q8': {}, 'q9': {}, 'q10': {}, 'q11': {},
            'qf': {}, 'qerror': {}
        };

        // Configurar transiciones para letras
        for (let letter of this.getLetters()) {
            this.transitions['q3'][letter] = 'q4';
            this.transitions['q4'][letter] = 'q5';
        }

        // Configurar transiciones para dígitos
        for (let digit of this.getDigits()) {
            this.transitions['q5'][digit] = 'q6';
            this.transitions['q6'][digit] = 'q7';
            this.transitions['q8'][digit] = 'q9';
            this.transitions['q9'][digit] = 'q10';
            this.transitions['q10'][digit] = 'q11';
            this.transitions['q11'][digit] = 'qf';
        }
    }

    getLetters() {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    }

    getDigits() {
        return '0123456789'.split('');
    }

    validate(input) {
        let currentState = this.initialState;
        let position = 0;

        for (let char of input) {
            position++;

            if (!this.alphabet.has(char)) {
                return {
                    valid: false,
                    error: `Carácter inválido '${char}' en posición ${position}`,
                    position: position
                };
            }

            if (this.transitions[currentState] && this.transitions[currentState][char]) {
                currentState = this.transitions[currentState][char];
            } else {
                return {
                    valid: false,
                    error: `Transición inválida desde estado '${currentState}' con carácter '${char}' en posición ${position}`,
                    position: position
                };
            }
        }

        if (this.finalStates.has(currentState)) {
            return { valid: true };
        } else {
            return {
                valid: false,
                error: `Cadena incompleta, terminó en estado '${currentState}' en lugar de estado final`,
                position: position
            };
        }
    }
}

class LicensePlateAFD {
    constructor() {
        this.alphabet = new Set(['-', ...this.getLetters(), ...this.getDigits()]);
        this.states = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'qf', 'qerror'];
        this.initialState = 'q0';
        this.finalStates = new Set(['qf']);

        this.transitions = {
            'q0': {}, 'q1': {}, 'q2': {},
            'q3': { '-': 'q4' },
            'q4': {}, 'q5': {}, 'q6': {}, 'q7': {},
            'q8': { '-': 'q9' },
            'q9': {},
            'qf': {}, 'qerror': {}
        };

        // Configurar transiciones para letras
        for (let letter of this.getLetters()) {
            this.transitions['q0'][letter] = 'q1';
            this.transitions['q1'][letter] = 'q2';
            this.transitions['q2'][letter] = 'q3';
            this.transitions['q9'][letter] = 'qf';
        }

        // Configurar transiciones para dígitos
        for (let digit of this.getDigits()) {
            this.transitions['q4'][digit] = 'q5';
            this.transitions['q5'][digit] = 'q6';
            this.transitions['q6'][digit] = 'q7';
            this.transitions['q7'][digit] = 'q8';
        }
    }

    getLetters() {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    }

    getDigits() {
        return '0123456789'.split('');
    }

    validate(input) {
        let currentState = this.initialState;
        let position = 0;

        for (let char of input) {
            position++;

            if (!this.alphabet.has(char)) {
                return {
                    valid: false,
                    error: `Carácter inválido '${char}' en posición ${position}`,
                    position: position
                };
            }

            if (this.transitions[currentState] && this.transitions[currentState][char]) {
                currentState = this.transitions[currentState][char];
            } else {
                return {
                    valid: false,
                    error: `Transición inválida desde estado '${currentState}' con carácter '${char}' en posición ${position}`,
                    position: position
                };
            }
        }

        if (this.finalStates.has(currentState)) {
            return { valid: true };
        } else {
            return {
                valid: false,
                error: `Cadena incompleta, terminó en estado '${currentState}' en lugar de estado final`,
                position: position
            };
        }
    }
}

// Clase principal para procesar archivos
class AFDValidator {
    constructor() {
        this.serialNumberAFD = new SerialNumberAFD();
        this.licensePlateAFD = new LicensePlateAFD();
    }

    // Método para leer archivo de texto (Node.js)
    async readFile(filePath) {
        try {
            const fs = require('fs').promises;
            const content = await fs.readFile(filePath, 'utf8');
            return content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        } catch (error) {
            throw new Error(`Error al leer el archivo: ${error.message}`);
        }
    }

    // Método alternativo para leer archivo en el navegador
    readFileFromInput(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                resolve(lines);
            };
            reader.onerror = () => reject(new Error('Error al leer el archivo'));
            reader.readAsText(file);
        });
    }

    // Detectar tipo de cadena automáticamente
    detectType(input) {
        if (input.startsWith('SN-')) {
            return 'serial';
        } else if (input.match(/^[A-Z]{3}-\d{4}-[A-Z]$/)) {
            return 'license';
        }
        return 'unknown';
    }

    // Validar una sola cadena
    validateString(input) {
        const type = this.detectType(input);
        let result;

        switch (type) {
            case 'serial':
                result = this.serialNumberAFD.validate(input);
                result.type = 'Número de Serie';
                break;
            case 'license':
                result = this.licensePlateAFD.validate(input);
                result.type = 'Placa de Matrícula';
                break;
            default:
                result = {
                    valid: false,
                    error: 'Formato no reconocido',
                    type: 'Desconocido'
                };
        }

        result.input = input;
        return result;
    }

    // Procesar múltiples cadenas
    validateMultiple(inputs) {
        const results = [];

        inputs.forEach((input, index) => {
            const result = this.validateString(input);
            result.lineNumber = index + 1;
            results.push(result);
        });

        return results;
    }

    // Procesar archivo de texto (Node.js)
    async processFile(filePath) {
        try {
            const lines = await this.readFile(filePath);
            return this.validateMultiple(lines);
        } catch (error) {
            throw error;
        }
    }

    // Generar reporte de resultados
    generateReport(results) {
        let report = "=== REPORTE DE VALIDACIÓN AFD ===\n\n";

        const validCount = results.filter(r => r.valid).length;
        const invalidCount = results.length - validCount;

        report += `Total de cadenas procesadas: ${results.length}\n`;
        report += `Cadenas válidas: ${validCount}\n`;
        report += `Cadenas inválidas: ${invalidCount}\n\n`;

        report += "=== RESULTADOS DETALLADOS ===\n";

        results.forEach(result => {
            report += `\nLínea ${result.lineNumber}: "${result.input}"\n`;
            report += `Tipo: ${result.type}\n`;
            report += `Estado: ${result.valid ? 'VÁLIDO' : 'INVÁLIDO'}\n`;

            if (!result.valid) {
                report += `Error: ${result.error}\n`;
                if (result.position) {
                    report += `Posición del error: ${result.position}\n`;
                }
            }
            report += "---\n";
        });

        return report;
    }
}

// Ejemplo de uso
async function main() {
    const validator = new AFDValidator();

    // Ejemplos de validación individual
    console.log("=== EJEMPLOS DE VALIDACIÓN ===");

    const testCases = [
        "SN-AB12-3456",  // Número de serie válido
        "ABC-1234-X",    // Placa de matrícula válida
        "SN-A123-456",   // Número de serie inválido
        "AB-1234-X",     // Placa de matrícula inválida
        "INVALID"        // Formato no reconocido
    ];

    testCases.forEach(testCase => {
        const result = validator.validateString(testCase);
        console.log(`"${testCase}" -> ${result.valid ? 'VÁLIDO' : 'INVÁLIDO'} (${result.type})`);
        if (!result.valid) {
            console.log(`  Error: ${result.error}`);
        }
    });

    // Ejemplo de procesamiento de archivo
    // Descomenta las siguientes líneas para usar con Node.js
    /*
    try {
        console.log("\n=== PROCESANDO ARCHIVO ===");
        const results = await validator.processFile('input.txt');
        const report = validator.generateReport(results);
        console.log(report);
        
        // Guardar reporte en archivo
        const fs = require('fs').promises;
        await fs.writeFile('reporte.txt', report);
        console.log("Reporte guardado en 'reporte.txt'");
    } catch (error) {
        console.error('Error:', error.message);
    }
    */
}

// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AFDValidator, SerialNumberAFD, LicensePlateAFD };
    main();
}

// Para el navegador
if (typeof window !== 'undefined') {
    window.AFDValidator = AFDValidator;
    window.SerialNumberAFD = SerialNumberAFD;
    window.LicensePlateAFD = LicensePlateAFD;
}
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const validateBtn = document.getElementById('validateBtn');
        const manualInput = document.getElementById('manualText');
        const fileInput = document.getElementById('fileInput');
        const resultsContainer = document.getElementById('results');
        const resultsList = document.getElementById('resultsList');
        const validCountSpan = document.getElementById('validCount');
        const invalidCountSpan = document.getElementById('invalidCount');

        const validator = new AFDValidator();

        validateBtn.addEventListener('click', async () => {
            let lines = [];

            if (fileInput.files.length > 0) {
                try {
                    lines = await validator.readFileFromInput(fileInput.files[0]);
                } catch (error) {
                    alert("Error al leer el archivo: " + error.message);
                    return;
                }
            } else {
                lines = manualInput.value.split('\n').map(l => l.trim()).filter(l => l);
            }

            const results = validator.validateMultiple(lines);

            // Mostrar resultados
            resultsList.innerHTML = '';
            let validCount = 0;
            let invalidCount = 0;

            results.forEach(res => {
                const div = document.createElement('div');
                div.classList.add('result-item');
                div.classList.add(res.valid ? 'valid' : 'invalid');

                div.innerHTML = `
                    <div class="result-header">
                        <i class="result-icon ${res.valid ? 'valid' : 'invalid'} fas fa-${res.valid ? 'check' : 'times'}-circle"></i>
                        <span class="result-line">Línea ${res.lineNumber}</span>
                    </div>
                    <div class="result-string">${res.input}</div>
                    <div class="result-message">${res.valid ? 'Cadena válida' : res.error}</div>
                `;
                resultsList.appendChild(div);

                if (res.valid) validCount++;
                else invalidCount++;
            });

            validCountSpan.textContent = `${validCount} válidas`;
            invalidCountSpan.textContent = `${invalidCount} inválidas`;
            resultsContainer.style.display = 'block';
        });
    });
}

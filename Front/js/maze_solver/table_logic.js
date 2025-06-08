// filepath: /home/notmnt903/Documentos/GitHub/Front/js/maze_solver/table_logic.js
async function testSolver() {
    try {
        // const response = await fetch('../../../assets/matriz_pequena_2.json'); // Relative path from js/maze_solver/ to assets/
        const response = await fetch('/assets/matriz_grande_con_solucion_1.json'); // Adjust the path as needed based on your server setup
        if (!response.ok) {
            console.error('Error fetching matrix data:', response.statusText);
            return;
        }
        const data = await response.json();
        console.log('Matrix data loaded:', data);

        const universe = new Universe(data);
        console.log('Universe initialized:', universe);

        // Verify some universe properties (optional)
        console.log('Origen:', universe.origen);
        console.log('Destino:', universe.destino);
        console.log('Carga Inicial Nave:', universe.cargaInicialNave);
        console.log('Is [0,0] a black hole?', universe.isBlackHole(0,0));
        console.log('Cost of cell [0,0]:', universe.getCellCost(0,0));


        const solver = new MazeSolver(universe);
        console.log('MazeSolver initialized. Starting to solve...');

        const solution = solver.solve();

        if (solution) {
            console.log("Solución encontrada por MazeSolver:");
            solution.forEach((step, index) => {
                console.log(`Paso ${index + 1}: Fila ${step.fila}, Columna ${step.columna}, Carga Antes: ${step.chargeBeforeCell.toFixed(2)}, Acción: ${step.action}, Carga Después: ${step.chargeAfterCell.toFixed(2)}`);
            });
        } else {
            console.log("No se encontró solución por MazeSolver.");
        }

        console.log("\n--- Log de Exploración Detallado ---");
        const pathLog = solver.getPathLog();
        if (pathLog && pathLog.length > 0) {
            pathLog.forEach(logEntry => console.log(logEntry));
        } else {
            console.log("El log de exploración está vacío o no se generó.");
        }

    } catch (error) {
        console.error('Error during solver test:', error);
    }
}

// Ensure Universe and MazeSolver classes are loaded before this script runs.
// Then call the test function.
if (typeof Universe !== 'undefined' && typeof MazeSolver !== 'undefined') {
    testSolver();
} else {
    console.error('Universe or MazeSolver class not found. Ensure universe.js and solver.js are loaded before table_logic.js.');
}

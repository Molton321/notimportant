// filepath: /home/notmnt903/Documentos/GitHub/Front/js/maze_solver/table_logic.js

document.addEventListener('DOMContentLoaded', () => {
    // Código existente de table_logic.js (si lo hay)...
    // ... (Asegúrate de mantener cualquier lógica previa que sea necesaria)

    console.log("Iniciando prueba de la clase Universe...");

    fetch('../assets/matriz_ejemplo.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("JSON cargado exitosamente:", data);
            try {
                const universe = new Universe(data);
                console.log("Objeto Universe creado:", universe);

                // Pruebas de los métodos de la clase Universe
                console.log("--- Pruebas de Métodos de Universe ---");

                // Origen y Destino
                console.log("Origen:", universe.origen);
                console.log("Destino:", universe.destino);

                // Prueba getCellCost
                const filaCosto = 1;
                const columnaCosto = 1;
                console.log(`Costo de celda [${filaCosto}, ${columnaCosto}]:`, universe.getCellCost(filaCosto, columnaCosto));
                const filaRecargaCosto = universe.zonasRecarga.length > 0 ? universe.zonasRecarga[0].fila : 0;
                const columnaRecargaCosto = universe.zonasRecarga.length > 0 ? universe.zonasRecarga[0].columna : 0;
                if (universe.zonasRecarga.length > 0) {
                    console.log(`Costo de celda de recarga [${filaRecargaCosto}, ${columnaRecargaCosto}]:`, universe.getCellCost(filaRecargaCosto, columnaRecargaCosto));
                }
                console.log("Costo de celda fuera de rango:", universe.getCellCost(universe.matriz.filas + 1, 0));

                // Prueba isBlackHole
                const bhTestFila = universe.agujerosNegros.length > 0 ? universe.agujerosNegros[0].fila : 0;
                const bhTestColumna = universe.agujerosNegros.length > 0 ? universe.agujerosNegros[0].columna : 0;
                if (universe.agujerosNegros.length > 0) {
                    console.log(`¿Es [${bhTestFila}, ${bhTestColumna}] un agujero negro?`, universe.isBlackHole(bhTestFila, bhTestColumna));
                }
                console.log("¿Es [0,0] un agujero negro (si no lo es realmente)?", universe.isBlackHole(0,0));

                // Prueba isGiantStar
                const gsTestFila = universe.estrellasGigantes.length > 0 ? universe.estrellasGigantes[0].fila : 0;
                const gsTestColumna = universe.estrellasGigantes.length > 0 ? universe.estrellasGigantes[0].columna : 0;
                if (universe.estrellasGigantes.length > 0) {
                    console.log(`¿Es [${gsTestFila}, ${gsTestColumna}] una estrella gigante?`, universe.isGiantStar(gsTestFila, gsTestColumna));
                }

                // Prueba getWormholeAt y useWormhole
                if (universe.agujerosGusano.length > 0 && universe.agujerosGusano[0].entrada.length === 2) {
                    const whEntradaFila = universe.agujerosGusano[0].entrada[0];
                    const whEntradaColumna = universe.agujerosGusano[0].entrada[1];
                    let wormhole = universe.getWormholeAt(whEntradaFila, whEntradaColumna);
                    console.log(`Agujero de gusano en [${whEntradaFila}, ${whEntradaColumna}]:`, wormhole);
                    if (wormhole) {
                        console.log("Salida del agujero de gusano:", wormhole.salida);
                        // universe.useWormhole(wormhole);
                        console.log(`Agujero de gusano en [${whEntradaFila}, ${whEntradaColumna}] después de usarlo:`, universe.getWormholeAt(whEntradaFila, whEntradaColumna));
                    }
                } else {
                    console.log("No hay agujeros de gusano con entrada válida para probar o el formato de entrada no es [fila, columna].");
                }

                // Prueba isRechargeZone y getRechargeZone
                if (universe.zonasRecarga.length > 0) {
                    const rzTestFila = universe.zonasRecarga[0].fila;
                    const rzTestColumna = universe.zonasRecarga[0].columna;
                    console.log(`¿Es [${rzTestFila}, ${rzTestColumna}] una zona de recarga?`, universe.isRechargeZone(rzTestFila, rzTestColumna));
                    console.log(`Zona de recarga en [${rzTestFila}, ${rzTestColumna}]:`, universe.getRechargeZone(rzTestFila, rzTestColumna));
                }

                // Prueba getRequiredChargeCell
                // Nota: Esto depende de la estructura de 'coordenada' en tu JSON.
                // El JSON de ejemplo tiene 'coordenada: [valor_unico]', lo que es ambiguo.
                // La implementación actual de getRequiredChargeCell espera [fila, columna].
                // Si tienes un ejemplo válido en tu JSON con [fila, columna], puedes probarlo así:
                // const rccTestFila = X; // Fila de una celda con carga requerida
                // const rccTestColumna = Y; // Columna de una celda con carga requerida
                // console.log(`Celda con carga requerida en [${rccTestFila}, ${rccTestColumna}]:`, universe.getRequiredChargeCell(rccTestFila, rccTestColumna));
                // Por ahora, intentaremos con la primera si existe y tiene el formato esperado.
                if (universe.celdasCargaRequerida.length > 0 && 
                    universe.celdasCargaRequerida[0].coordenada && 
                    universe.celdasCargaRequerida[0].coordenada.length === 2) {
                    const rccTestFila = universe.celdasCargaRequerida[0].coordenada[0];
                    const rccTestColumna = universe.celdasCargaRequerida[0].coordenada[1];
                     console.log(`Celda con carga requerida en [${rccTestFila}, ${rccTestColumna}]:`, universe.getRequiredChargeCell(rccTestFila, rccTestColumna));
                } else {
                    console.log("No hay celdas con carga requerida con formato [fila, columna] para probar o el array está vacío.");
                }

                // Prueba destroyAdjacentBlackHole
                if (universe.estrellasGigantes.length > 0 && universe.agujerosNegros.length > 0) {
                    const starToTest = universe.estrellasGigantes[0];
                    console.log(`Intentando destruir agujero negro adyacente a estrella en [${starToTest.fila}, ${starToTest.columna}]`);
                    // Para esta prueba, sería ideal tener un agujero negro conocido adyacente en el JSON
                    // o modificar temporalmente uno para que sea adyacente.
                    // Por ejemplo, si la estrella está en [7,7], y hay un agujero negro en [7,8]
                    const bhOriginalCount = universe.agujerosNegros.length;
                    const destroyed = universe.destroyAdjacentBlackHole(starToTest.fila, starToTest.columna);
                    console.log("¿Se destruyó un agujero negro?", destroyed);
                    console.log("Número de agujeros negros antes:", bhOriginalCount, "después:", universe.agujerosNegros.length);
                }

                console.log("--- Fin de Pruebas ---");

            } catch (error) {
                console.error("Error al instanciar o usar la clase Universe:", error);
            }
        })
        .catch(error => {
            console.error("Error en el proceso de prueba:", error);
        });
});

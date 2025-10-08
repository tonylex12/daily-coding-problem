/*
 * ============================================================================
 * 📝 PROBLEMA #1333 - Grid Path Counter
 * ============================================================================
 * Empresa: Slack
 * Dificultad: Medium
 *
 * ENUNCIADO:
 * You are given an N by M matrix of 0s and 1s. Starting from the top left
 * corner, how many ways are there to reach the bottom right corner?
 *
 * You can only move right and down. 0 represents an empty space while 1
 * represents a wall you cannot walk through.
 *
 * EJEMPLO:
 * Input: [[0, 0, 1],
 *         [0, 0, 1],
 *         [1, 0, 0]]
 *
 * Output: 2
 *
 * Explicación: Hay 2 caminos posibles:
 *   1. Right, down, down, right
 *   2. Down, right, down, right
 *
 * RESTRICCIONES:
 * - The top left corner and bottom right corner will always be 0.
 * - Solo puedes moverte hacia la derecha (→) o hacia abajo (↓)
 * ============================================================================
 */

/*
 * ============================================================================
 * ⚡ ANÁLISIS DE COMPLEJIDAD
 * ============================================================================
 * Complejidad Temporal: O(N × M)
 *   - Visitamos cada celda de la matriz exactamente una vez
 *   - N = número de filas, M = número de columnas
 *
 * Complejidad Espacial: O(M)
 *   - Solo mantenemos un array de tamaño M (columnas)
 *   - No necesitamos almacenar toda la matriz de contadores
 *
 * ALGORITMO UTILIZADO: Programación Dinámica (Dynamic Programming)
 * ============================================================================
 */

/*
 * ============================================================================
 * 💡 SOLUCIÓN
 * ============================================================================
 * ESTRATEGIA:
 * Usar programación dinámica con un arreglo de tamaño M (columnas).
 *
 * IDEA CLAVE:
 * - dp[j] contiene el número de maneras de llegar a la celda actual en la
 *   columna j para la fila que estamos procesando.
 * - Al iterar por filas y columnas:
 *     dp[j] = (si es muro) ? 0 : dp[j] (desde arriba) + dp[j-1] (desde izquierda)
 *
 * OPTIMIZACIÓN:
 * - Reutilizamos el mismo array dp para todas las filas, sobrescribiendo valores
 * - Esto reduce el espacio de O(N×M) a O(M)
 * ============================================================================
 */

function countPaths(grid) {
  if (!grid || grid.length === 0) return 0;
  const n = grid.length;
  const m = grid[0].length;

  // dp[j] = número de formas de llegar a la celda en la fila actual, columna j
  const dp = new Array(m).fill(0);

  // Inicializa dp[0] — si la entrada está bloqueada habrá 0 maneras
  dp[0] = grid[0][0] === 1 ? 0 : 1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        // muro: no se puede llegar aquí
        dp[j] = 0;
      } else {
        // dp[j] (antes de sobrescribir) representa las maneras desde arriba
        // dp[j-1] representa las maneras desde la izquierda (ya calculada para esta fila)
        if (j > 0) dp[j] = dp[j] + dp[j - 1];
        // cuando j === 0, dp[j] se mantiene (solo viene de arriba)
      }
    }
  }

  return dp[m - 1];
}

// Función para encontrar e imprimir todos los caminos posibles
function findAllPaths(grid) {
  if (!grid || grid.length === 0) return [];
  const n = grid.length;
  const m = grid[0].length;
  const paths = [];

  function backtrack(i, j, currentPath) {
    // Si llegamos al destino, guardamos el camino
    if (i === n - 1 && j === m - 1) {
      paths.push([...currentPath, `(${i},${j})`]);
      return;
    }

    // Si estamos fuera de límites o es un muro, retornamos
    if (i >= n || j >= m || grid[i][j] === 1) {
      return;
    }

    // Agregamos la posición actual al camino
    currentPath.push(`(${i},${j})`);

    // Movimiento hacia abajo
    backtrack(i + 1, j, currentPath);

    // Movimiento hacia la derecha
    backtrack(i, j + 1, currentPath);

    // Backtrack: removemos la posición actual para explorar otras rutas
    currentPath.pop();
  }

  backtrack(0, 0, []);
  return paths;
}

// Función para imprimir los caminos en formato visual
function printPaths(grid) {
  const paths = findAllPaths(grid);
  const n = grid.length;
  const m = grid[0].length;

  console.log(`\n🛣️  Total de caminos: ${paths.length}\n`);

  paths.forEach((path, index) => {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Camino ${index + 1}:`);

    // Crear una matriz visual para este camino
    const visualGrid = [];
    for (let i = 0; i < n; i++) {
      visualGrid[i] = [];
      for (let j = 0; j < m; j++) {
        if (grid[i][j] === 1) {
          visualGrid[i][j] = "🧱"; // Muro
        } else {
          visualGrid[i][j] = "⬜"; // Espacio vacío
        }
      }
    }

    // Marcar el camino en la matriz visual
    path.forEach((pos, idx) => {
      const [row, col] = pos.slice(1, -1).split(",").map(Number);

      if (idx === 0) {
        visualGrid[row][col] = "🟢"; // Inicio
      } else if (idx === path.length - 1) {
        visualGrid[row][col] = "🎯"; // Final
      } else {
        visualGrid[row][col] = "🟦"; // Camino
      }
    });

    // Imprimir la matriz visual
    console.log("");
    for (let i = 0; i < n; i++) {
      console.log("  " + visualGrid[i].join(" "));
    }

    // Convertir a direcciones (Right/Down)
    const directions = [];
    for (let i = 0; i < path.length - 1; i++) {
      const [row1, col1] = path[i].slice(1, -1).split(",").map(Number);
      const [row2, col2] = path[i + 1].slice(1, -1).split(",").map(Number);

      if (row2 > row1) {
        directions.push("↓");
      } else if (col2 > col1) {
        directions.push("→");
      }
    }
    console.log(`\n  Movimientos: ${directions.join(" ")}`);
    console.log(`  Posiciones: ${path.join(" → ")}\n`);
  });

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

/*
 * ============================================================================
 * ✅ CASOS DE PRUEBA
 * ============================================================================
 */

console.log("🧪 EJECUTANDO CASOS DE PRUEBA\n");
console.log("=".repeat(60));

// Test Case 1: Ejemplo del problema
console.log("\n📌 Test Case 1: Ejemplo del problema");
const example = [
  [0, 0, 1],
  [0, 0, 1],
  [1, 0, 0],
];
console.log("Input:");
console.table(example);
console.log("Resultado:", countPaths(example));
console.log("Esperado: 2");
console.log("Estado:", countPaths(example) === 2 ? "✅ PASS" : "❌ FAIL");

// Imprimir todos los caminos visualmente
printPaths(example);

// Test Case 2: Matriz 1x1
console.log("\n📌 Test Case 2: Matriz 1x1 (single cell)");
const test2 = [[0]];
console.log("Input: [[0]]");
console.log("Resultado:", countPaths(test2));
console.log("Esperado: 1");
console.log("Estado:", countPaths(test2) === 1 ? "✅ PASS" : "❌ FAIL");

// Test Case 3: Camino recto (sin obstáculos)
console.log("\n📌 Test Case 3: Camino sin obstáculos");
const test3 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
console.log("Input:");
console.table(test3);
console.log("Resultado:", countPaths(test3));
console.log("Esperado: 6");
console.log("Estado:", countPaths(test3) === 6 ? "✅ PASS" : "❌ FAIL");

// Test Case 4: Camino bloqueado
console.log("\n📌 Test Case 4: Camino con bloqueo completo");
const test4 = [
  [0, 1],
  [1, 0],
];
console.log("Input:");
console.table(test4);
console.log("Resultado:", countPaths(test4));
console.log("Esperado: 0");
console.log("Estado:", countPaths(test4) === 0 ? "✅ PASS" : "❌ FAIL");

// Test Case 5: Solo un camino posible
console.log("\n📌 Test Case 5: Solo un camino disponible");
const test5 = [
  [0, 0, 0],
  [1, 1, 0],
  [1, 1, 0],
];
console.log("Input:");
console.table(test5);
console.log("Resultado:", countPaths(test5));
console.log("Esperado: 1");
console.log("Estado:", countPaths(test5) === 1 ? "✅ PASS" : "❌ FAIL");

console.log("\n" + "=".repeat(60));
console.log("🏁 TESTS COMPLETADOS\n");

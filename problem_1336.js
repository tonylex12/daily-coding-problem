/*
 * ============================================================================
 * 📝 PROBLEMA #1336 - N-Queens Problem
 * ============================================================================
 * Empresa: Google, Amazon, Microsoft
 * Dificultad: Hard
 *
 * ENUNCIADO:
 * You have an N by N board. Write a function that, given N, returns the
 * number of possible arrangements of the board where N queens can be placed
 * on the board without threatening each other, i.e. no two queens share the
 * same row, column, or diagonal.
 *
 * EJEMPLO:
 * Input: N = 4
 * Output: 2
 *
 * Explicación: Las 2 soluciones posibles son:
 *
 *   Solución 1:        Solución 2:
 *   . Q . .            . . Q .
 *   . . . Q            Q . . .
 *   Q . . .            . . . Q
 *   . . Q .            . Q . .
 *
 * RESTRICCIONES:
 * - N >= 1
 * - Dos reinas se atacan si están en la misma fila, columna o diagonal
 * ============================================================================
 */

/*
 * ============================================================================
 * ⚡ ANÁLISIS DE COMPLEJIDAD
 * ============================================================================
 * Complejidad Temporal: O(N!)
 *   - En el peor caso, exploramos todas las permutaciones posibles
 *   - Para cada fila tenemos N opciones, luego N-1, N-2, etc.
 *   - Aunque con poda (backtracking) reducimos significativamente las ramas
 *
 * Complejidad Espacial: O(N)
 *   - Stack de recursión: O(N) profundidad máxima
 *   - Arrays para tracking de columnas y diagonales: O(N)
 *
 * ALGORITMO UTILIZADO: Backtracking
 * ============================================================================
 */

/*
 * ============================================================================
 * 💡 SOLUCIÓN
 * ============================================================================
 *
 * ESTRATEGIA:
 * Usar backtracking para colocar reinas fila por fila, verificando que
 * no se amenacen entre sí.
 *
 * OBSERVACIONES CLAVE:
 * 1. Colocamos una reina por fila → No hay conflictos de filas
 * 2. Necesitamos verificar:
 *    - Columnas: Usar un Set o array booleano
 *    - Diagonales principales (\): row - col es constante
 *    - Diagonales secundarias (/): row + col es constante
 *
 * DIAGONALES:
 * - Diagonal principal (\): Las celdas tienen el mismo valor (row - col)
 *   Ejemplo: (0,0), (1,1), (2,2) → todas tienen diff = 0
 *            (0,1), (1,2), (2,3) → todas tienen diff = -1
 *
 * - Diagonal secundaria (/): Las celdas tienen el mismo valor (row + col)
 *   Ejemplo: (0,3), (1,2), (2,1), (3,0) → todas tienen sum = 3
 *
 * ALGORITMO:
 * 1. Empezar desde la fila 0
 * 2. Para cada columna en la fila actual:
 *    a. Verificar si es seguro colocar una reina
 *    b. Si es seguro, colocar la reina y marcar columna/diagonales
 *    c. Recursivamente intentar colocar en la siguiente fila
 *    d. Backtrack: desmarcar columna/diagonales
 * 3. Si llegamos a la fila N, encontramos una solución válida
 * ============================================================================
 */

function nQueens(n) {
  if (n === 0) return 0;

  let count = 0;

  // Tracking de posiciones ocupadas
  const cols = new Set(); // Columnas ocupadas
  const diag1 = new Set(); // Diagonales principales (row - col)
  const diag2 = new Set(); // Diagonales secundarias (row + col)

  function backtrack(row) {
    // Caso base: Colocamos todas las reinas
    if (row === n) {
      count++;
      return;
    }

    // Intentar colocar reina en cada columna de esta fila
    for (let col = 0; col < n; col++) {
      // Calcular identificadores de diagonales
      const d1 = row - col;
      const d2 = row + col;

      // Verificar si la posición es válida
      if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) {
        continue; // Posición bajo ataque, skip
      }

      // Colocar reina (marcar como ocupado)
      cols.add(col);
      diag1.add(d1);
      diag2.add(d2);

      // Recursión: intentar siguiente fila
      backtrack(row + 1);

      // Backtrack: quitar reina (desmarcar)
      cols.delete(col);
      diag1.delete(d1);
      diag2.delete(d2);
    }
  }

  backtrack(0);
  return count;
}

// Versión con array para visualización (guarda las soluciones)
function nQueensWithBoards(n) {
  if (n === 0) return { count: 0, solutions: [] };

  const solutions = [];
  const board = Array.from({ length: n }, () => Array(n).fill("."));

  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();

  function backtrack(row) {
    if (row === n) {
      // Guardar una copia de la solución actual
      solutions.push(board.map((row) => row.join("")));
      return;
    }

    for (let col = 0; col < n; col++) {
      const d1 = row - col;
      const d2 = row + col;

      if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) {
        continue;
      }

      // Colocar reina
      board[row][col] = "Q";
      cols.add(col);
      diag1.add(d1);
      diag2.add(d2);

      backtrack(row + 1);

      // Backtrack
      board[row][col] = ".";
      cols.delete(col);
      diag1.delete(d1);
      diag2.delete(d2);
    }
  }

  backtrack(0);
  return { count: solutions.length, solutions };
}

// Función para visualizar las soluciones
function visualizeNQueens(n) {
  console.log(`\n📊 Visualización N-Queens para N=${n}`);
  console.log("━".repeat(50));

  const { count, solutions } = nQueensWithBoards(n);

  console.log(`\nTotal de soluciones: ${count}\n`);

  if (count > 0 && count <= 10) {
    // Mostrar todas las soluciones si son pocas
    solutions.forEach((solution, idx) => {
      console.log(`Solución ${idx + 1}:`);
      solution.forEach((row) => {
        console.log("  " + row.split("").join(" "));
      });
      console.log();
    });
  } else if (count > 10) {
    // Mostrar solo las primeras 3 soluciones si hay muchas
    console.log("Mostrando primeras 3 soluciones:\n");
    solutions.slice(0, 3).forEach((solution, idx) => {
      console.log(`Solución ${idx + 1}:`);
      solution.forEach((row) => {
        console.log("  " + row.split("").join(" "));
      });
      console.log();
    });
    console.log(`... y ${count - 3} soluciones más`);
  }

  console.log("━".repeat(50));
}

// Función para mostrar cómo funcionan las diagonales
function explainDiagonals() {
  console.log("\n📐 EXPLICACIÓN DE DIAGONALES");
  console.log("━".repeat(50));

  const n = 4;
  console.log(`\nTablero ${n}x${n} con índices:\n`);

  console.log("Posiciones (row, col):");
  for (let row = 0; row < n; row++) {
    let line = "";
    for (let col = 0; col < n; col++) {
      line += `(${row},${col}) `;
    }
    console.log(line);
  }

  console.log("\nDiagonal Principal (\\ - row-col):");
  for (let row = 0; row < n; row++) {
    let line = "";
    for (let col = 0; col < n; col++) {
      const diff = row - col;
      line += `${diff >= 0 ? " " : ""}${diff}    `;
    }
    console.log(line);
  }

  console.log("\nDiagonal Secundaria (/ - row+col):");
  for (let row = 0; row < n; row++) {
    let line = "";
    for (let col = 0; col < n; col++) {
      const sum = row + col;
      line += ` ${sum}    `;
    }
    console.log(line);
  }

  console.log("\n💡 Celdas con el mismo número están en la misma diagonal");
  console.log("━".repeat(50));
}

/*
 * ============================================================================
 * ✅ CASOS DE PRUEBA
 * ============================================================================
 */

console.log("🧪 EJECUTANDO CASOS DE PRUEBA\n");
console.log("=".repeat(60));

// Test Case 1: N = 1 (caso trivial)
console.log("\n📌 Test Case 1: Tablero 1x1");
const test1 = 1;
console.log(`Input: N = ${test1}`);
console.log("Resultado:", nQueens(test1));
console.log("Esperado: 1");
console.log("Estado:", nQueens(test1) === 1 ? "✅ PASS" : "❌ FAIL");
visualizeNQueens(test1);

// Test Case 2: N = 2 (imposible)
console.log("\n📌 Test Case 2: Tablero 2x2 (imposible)");
const test2 = 2;
console.log(`Input: N = ${test2}`);
console.log("Resultado:", nQueens(test2));
console.log("Esperado: 0");
console.log("Estado:", nQueens(test2) === 0 ? "✅ PASS" : "❌ FAIL");

// Test Case 3: N = 3 (imposible)
console.log("\n📌 Test Case 3: Tablero 3x3 (imposible)");
const test3 = 3;
console.log(`Input: N = ${test3}`);
console.log("Resultado:", nQueens(test3));
console.log("Esperado: 0");
console.log("Estado:", nQueens(test3) === 0 ? "✅ PASS" : "❌ FAIL");

// Test Case 4: N = 4 (ejemplo del problema)
console.log("\n📌 Test Case 4: Tablero 4x4 (ejemplo del problema)");
const test4 = 4;
console.log(`Input: N = ${test4}`);
console.log("Resultado:", nQueens(test4));
console.log("Esperado: 2");
console.log("Estado:", nQueens(test4) === 2 ? "✅ PASS" : "❌ FAIL");
visualizeNQueens(test4);

// Test Case 5: N = 5
console.log("\n📌 Test Case 5: Tablero 5x5");
const test5 = 5;
console.log(`Input: N = ${test5}`);
console.log("Resultado:", nQueens(test5));
console.log("Esperado: 10");
console.log("Estado:", nQueens(test5) === 10 ? "✅ PASS" : "❌ FAIL");
visualizeNQueens(test5);

// Test Case 6: N = 6
console.log("\n📌 Test Case 6: Tablero 6x6");
const test6 = 6;
console.log(`Input: N = ${test6}`);
console.log("Resultado:", nQueens(test6));
console.log("Esperado: 4");
console.log("Estado:", nQueens(test6) === 4 ? "✅ PASS" : "❌ FAIL");
visualizeNQueens(test6);

// Test Case 7: N = 8 (tablero de ajedrez clásico)
console.log("\n📌 Test Case 7: Tablero 8x8 (ajedrez clásico)");
const test7 = 8;
console.log(`Input: N = ${test7}`);
console.log("Resultado:", nQueens(test7));
console.log("Esperado: 92");
console.log("Estado:", nQueens(test7) === 92 ? "✅ PASS" : "❌ FAIL");

// Test Case 8: N = 10 (más complejo)
console.log("\n📌 Test Case 8: Tablero 10x10");
const test8 = 10;
console.log(`Input: N = ${test8}`);
console.log("Resultado:", nQueens(test8));
console.log("Esperado: 724");
console.log("Estado:", nQueens(test8) === 724 ? "✅ PASS" : "❌ FAIL");

// Mostrar explicación de diagonales
explainDiagonals();

console.log("\n" + "=".repeat(60));
console.log("🏁 TESTS COMPLETADOS\n");

module.exports = { nQueens, nQueensWithBoards };

/*
 * ============================================================================
 * 📝 PROBLEMA #1339 - Attacking Bishops
 * ============================================================================
 * Empresa: Google
 * Dificultad: Medium
 *
 * ENUNCIADO:
 * On our special chessboard, two bishops attack each other if they share the
 * same diagonal. This includes bishops that have another bishop located
 * between them, i.e. bishops can attack through pieces.
 *
 * You are given N bishops, represented as (row, column) tuples on a M by M
 * chessboard. Write a function to count the number of pairs of bishops that
 * attack each other. The ordering of the pair doesn't matter: (1, 2) is
 * considered the same as (2, 1).
 *
 * EJEMPLO:
 * Input: M = 5, bishops = [(0, 0), (1, 2), (2, 2), (4, 0)]
 *
 * Tablero:
 * [b 0 0 0 0]
 * [0 0 b 0 0]
 * [0 0 b 0 0]
 * [0 0 0 0 0]
 * [b 0 0 0 0]
 *
 * Output: 2
 * Explicación: Bishops 1 y 3 se atacan, y bishops 3 y 4 se atacan.
 *
 * RESTRICCIONES:
 * - Los obispos pueden atacar a través de otras piezas
 * - Los pares no tienen orden: (1,2) es igual a (2,1)
 * - M >= 1
 * ============================================================================
 */

/*
 * ============================================================================
 * ⚡ ANÁLISIS DE COMPLEJIDAD
 * ============================================================================
 * Complejidad Temporal: O(N)
 *   - Recorrer N obispos una vez
 *   - Para cada obispo, calcular sus diagonales: O(1)
 *   - Actualizar el mapa de diagonales: O(1)
 *   - Total: O(N)
 *
 * Complejidad Espacial: O(N)
 *   - Mapas para almacenar conteo de diagonales: O(N)
 *
 * ALGORITMO UTILIZADO: Hash Map + Diagonal Indexing
 * ============================================================================
 */

/*
 * ============================================================================
 * 💡 SOLUCIÓN
 * ============================================================================
 *
 * ESTRATEGIA:
 * Usar las propiedades matemáticas de las diagonales para agrupar obispos
 * que comparten la misma diagonal, y luego calcular cuántos pares pueden
 * formarse en cada diagonal.
 *
 * CONCEPTOS CLAVE DE DIAGONALES:
 *
 * 1. Diagonal Principal (\):
 *    - Todos los puntos en la misma diagonal tienen el mismo (row - col)
 *    - Ejemplo: (0,0), (1,1), (2,2) → todas tienen diff = 0
 *    - Ejemplo: (1,2), (2,3), (3,4) → todas tienen diff = -1
 *
 * 2. Diagonal Secundaria (/):
 *    - Todos los puntos en la misma diagonal tienen el mismo (row + col)
 *    - Ejemplo: (0,3), (1,2), (2,1), (3,0) → todas tienen sum = 3
 *    - Ejemplo: (0,0), (1,1), (2,2) → tienen sum = 0, 2, 4 (diferentes)
 *
 * ALGORITMO:
 * 1. Para cada obispo, calcular:
 *    - Diagonal principal: d1 = row - col
 *    - Diagonal secundaria: d2 = row + col
 *
 * 2. Contar cuántos obispos hay en cada diagonal
 *    - Usar dos mapas: uno para d1, otro para d2
 *
 * 3. Para cada diagonal con k obispos:
 *    - Número de pares = k * (k - 1) / 2
 *    - (Combinaciones de k elementos tomados de 2 en 2)
 *
 * 4. Sumar todos los pares de ambas diagonales
 *
 * FÓRMULA DE COMBINACIONES:
 * Si hay k obispos en la misma diagonal:
 * - Pares = C(k, 2) = k! / (2! * (k-2)!) = k * (k-1) / 2
 * - Ejemplos:
 *   - k = 2 → 2*1/2 = 1 par
 *   - k = 3 → 3*2/2 = 3 pares
 *   - k = 4 → 4*3/2 = 6 pares
 * ============================================================================
 */

function countAttackingBishops(m, bishops) {
  if (!bishops || bishops.length <= 1) return 0;

  // Mapas para contar obispos en cada diagonal
  const diag1Count = new Map(); // Diagonal principal (\)
  const diag2Count = new Map(); // Diagonal secundaria (/)

  // Contar obispos en cada diagonal
  for (const [row, col] of bishops) {
    const d1 = row - col; // Diagonal principal
    const d2 = row + col; // Diagonal secundaria

    diag1Count.set(d1, (diag1Count.get(d1) || 0) + 1);
    diag2Count.set(d2, (diag2Count.get(d2) || 0) + 1);
  }

  let pairs = 0;

  // Calcular pares en diagonales principales
  for (const count of diag1Count.values()) {
    if (count >= 2) {
      pairs += (count * (count - 1)) / 2;
    }
  }

  // Calcular pares en diagonales secundarias
  for (const count of diag2Count.values()) {
    if (count >= 2) {
      pairs += (count * (count - 1)) / 2;
    }
  }

  return pairs;
}

// Versión con detalles de los pares encontrados (para debugging)
function countAttackingBishopsWithDetails(m, bishops) {
  if (!bishops || bishops.length <= 1) {
    return { totalPairs: 0, diagonal1Pairs: 0, diagonal2Pairs: 0, details: [] };
  }

  const diag1Map = new Map();
  const diag2Map = new Map();

  // Agrupar obispos por diagonal
  for (let i = 0; i < bishops.length; i++) {
    const [row, col] = bishops[i];
    const d1 = row - col;
    const d2 = row + col;

    if (!diag1Map.has(d1)) diag1Map.set(d1, []);
    if (!diag2Map.has(d2)) diag2Map.set(d2, []);

    diag1Map.get(d1).push(i);
    diag2Map.get(d2).push(i);
  }

  const details = [];
  let diagonal1Pairs = 0;
  let diagonal2Pairs = 0;

  // Pares en diagonales principales
  for (const [d1, bishopIndices] of diag1Map.entries()) {
    if (bishopIndices.length >= 2) {
      const count = bishopIndices.length;
      const pairs = (count * (count - 1)) / 2;
      diagonal1Pairs += pairs;

      details.push({
        diagonal: `Principal (\\) d1=${d1}`,
        bishops: bishopIndices.map((i) => bishops[i]),
        pairs: pairs,
      });
    }
  }

  // Pares en diagonales secundarias
  for (const [d2, bishopIndices] of diag2Map.entries()) {
    if (bishopIndices.length >= 2) {
      const count = bishopIndices.length;
      const pairs = (count * (count - 1)) / 2;
      diagonal2Pairs += pairs;

      details.push({
        diagonal: `Secundaria (/) d2=${d2}`,
        bishops: bishopIndices.map((i) => bishops[i]),
        pairs: pairs,
      });
    }
  }

  return {
    totalPairs: diagonal1Pairs + diagonal2Pairs,
    diagonal1Pairs,
    diagonal2Pairs,
    details,
  };
}

// Función para visualizar el tablero
function visualizeBoard(m, bishops) {
  console.log(`\n📊 Tablero ${m}x${m}`);
  console.log("━".repeat(m * 4 + 1));

  const board = Array.from({ length: m }, () => Array(m).fill("."));

  // Colocar obispos en el tablero
  bishops.forEach(([row, col]) => {
    board[row][col] = "b";
  });

  // Imprimir tablero
  board.forEach((row) => {
    console.log("[" + row.join(" ") + "]");
  });

  console.log("━".repeat(m * 4 + 1));
}

// Función para visualizar diagonales
function visualizeDiagonals(m, bishops) {
  console.log(`\n📐 Análisis de Diagonales`);
  console.log("━".repeat(70));

  const diag1Map = new Map();
  const diag2Map = new Map();

  // Agrupar por diagonal
  for (let i = 0; i < bishops.length; i++) {
    const [row, col] = bishops[i];
    const d1 = row - col;
    const d2 = row + col;

    if (!diag1Map.has(d1)) diag1Map.set(d1, []);
    if (!diag2Map.has(d2)) diag2Map.set(d2, []);

    diag1Map.get(d1).push({ index: i, pos: [row, col] });
    diag2Map.get(d2).push({ index: i, pos: [row, col] });
  }

  console.log("\n🔹 Diagonales Principales (\\) - row - col:");
  for (const [d1, bishops] of [...diag1Map.entries()].sort(
    (a, b) => a[0] - b[0]
  )) {
    console.log(`  d1 = ${d1}:`);
    bishops.forEach(({ index, pos }) => {
      console.log(`    Bishop ${index}: (${pos[0]}, ${pos[1]})`);
    });
    if (bishops.length >= 2) {
      const pairs = (bishops.length * (bishops.length - 1)) / 2;
      console.log(`    ⚔️  ${pairs} par(es) de ataque`);
    }
  }

  console.log("\n🔹 Diagonales Secundarias (/) - row + col:");
  for (const [d2, bishops] of [...diag2Map.entries()].sort(
    (a, b) => a[0] - b[0]
  )) {
    console.log(`  d2 = ${d2}:`);
    bishops.forEach(({ index, pos }) => {
      console.log(`    Bishop ${index}: (${pos[0]}, ${pos[1]})`);
    });
    if (bishops.length >= 2) {
      const pairs = (bishops.length * (bishops.length - 1)) / 2;
      console.log(`    ⚔️  ${pairs} par(es) de ataque`);
    }
  }

  console.log("━".repeat(70));
}

/*
 * ============================================================================
 * ✅ CASOS DE PRUEBA
 * ============================================================================
 */

console.log("🧪 EJECUTANDO CASOS DE PRUEBA\n");
console.log("=".repeat(70));

// Test Case 1: Ejemplo del problema
console.log("\n📌 Test Case 1: Ejemplo del problema");
const test1M = 5;
const test1Bishops = [
  [0, 0],
  [1, 2],
  [2, 2],
  [4, 0],
];
console.log(`Input: M = ${test1M}`);
console.log(
  "Bishops:",
  test1Bishops.map((b) => `(${b[0]},${b[1]})`).join(", ")
);
console.log("Resultado:", countAttackingBishops(test1M, test1Bishops));
console.log("Esperado: 2");
console.log(
  "Estado:",
  countAttackingBishops(test1M, test1Bishops) === 2 ? "✅ PASS" : "❌ FAIL"
);
visualizeBoard(test1M, test1Bishops);
visualizeDiagonals(test1M, test1Bishops);

// Test Case 2: Sin ataques
console.log("\n📌 Test Case 2: Sin ataques");
const test2M = 4;
const test2Bishops = [
  [0, 0],
  [0, 2],
  [2, 1],
];
console.log(`Input: M = ${test2M}`);
console.log(
  "Bishops:",
  test2Bishops.map((b) => `(${b[0]},${b[1]})`).join(", ")
);
console.log("Resultado:", countAttackingBishops(test2M, test2Bishops));
console.log("Esperado: 0");
console.log(
  "Estado:",
  countAttackingBishops(test2M, test2Bishops) === 0 ? "✅ PASS" : "❌ FAIL"
);
visualizeBoard(test2M, test2Bishops);

// Test Case 3: Todos en la misma diagonal
console.log("\n📌 Test Case 3: Todos en la misma diagonal principal");
const test3M = 5;
const test3Bishops = [
  [0, 0],
  [1, 1],
  [2, 2],
  [3, 3],
];
console.log(`Input: M = ${test3M}`);
console.log(
  "Bishops:",
  test3Bishops.map((b) => `(${b[0]},${b[1]})`).join(", ")
);
console.log("Resultado:", countAttackingBishops(test3M, test3Bishops));
console.log("Esperado: 6 (C(4,2) = 4*3/2 = 6)");
console.log(
  "Estado:",
  countAttackingBishops(test3M, test3Bishops) === 6 ? "✅ PASS" : "❌ FAIL"
);
visualizeBoard(test3M, test3Bishops);
visualizeDiagonals(test3M, test3Bishops);

// Test Case 4: Un solo obispo
console.log("\n📌 Test Case 4: Un solo obispo");
const test4M = 3;
const test4Bishops = [[1, 1]];
console.log(`Input: M = ${test4M}`);
console.log(
  "Bishops:",
  test4Bishops.map((b) => `(${b[0]},${b[1]})`).join(", ")
);
console.log("Resultado:", countAttackingBishops(test4M, test4Bishops));
console.log("Esperado: 0");
console.log(
  "Estado:",
  countAttackingBishops(test4M, test4Bishops) === 0 ? "✅ PASS" : "❌ FAIL"
);

// Test Case 5: Dos obispos atacándose
console.log("\n📌 Test Case 5: Dos obispos atacándose");
const test5M = 3;
const test5Bishops = [
  [0, 0],
  [2, 2],
];
console.log(`Input: M = ${test5M}`);
console.log(
  "Bishops:",
  test5Bishops.map((b) => `(${b[0]},${b[1]})`).join(", ")
);
console.log("Resultado:", countAttackingBishops(test5M, test5Bishops));
console.log("Esperado: 1");
console.log(
  "Estado:",
  countAttackingBishops(test5M, test5Bishops) === 1 ? "✅ PASS" : "❌ FAIL"
);
visualizeBoard(test5M, test5Bishops);

// Test Case 6: Diagonal secundaria
console.log("\n📌 Test Case 6: Diagonal secundaria");
const test6M = 5;
const test6Bishops = [
  [0, 4],
  [1, 3],
  [2, 2],
];
console.log(`Input: M = ${test6M}`);
console.log(
  "Bishops:",
  test6Bishops.map((b) => `(${b[0]},${b[1]})`).join(", ")
);
console.log("Resultado:", countAttackingBishops(test6M, test6Bishops));
console.log("Esperado: 3 (C(3,2) = 3*2/2 = 3)");
console.log(
  "Estado:",
  countAttackingBishops(test6M, test6Bishops) === 3 ? "✅ PASS" : "❌ FAIL"
);
visualizeBoard(test6M, test6Bishops);
visualizeDiagonals(test6M, test6Bishops);

// Test Case 7: Caso complejo
console.log("\n📌 Test Case 7: Caso complejo");
const test7M = 8;
const test7Bishops = [
  [0, 0],
  [1, 1],
  [2, 2],
  [0, 7],
  [1, 6],
  [3, 4],
];
console.log(`Input: M = ${test7M}`);
console.log(
  "Bishops:",
  test7Bishops.map((b) => `(${b[0]},${b[1]})`).join(", ")
);
const result7 = countAttackingBishops(test7M, test7Bishops);
console.log("Resultado:", result7);
console.log(
  "Explicación: d1=0 tiene 3 obispos (3 pares), d2=7 tiene 3 obispos (3 pares) = 6 total"
);
console.log("Esperado: 6");
console.log("Estado:", result7 === 6 ? "✅ PASS" : "❌ FAIL");
visualizeBoard(test7M, test7Bishops);
visualizeDiagonals(test7M, test7Bishops);

console.log("\n" + "=".repeat(70));
console.log("🏁 TESTS COMPLETADOS\n");

module.exports = { countAttackingBishops, countAttackingBishopsWithDetails };

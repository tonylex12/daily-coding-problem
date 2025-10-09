/*
 * ============================================================================
 * 📝 PROBLEMA #1334 - Edit Distance (Levenshtein Distance)
 * ============================================================================
 * Empresa: Google
 * Dificultad: Medium
 *
 * ENUNCIADO:
 * The edit distance between two strings refers to the minimum number of
 * character insertions, deletions, and substitutions required to change
 * one string to the other.
 *
 * EJEMPLO:
 * Input: str1 = "kitten", str2 = "sitting"
 * Output: 3
 *
 * Explicación: Se necesitan 3 operaciones:
 *   1. Substitute "k" → "s": "sitten"
 *   2. Substitute "e" → "i": "sittin"
 *   3. Insert "g" at end: "sitting"
 *
 * OPERACIONES PERMITIDAS:
 * - Inserción de un carácter
 * - Eliminación de un carácter
 * - Sustitución de un carácter
 * ============================================================================
 */

/*
 * ============================================================================
 * ⚡ ANÁLISIS DE COMPLEJIDAD
 * ============================================================================
 * Complejidad Temporal: O(N × M)
 *   - Llenamos una matriz de tamaño (N+1) × (M+1)
 *   - N = longitud del string 1, M = longitud del string 2
 *
 * Complejidad Espacial: O(M)
 *   - Optimizado: solo mantenemos 2 arrays de tamaño M+1
 *   - Versión no optimizada: O(N × M) para toda la matriz
 *
 * ALGORITMO UTILIZADO: Programación Dinámica (Dynamic Programming)
 * ============================================================================
 */

/*
 * ============================================================================
 * 💡 SOLUCIÓN
 * ============================================================================
 * ESTRATEGIA:
 * Usar programación dinámica con una matriz donde dp[i][j] representa
 * la distancia mínima de edición entre los primeros i caracteres de str1
 * y los primeros j caracteres de str2.
 *
 * CASOS BASE:
 * - dp[0][j] = j (necesitamos j inserciones para crear str2[0...j] desde vacío)
 * - dp[i][0] = i (necesitamos i eliminaciones para llegar a vacío desde str1[0...i])
 *
 * RECURRENCIA:
 * Si str1[i-1] == str2[j-1]:
 *   dp[i][j] = dp[i-1][j-1]  // No se necesita operación
 * Si no:
 *   dp[i][j] = 1 + min(
 *     dp[i-1][j],    // Eliminar de str1
 *     dp[i][j-1],    // Insertar en str1
 *     dp[i-1][j-1]   // Sustituir
 *   )
 *
 * OPTIMIZACIÓN:
 * - Solo necesitamos la fila anterior para calcular la fila actual
 * - Reducimos espacio de O(N×M) a O(M)
 * ============================================================================
 */

function editDistance(str1, str2) {
  const n = str1.length;
  const m = str2.length;

  // Casos especiales
  if (n === 0) return m;
  if (m === 0) return n;

  // Array para la fila anterior y la fila actual
  let prev = Array(m + 1).fill(0);
  let curr = Array(m + 1).fill(0);

  // Inicializar la primera fila (caso base: transformar string vacío a str2[0...j])
  for (let j = 0; j <= m; j++) {
    prev[j] = j;
  }

  // Llenar la tabla dp
  for (let i = 1; i <= n; i++) {
    // Primera columna: transformar str1[0...i] a string vacío
    curr[0] = i;

    for (let j = 1; j <= m; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        // Los caracteres coinciden, no se necesita operación
        curr[j] = prev[j - 1];
      } else {
        // Tomamos el mínimo de las 3 operaciones + 1
        curr[j] =
          1 +
          Math.min(
            prev[j], // Eliminar de str1
            curr[j - 1], // Insertar en str1
            prev[j - 1] // Sustituir
          );
      }
    }

    // Intercambiar filas: la actual se convierte en la anterior
    [prev, curr] = [curr, prev];
  }

  return prev[m];
}

// Versión con matriz completa (para visualización y debugging)
function editDistanceWithMatrix(str1, str2) {
  const n = str1.length;
  const m = str2.length;

  // Crear matriz (n+1) x (m+1)
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill(0));

  // Casos base
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  // Llenar la matriz
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // Eliminar
            dp[i][j - 1], // Insertar
            dp[i - 1][j - 1] // Sustituir
          );
      }
    }
  }

  return { distance: dp[n][m], matrix: dp };
}

// Función para visualizar la matriz DP
function visualizeEditDistance(str1, str2) {
  const { distance, matrix } = editDistanceWithMatrix(str1, str2);

  console.log(`\n📊 Matriz DP para "${str1}" → "${str2}"`);
  console.log("━".repeat(50));

  // Crear headers
  let header = "    ε  ";
  for (let char of str2) {
    header += `${char}  `;
  }
  console.log(header);

  // Imprimir matriz
  for (let i = 0; i <= str1.length; i++) {
    let row = i === 0 ? "ε " : `${str1[i - 1]} `;
    for (let j = 0; j <= str2.length; j++) {
      row += ` ${matrix[i][j]} `;
    }
    console.log(row);
  }

  console.log("━".repeat(50));
  console.log(`Distancia mínima de edición: ${distance}\n`);
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
const test1_str1 = "kitten";
const test1_str2 = "sitting";
console.log(`Input: "${test1_str1}" → "${test1_str2}"`);
console.log("Resultado:", editDistance(test1_str1, test1_str2));
console.log("Esperado: 3");
console.log(
  "Estado:",
  editDistance(test1_str1, test1_str2) === 3 ? "✅ PASS" : "❌ FAIL"
);
visualizeEditDistance(test1_str1, test1_str2);

// Test Case 2: Strings iguales
console.log("\n📌 Test Case 2: Strings iguales");
const test2_str1 = "hello";
const test2_str2 = "hello";
console.log(`Input: "${test2_str1}" → "${test2_str2}"`);
console.log("Resultado:", editDistance(test2_str1, test2_str2));
console.log("Esperado: 0");
console.log(
  "Estado:",
  editDistance(test2_str1, test2_str2) === 0 ? "✅ PASS" : "❌ FAIL"
);

// Test Case 3: Un string vacío
console.log("\n📌 Test Case 3: String vacío");
const test3_str1 = "";
const test3_str2 = "hello";
console.log(`Input: "${test3_str1}" → "${test3_str2}"`);
console.log("Resultado:", editDistance(test3_str1, test3_str2));
console.log("Esperado: 5");
console.log(
  "Estado:",
  editDistance(test3_str1, test3_str2) === 5 ? "✅ PASS" : "❌ FAIL"
);

// Test Case 4: Otro string vacío
console.log("\n📌 Test Case 4: Otro string vacío");
const test4_str1 = "world";
const test4_str2 = "";
console.log(`Input: "${test4_str1}" → "${test4_str2}"`);
console.log("Resultado:", editDistance(test4_str1, test4_str2));
console.log("Esperado: 5");
console.log(
  "Estado:",
  editDistance(test4_str1, test4_str2) === 5 ? "✅ PASS" : "❌ FAIL"
);

// Test Case 5: Strings completamente diferentes
console.log("\n📌 Test Case 5: Strings completamente diferentes");
const test5_str1 = "abc";
const test5_str2 = "xyz";
console.log(`Input: "${test5_str1}" → "${test5_str2}"`);
console.log("Resultado:", editDistance(test5_str1, test5_str2));
console.log("Esperado: 3");
console.log(
  "Estado:",
  editDistance(test5_str1, test5_str2) === 3 ? "✅ PASS" : "❌ FAIL"
);
visualizeEditDistance(test5_str1, test5_str2);

// Test Case 6: Solo inserciones
console.log("\n📌 Test Case 6: Solo inserciones");
const test6_str1 = "cat";
const test6_str2 = "cats";
console.log(`Input: "${test6_str1}" → "${test6_str2}"`);
console.log("Resultado:", editDistance(test6_str1, test6_str2));
console.log("Esperado: 1");
console.log(
  "Estado:",
  editDistance(test6_str1, test6_str2) === 1 ? "✅ PASS" : "❌ FAIL"
);

// Test Case 7: Caso más complejo
console.log("\n📌 Test Case 7: Caso complejo");
const test7_str1 = "sunday";
const test7_str2 = "saturday";
console.log(`Input: "${test7_str1}" → "${test7_str2}"`);
console.log("Resultado:", editDistance(test7_str1, test7_str2));
console.log("Esperado: 3");
console.log(
  "Estado:",
  editDistance(test7_str1, test7_str2) === 3 ? "✅ PASS" : "❌ FAIL"
);
visualizeEditDistance(test7_str1, test7_str2);

console.log("\n" + "=".repeat(60));
console.log("🏁 TESTS COMPLETADOS\n");

module.exports = { editDistance, editDistanceWithMatrix };

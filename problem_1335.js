/*
 * ============================================================================
 * 📝 PROBLEMA #1335 - Decode Ways
 * ============================================================================
 * Empresa: Facebook
 * Dificultad: Medium
 *
 * ENUNCIADO:
 * Given the mapping a = 1, b = 2, ... z = 26, and an encoded message,
 * count the number of ways it can be decoded.
 *
 * EJEMPLO:
 * Input: "111"
 * Output: 3
 *
 * Explicación: El mensaje se puede decodificar de 3 formas:
 *   1. "111" → "aaa" (1, 1, 1)
 *   2. "111" → "ka"  (11, 1)
 *   3. "111" → "ak"  (1, 11)
 *
 * RESTRICCIONES:
 * - Puedes asumir que los mensajes son decodificables
 * - Mensajes como '001' no están permitidos
 * - Solo números del 1 al 26 son válidos
 * ============================================================================
 */

/*
 * ============================================================================
 * ⚡ ANÁLISIS DE COMPLEJIDAD
 * ============================================================================
 * Complejidad Temporal: O(N)
 *   - Recorremos el string una sola vez
 *   - N = longitud del string
 *
 * Complejidad Espacial: O(1)
 *   - Solo usamos 2 variables para almacenar estados previos
 *   - Versión no optimizada: O(N) si usamos array completo
 *
 * ALGORITMO UTILIZADO: Programación Dinámica (Dynamic Programming)
 * ============================================================================
 */

/*
 * ============================================================================
 * 💡 SOLUCIÓN
 * ============================================================================
 *
 * TABLA DE MAPEO (dado en el problema):
 * ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
 * │  1  │  2  │  3  │  4  │  5  │  6  │  7  │  8  │  9  │ 10  │
 * │ 'a' │ 'b' │ 'c' │ 'd' │ 'e' │ 'f' │ 'g' │ 'h' │ 'i' │ 'j' │
 * ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
 * │ 11  │ 12  │ 13  │ 14  │ 15  │ 16  │ 17  │ 18  │ 19  │ 20  │
 * │ 'k' │ 'l' │ 'm' │ 'n' │ 'o' │ 'p' │ 'q' │ 'r' │ 's' │ 't' │
 * ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
 * │ 21  │ 22  │ 23  │ 24  │ 25  │ 26  │
 * │ 'u' │ 'v' │ 'w' │ 'x' │ 'y' │ 'z' │
 * └─────┴─────┴─────┴─────┴─────┴─────┘
 *
 * ESTRATEGIA:
 * Usar programación dinámica donde dp[i] representa el número de formas
 * de decodificar el string hasta la posición i.
 *
 * CASOS BASE:
 * - dp[0] = 1 (string vacío tiene una forma de decodificarse)
 * - dp[1] = 1 si el primer dígito no es '0', sino 0
 *
 * RECURRENCIA:
 * Para cada posición i:
 *   1. Si el dígito actual (uno solo) es válido (1-9):
 *      dp[i] += dp[i-1]
 *
 *   2. Si los dos últimos dígitos forman un número válido (10-26):
 *      dp[i] += dp[i-2]
 *
 * OPTIMIZACIÓN:
 * - Solo necesitamos los dos valores anteriores (dp[i-1] y dp[i-2])
 * - Reducimos espacio de O(N) a O(1) usando dos variables
 * ============================================================================
 */

function numDecodings(s) {
  if (!s || s.length === 0 || s[0] === "0") {
    return 0;
  }

  const n = s.length;

  // Variables para dp[i-2] y dp[i-1]
  let twoBack = 1; // dp[0] = 1
  let oneBack = 1; // dp[1] = 1

  for (let i = 1; i < n; i++) {
    let current = 0;

    // Verificar un dígito (1-9)
    const oneDigit = parseInt(s[i]);
    if (oneDigit >= 1 && oneDigit <= 9) {
      current += oneBack;
    }

    // Verificar dos dígitos (10-26)
    const twoDigits = parseInt(s.substring(i - 1, i + 1));
    if (twoDigits >= 10 && twoDigits <= 26) {
      current += twoBack;
    }

    // Actualizar variables para la siguiente iteración
    twoBack = oneBack;
    oneBack = current;
  }

  return oneBack;
}

// Versión con array completo (para debugging y visualización)
function numDecodingsWithArray(s) {
  if (!s || s.length === 0 || s[0] === "0") {
    return 0;
  }

  const n = s.length;
  const dp = new Array(n + 1).fill(0);

  // Casos base
  dp[0] = 1; // String vacío
  dp[1] = 1; // Primer carácter (ya verificado que no es '0')

  for (let i = 2; i <= n; i++) {
    // Verificar un dígito
    const oneDigit = parseInt(s[i - 1]);
    if (oneDigit >= 1 && oneDigit <= 9) {
      dp[i] += dp[i - 1];
    }

    // Verificar dos dígitos
    const twoDigits = parseInt(s.substring(i - 2, i));
    if (twoDigits >= 10 && twoDigits <= 26) {
      dp[i] += dp[i - 2];
    }
  }

  return { ways: dp[n], dpArray: dp };
}

// Función auxiliar: Convierte un número (1-26) a su letra correspondiente
// Mapeo: 1='a', 2='b', 3='c', ..., 26='z'
function numberToLetter(num) {
  // Usamos códigos ASCII: 'a' está en la posición 97
  // Entonces: 97 + (num - 1) = código ASCII de la letra
  // Ejemplo: num=1 → 97+0=97 → 'a'
  //          num=2 → 97+1=98 → 'b'
  //          num=26 → 97+25=122 → 'z'
  return String.fromCharCode(96 + num);
}

// Función para encontrar todas las decodificaciones posibles
function findAllDecodings(s) {
  const results = [];

  function backtrack(index, current) {
    // Caso base: llegamos al final
    if (index === s.length) {
      results.push(current.join(""));
      return;
    }

    // Intentar tomar un dígito (1-9)
    const oneDigit = parseInt(s[index]);
    if (oneDigit >= 1 && oneDigit <= 9) {
      // Convertir número a letra usando el mapeo 1='a', 2='b', etc.
      const letter = numberToLetter(oneDigit);
      backtrack(index + 1, [...current, letter]);
    }

    // Intentar tomar dos dígitos (10-26)
    if (index + 1 < s.length) {
      const twoDigits = parseInt(s.substring(index, index + 2));
      if (twoDigits >= 10 && twoDigits <= 26) {
        // Convertir número a letra usando el mapeo 10='j', 11='k', etc.
        const letter = numberToLetter(twoDigits);
        backtrack(index + 2, [...current, letter]);
      }
    }
  }

  backtrack(0, []);
  return results;
}

// Función para visualizar el proceso de DP
function visualizeDecoding(s) {
  const { ways, dpArray } = numDecodingsWithArray(s);

  console.log(`\n📊 Visualización DP para "${s}"`);
  console.log("━".repeat(50));

  console.log("\nArray DP:");
  console.log(
    "Índice:  ",
    Array.from({ length: dpArray.length }, (_, i) => i).join("  ")
  );
  console.log(
    "Valor:   ",
    dpArray.map((v) => v.toString().padStart(2)).join(" ")
  );

  console.log("\nString:");
  console.log("  ε  " + s.split("").join("  "));

  console.log("━".repeat(50));
  console.log(`Total de formas de decodificar: ${ways}`);

  const decodings = findAllDecodings(s);
  console.log(`\nTodas las decodificaciones (${decodings.length}):`);
  decodings.forEach((dec, idx) => {
    console.log(`  ${idx + 1}. "${dec}"`);
  });
  console.log();
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
const test1 = "111";
console.log(`Input: "${test1}"`);
console.log("Resultado:", numDecodings(test1));
console.log("Esperado: 3");
console.log("Estado:", numDecodings(test1) === 3 ? "✅ PASS" : "❌ FAIL");
visualizeDecoding(test1);

// Test Case 2: Un solo dígito
console.log("\n📌 Test Case 2: Un solo dígito");
const test2 = "5";
console.log(`Input: "${test2}"`);
console.log("Resultado:", numDecodings(test2));
console.log("Esperado: 1");
console.log("Estado:", numDecodings(test2) === 1 ? "✅ PASS" : "❌ FAIL");

// Test Case 3: Dos dígitos formando número válido
console.log("\n📌 Test Case 3: Dos dígitos formando número válido");
const test3 = "12";
console.log(`Input: "${test3}"`);
console.log("Resultado:", numDecodings(test3));
console.log("Esperado: 2");
console.log("Estado:", numDecodings(test3) === 2 ? "✅ PASS" : "❌ FAIL");
visualizeDecoding(test3);

// Test Case 4: Empieza con 0 (inválido)
console.log("\n📌 Test Case 4: Empieza con 0 (inválido)");
const test4 = "012";
console.log(`Input: "${test4}"`);
console.log("Resultado:", numDecodings(test4));
console.log("Esperado: 0");
console.log("Estado:", numDecodings(test4) === 0 ? "✅ PASS" : "❌ FAIL");

// Test Case 5: Contiene 0 en medio
console.log("\n📌 Test Case 5: Contiene 0 válido");
const test5 = "10";
console.log(`Input: "${test5}"`);
console.log("Resultado:", numDecodings(test5));
console.log("Esperado: 1");
console.log("Estado:", numDecodings(test5) === 1 ? "✅ PASS" : "❌ FAIL");
visualizeDecoding(test5);

// Test Case 6: Número más largo
console.log("\n📌 Test Case 6: Número más largo");
const test6 = "226";
console.log(`Input: "${test6}"`);
console.log("Resultado:", numDecodings(test6));
console.log("Esperado: 3");
console.log("Estado:", numDecodings(test6) === 3 ? "✅ PASS" : "❌ FAIL");
visualizeDecoding(test6);

// Test Case 7: Caso complejo
console.log("\n📌 Test Case 7: Caso complejo");
const test7 = "1234";
console.log(`Input: "${test7}"`);
console.log("Resultado:", numDecodings(test7));
console.log("Esperado: 3");
console.log("Estado:", numDecodings(test7) === 3 ? "✅ PASS" : "❌ FAIL");
visualizeDecoding(test7);

// Test Case 8: Todos números grandes
console.log("\n📌 Test Case 8: Números al límite");
const test8 = "2626";
console.log(`Input: "${test8}"`);
console.log("Resultado:", numDecodings(test8));
console.log("Esperado: 4");
console.log("Estado:", numDecodings(test8) === 4 ? "✅ PASS" : "❌ FAIL");
visualizeDecoding(test8);

console.log("\n" + "=".repeat(60));
console.log("🏁 TESTS COMPLETADOS\n");

module.exports = { numDecodings, numDecodingsWithArray, findAllDecodings };

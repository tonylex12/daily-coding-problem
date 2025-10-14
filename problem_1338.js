/*
 * ============================================================================
 * 📝 PROBLEMA #1338 - Longest Consecutive Sequence
 * ============================================================================
 * Empresa: Microsoft
 * Dificultad: Medium
 *
 * ENUNCIADO:
 * Given an unsorted array of integers, find the length of the longest
 * consecutive elements sequence.
 *
 * For example, given [100, 4, 200, 1, 3, 2], the longest consecutive
 * element sequence is [1, 2, 3, 4]. Return its length: 4.
 *
 * Your algorithm should run in O(n) complexity.
 *
 * EJEMPLO:
 * Input: [100, 4, 200, 1, 3, 2]
 * Output: 4
 * Explicación: La secuencia consecutiva más larga es [1, 2, 3, 4]
 *
 * RESTRICCIONES:
 * - El array puede estar desordenado
 * - Debe ser O(n) complejidad temporal
 * - Los números pueden ser positivos, negativos o cero
 * ============================================================================
 */

/*
 * ============================================================================
 * ⚡ ANÁLISIS DE COMPLEJIDAD
 * ============================================================================
 * Complejidad Temporal: O(N)
 *   - Insertar N elementos en el Set: O(N)
 *   - Recorrer el array: O(N)
 *   - Cada número se procesa máximo una vez como inicio de secuencia
 *   - Total: O(N)
 *
 * Complejidad Espacial: O(N)
 *   - Set para almacenar todos los números únicos
 *
 * ALGORITMO UTILIZADO: Hash Set + Smart Iteration
 * ============================================================================
 */

/*
 * ============================================================================
 * 💡 SOLUCIÓN
 * ============================================================================
 *
 * ESTRATEGIA:
 * Usar un Set para lograr búsquedas O(1) y detectar inteligentemente el
 * inicio de cada secuencia consecutiva.
 *
 * IDEA CLAVE:
 * Solo iniciar el conteo de una secuencia cuando encontramos su INICIO,
 * es decir, cuando (num - 1) NO está en el Set.
 *
 * EJEMPLO VISUAL:
 * Array: [100, 4, 200, 1, 3, 2]
 * Set: {100, 4, 200, 1, 3, 2}
 *
 * - Al ver 100: ¿99 existe? No → Es inicio de secuencia
 *   Contar: 100 (longitud 1)
 *
 * - Al ver 4: ¿3 existe? Sí → NO es inicio, skip
 *
 * - Al ver 200: ¿199 existe? No → Es inicio de secuencia
 *   Contar: 200 (longitud 1)
 *
 * - Al ver 1: ¿0 existe? No → Es inicio de secuencia
 *   Contar: 1, 2, 3, 4 (longitud 4) ✅
 *
 * - Al ver 3: ¿2 existe? Sí → NO es inicio, skip
 *
 * - Al ver 2: ¿1 existe? Sí → NO es inicio, skip
 *
 * ALGORITMO:
 * 1. Crear un Set con todos los números (O(N))
 * 2. Para cada número en el array:
 *    a. Verificar si (num - 1) existe en el Set
 *    b. Si NO existe → es inicio de secuencia:
 *       - Contar cuántos números consecutivos siguen
 *       - Actualizar el máximo
 * 3. Retornar el máximo encontrado
 *
 * ¿POR QUÉ ES O(N)?
 * Aunque hay loops anidados, cada número se procesa como inicio de secuencia
 * SOLO UNA VEZ. Los números del medio nunca inician conteo porque tienen
 * (num - 1) en el Set.
 * ============================================================================
 */

function longestConsecutive(nums) {
  if (!nums || nums.length === 0) return 0;

  // Crear Set para búsqueda O(1)
  const numSet = new Set(nums);
  let maxLength = 0;

  for (const num of numSet) {
    // Solo procesar si es el inicio de una secuencia
    // (no existe num - 1)
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentLength = 1;

      // Contar cuántos números consecutivos siguen
      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentLength++;
      }

      maxLength = Math.max(maxLength, currentLength);
    }
  }

  return maxLength;
}

// Versión con tracking de la secuencia actual (para debugging)
function longestConsecutiveWithSequence(nums) {
  if (!nums || nums.length === 0) {
    return { length: 0, sequence: [] };
  }

  const numSet = new Set(nums);
  let maxLength = 0;
  let longestSequence = [];

  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentLength = 1;
      const sequence = [num];

      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentLength++;
        sequence.push(currentNum);
      }

      if (currentLength > maxLength) {
        maxLength = currentLength;
        longestSequence = sequence;
      }
    }
  }

  return { length: maxLength, sequence: longestSequence };
}

// Función para visualizar el proceso
function visualizeLongestConsecutive(nums) {
  console.log(
    `\n📊 Visualización Longest Consecutive para ${JSON.stringify(nums)}`
  );
  console.log("━".repeat(70));

  if (!nums || nums.length === 0) {
    console.log("Array vacío, retornando 0");
    console.log("━".repeat(70));
    return;
  }

  const numSet = new Set(nums);
  console.log(
    "\n🔹 Set creado:",
    Array.from(numSet).sort((a, b) => a - b)
  );

  let maxLength = 0;
  let longestSequence = [];
  let step = 0;

  console.log("\n🔍 Procesando cada número:\n");

  for (const num of numSet) {
    step++;

    if (!numSet.has(num - 1)) {
      console.log(`Paso ${step}: Número ${num}`);
      console.log(`  ¿Existe ${num - 1}? NO → Es INICIO de secuencia`);

      let currentNum = num;
      let currentLength = 1;
      const sequence = [num];

      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentLength++;
        sequence.push(currentNum);
      }

      console.log(`  Secuencia encontrada: [${sequence.join(", ")}]`);
      console.log(`  Longitud: ${currentLength}`);

      if (currentLength > maxLength) {
        maxLength = currentLength;
        longestSequence = sequence;
        console.log(`  ✅ ¡Nueva secuencia más larga!`);
      }
      console.log();
    } else {
      console.log(
        `Paso ${step}: Número ${num} - ¿Existe ${
          num - 1
        }? SÍ → SKIP (no es inicio)`
      );
    }
  }

  console.log("━".repeat(70));
  console.log(`🎯 Secuencia más larga: [${longestSequence.join(", ")}]`);
  console.log(`📏 Longitud: ${maxLength}`);
  console.log("━".repeat(70));
}

// Función para comparar con solución O(n log n) (ordenamiento)
function longestConsecutiveSorting(nums) {
  if (!nums || nums.length === 0) return 0;

  // Ordenar el array
  const sorted = [...nums].sort((a, b) => a - b);

  let maxLength = 1;
  let currentLength = 1;

  for (let i = 1; i < sorted.length; i++) {
    // Skip duplicados
    if (sorted[i] === sorted[i - 1]) {
      continue;
    }

    // Si es consecutivo, incrementar
    if (sorted[i] === sorted[i - 1] + 1) {
      currentLength++;
    } else {
      // Reiniciar secuencia
      maxLength = Math.max(maxLength, currentLength);
      currentLength = 1;
    }
  }

  return Math.max(maxLength, currentLength);
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
const test1 = [100, 4, 200, 1, 3, 2];
console.log(`Input: [${test1}]`);
console.log("Resultado:", longestConsecutive(test1));
console.log("Esperado: 4");
console.log("Estado:", longestConsecutive(test1) === 4 ? "✅ PASS" : "❌ FAIL");
visualizeLongestConsecutive(test1);

// Test Case 2: Secuencia completa
console.log("\n📌 Test Case 2: Secuencia completa");
const test2 = [5, 4, 3, 2, 1];
console.log(`Input: [${test2}]`);
console.log("Resultado:", longestConsecutive(test2));
console.log("Esperado: 5");
console.log("Estado:", longestConsecutive(test2) === 5 ? "✅ PASS" : "❌ FAIL");
visualizeLongestConsecutive(test2);

// Test Case 3: Sin secuencia
console.log("\n📌 Test Case 3: Sin secuencia consecutiva");
const test3 = [10, 5, 100, 1000];
console.log(`Input: [${test3}]`);
console.log("Resultado:", longestConsecutive(test3));
console.log("Esperado: 1");
console.log("Estado:", longestConsecutive(test3) === 1 ? "✅ PASS" : "❌ FAIL");

// Test Case 4: Array vacío
console.log("\n📌 Test Case 4: Array vacío");
const test4 = [];
console.log("Input: []");
console.log("Resultado:", longestConsecutive(test4));
console.log("Esperado: 0");
console.log("Estado:", longestConsecutive(test4) === 0 ? "✅ PASS" : "❌ FAIL");

// Test Case 5: Un solo elemento
console.log("\n📌 Test Case 5: Un solo elemento");
const test5 = [1];
console.log(`Input: [${test5}]`);
console.log("Resultado:", longestConsecutive(test5));
console.log("Esperado: 1");
console.log("Estado:", longestConsecutive(test5) === 1 ? "✅ PASS" : "❌ FAIL");

// Test Case 6: Con duplicados
console.log("\n📌 Test Case 6: Con duplicados");
const test6 = [1, 2, 0, 1, 2, 3, 4];
console.log(`Input: [${test6}]`);
console.log("Resultado:", longestConsecutive(test6));
console.log("Esperado: 5");
console.log("Estado:", longestConsecutive(test6) === 5 ? "✅ PASS" : "❌ FAIL");
visualizeLongestConsecutive(test6);

// Test Case 7: Números negativos
console.log("\n📌 Test Case 7: Con números negativos");
const test7 = [-1, -2, 0, 1, 2, 3];
console.log(`Input: [${test7}]`);
console.log("Resultado:", longestConsecutive(test7));
console.log("Esperado: 6");
console.log("Estado:", longestConsecutive(test7) === 6 ? "✅ PASS" : "❌ FAIL");
visualizeLongestConsecutive(test7);

// Test Case 8: Múltiples secuencias
console.log("\n📌 Test Case 8: Múltiples secuencias");
const test8 = [1, 2, 3, 10, 11, 12, 13, 20, 21];
console.log(`Input: [${test8}]`);
console.log("Resultado:", longestConsecutive(test8));
console.log("Esperado: 4");
console.log("Estado:", longestConsecutive(test8) === 4 ? "✅ PASS" : "❌ FAIL");
visualizeLongestConsecutive(test8);

// Comparación de complejidades
console.log("\n📊 COMPARACIÓN DE COMPLEJIDADES");
console.log("=".repeat(70));
const testArray = [100, 4, 200, 1, 3, 2];
console.log(`\nArray de prueba: [${testArray}]`);
console.log("\n1️⃣ Solución O(N) con Hash Set:");
console.log("   Resultado:", longestConsecutive(testArray));
console.log("   Complejidad: O(N) tiempo, O(N) espacio");

console.log("\n2️⃣ Solución O(N log N) con Ordenamiento:");
console.log("   Resultado:", longestConsecutiveSorting(testArray));
console.log("   Complejidad: O(N log N) tiempo, O(N) espacio");

console.log("\n💡 La solución O(N) es superior para arrays grandes");

console.log("\n" + "=".repeat(70));
console.log("🏁 TESTS COMPLETADOS\n");

/*
 * ============================================================================
 * 📝 PROBLEMA #1337 - Sieve of Eratosthenes
 * ============================================================================
 * Empresa: Square
 * Dificultad: Medium
 *
 * ENUNCIADO:
 * The Sieve of Eratosthenes is an algorithm used to generate all prime numbers
 * smaller than N. The method is to take increasingly larger prime numbers, and
 * mark their multiples as composite.
 *
 * For example, to find all primes less than 100, we would first mark
 * [4, 6, 8, ...] (multiples of two), then [6, 9, 12, ...] (multiples of three),
 * and so on. Once we have done this for all primes less than N, the unmarked
 * numbers that remain will be prime.
 *
 * Implement this algorithm.
 *
 * BONUS: Create a generator that produces primes indefinitely (that is,
 * without taking N as an input).
 *
 * EJEMPLO:
 * Input: N = 30
 * Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
 *
 * RESTRICCIONES:
 * - N >= 2
 * - Retornar todos los números primos menores que N
 * ============================================================================
 */

/*
 * ============================================================================
 * ⚡ ANÁLISIS DE COMPLEJIDAD
 * ============================================================================
 * Complejidad Temporal: O(N log log N)
 *   - El algoritmo marca múltiplos de cada primo
 *   - Para cada primo p, marcamos N/p múltiplos
 *   - Serie armónica: N/2 + N/3 + N/5 + N/7 + ... ≈ N log log N
 *
 * Complejidad Espacial: O(N)
 *   - Array booleano de tamaño N para marcar números compuestos
 *
 * ALGORITMO UTILIZADO: Sieve of Eratosthenes (Criba de Eratóstenes)
 * ============================================================================
 */

/*
 * ============================================================================
 * 💡 SOLUCIÓN
 * ============================================================================
 *
 * ESTRATEGIA:
 * Usar un array booleano para marcar números compuestos (no primos).
 * Los números que permanezcan sin marcar serán primos.
 *
 * ALGORITMO:
 * 1. Crear array de booleanos de tamaño N, inicializado en true
 * 2. Marcar 0 y 1 como no primos
 * 3. Para cada número i desde 2 hasta √N:
 *    a. Si i no está marcado (es primo):
 *       - Marcar todos sus múltiplos (i², i²+i, i²+2i, ...) como compuestos
 * 4. Recolectar todos los números que permanezcan sin marcar
 *
 * OPTIMIZACIONES:
 * - Solo iterar hasta √N porque cualquier compuesto > √N ya fue marcado
 * - Empezar a marcar desde i² (múltiplos menores ya fueron marcados por primos menores)
 * - Incrementar de i en i al marcar múltiplos
 *
 * ¿POR QUÉ FUNCIONA?
 * Todo número compuesto tiene al menos un divisor primo ≤ √N.
 * Al marcar múltiplos de todos los primos ≤ √N, marcamos todos los compuestos.
 * ============================================================================
 */

function sieveOfEratosthenes(n) {
  if (n <= 2) return [];

  // Array para marcar números compuestos (false = primo)
  const isPrime = new Array(n).fill(true);
  isPrime[0] = false; // 0 no es primo
  isPrime[1] = false; // 1 no es primo

  // Solo necesitamos iterar hasta √n
  const sqrtN = Math.sqrt(n);

  for (let i = 2; i <= sqrtN; i++) {
    if (isPrime[i]) {
      // Marcar todos los múltiplos de i como compuestos
      // Empezamos desde i² porque múltiplos menores ya fueron marcados
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  // Recolectar todos los primos (números no marcados)
  const primes = [];
  for (let i = 2; i < n; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }

  return primes;
}

// Versión con visualización del proceso
function sieveOfEratosthenesWithSteps(n) {
  if (n <= 2) return { primes: [], steps: [] };

  const isPrime = new Array(n).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  const steps = [];
  const sqrtN = Math.sqrt(n);

  for (let i = 2; i <= sqrtN; i++) {
    if (isPrime[i]) {
      const multiples = [];

      // Marcar múltiplos y guardar para visualización
      for (let j = i * i; j < n; j += i) {
        if (isPrime[j]) {
          multiples.push(j);
          isPrime[j] = false;
        }
      }

      if (multiples.length > 0) {
        steps.push({
          prime: i,
          multiples: multiples,
          remaining: isPrime.slice(),
        });
      }
    }
  }

  const primes = [];
  for (let i = 2; i < n; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }

  return { primes, steps };
}

// BONUS: Generator infinito de primos
function* infinitePrimeGenerator() {
  const primes = []; // Lista de primos encontrados
  let candidate = 2; // Candidato actual a verificar

  while (true) {
    let isPrime = true;

    // Solo necesitamos verificar divisibilidad hasta √candidate
    const sqrtCandidate = Math.sqrt(candidate);

    for (const prime of primes) {
      if (prime > sqrtCandidate) break;

      if (candidate % prime === 0) {
        isPrime = false;
        break;
      }
    }

    if (isPrime) {
      primes.push(candidate);
      yield candidate;
    }

    candidate++;
  }
}

// Función auxiliar para obtener los primeros N primos del generator
function getFirstNPrimes(n) {
  const generator = infinitePrimeGenerator();
  const primes = [];

  for (let i = 0; i < n; i++) {
    primes.push(generator.next().value);
  }

  return primes;
}

// Función para visualizar el proceso paso a paso
function visualizeSieve(n) {
  console.log(`\n📊 Visualización Sieve of Eratosthenes para N=${n}`);
  console.log("━".repeat(60));

  const { primes, steps } = sieveOfEratosthenesWithSteps(n);

  console.log("\nEstado inicial:");
  console.log("Números del 2 al", n - 1, "(todos candidatos a primos)");

  steps.forEach((step, index) => {
    console.log(`\n🔸 Paso ${index + 1}: Primo encontrado = ${step.prime}`);
    console.log(`   Marcando múltiplos: [${step.multiples.join(", ")}]`);
  });

  console.log("\n━".repeat(60));
  console.log(
    `✅ Primos encontrados (${primes.length}): [${primes.join(", ")}]`
  );
  console.log("━".repeat(60));
}

// Función para visualizar el generator
function visualizeGenerator(count) {
  console.log(`\n🔄 Generator Infinito de Primos`);
  console.log("━".repeat(60));

  const generator = infinitePrimeGenerator();
  const primes = [];

  console.log(`Generando los primeros ${count} primos:\n`);

  for (let i = 0; i < count; i++) {
    const prime = generator.next().value;
    primes.push(prime);

    if (i < 20 || i >= count - 5) {
      // Mostrar primeros 20 y últimos 5
      console.log(`  ${i + 1}. ${prime}`);
    } else if (i === 20) {
      console.log(`  ...`);
    }
  }

  console.log("\n━".repeat(60));
  console.log(`Total generados: ${primes.length}`);
  console.log(`Último primo: ${primes[primes.length - 1]}`);
  console.log("━".repeat(60));
}

/*
 * ============================================================================
 * ✅ CASOS DE PRUEBA
 * ============================================================================
 */

console.log("🧪 EJECUTANDO CASOS DE PRUEBA\n");
console.log("=".repeat(60));

// Test Case 1: Caso pequeño
console.log("\n📌 Test Case 1: N = 10");
const test1 = 10;
const result1 = sieveOfEratosthenes(test1);
console.log(`Input: N = ${test1}`);
console.log("Resultado:", result1);
console.log("Esperado: [2, 3, 5, 7]");
console.log(
  "Estado:",
  JSON.stringify(result1) === JSON.stringify([2, 3, 5, 7])
    ? "✅ PASS"
    : "❌ FAIL"
);

// Test Case 2: Ejemplo del problema
console.log("\n📌 Test Case 2: N = 30 (ejemplo del problema)");
const test2 = 30;
const result2 = sieveOfEratosthenes(test2);
console.log(`Input: N = ${test2}`);
console.log("Resultado:", result2);
console.log("Esperado: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]");
console.log(
  "Estado:",
  JSON.stringify(result2) ===
    JSON.stringify([2, 3, 5, 7, 11, 13, 17, 19, 23, 29])
    ? "✅ PASS"
    : "❌ FAIL"
);
visualizeSieve(test2);

// Test Case 3: N = 50
console.log("\n📌 Test Case 3: N = 50");
const test3 = 50;
const result3 = sieveOfEratosthenes(test3);
console.log(`Input: N = ${test3}`);
console.log("Resultado:", result3);
console.log(
  "Esperado: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]"
);
console.log(
  "Estado:",
  JSON.stringify(result3) ===
    JSON.stringify([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47])
    ? "✅ PASS"
    : "❌ FAIL"
);

// Test Case 4: N = 2 (edge case)
console.log("\n📌 Test Case 4: N = 2 (edge case)");
const test4 = 2;
const result4 = sieveOfEratosthenes(test4);
console.log(`Input: N = ${test4}`);
console.log("Resultado:", result4);
console.log("Esperado: []");
console.log(
  "Estado:",
  JSON.stringify(result4) === JSON.stringify([]) ? "✅ PASS" : "❌ FAIL"
);

// Test Case 5: N = 3
console.log("\n📌 Test Case 5: N = 3");
const test5 = 3;
const result5 = sieveOfEratosthenes(test5);
console.log(`Input: N = ${test5}`);
console.log("Resultado:", result5);
console.log("Esperado: [2]");
console.log(
  "Estado:",
  JSON.stringify(result5) === JSON.stringify([2]) ? "✅ PASS" : "❌ FAIL"
);

// Test Case 6: N = 100 (caso del ejemplo original)
console.log("\n📌 Test Case 6: N = 100");
const test6 = 100;
const result6 = sieveOfEratosthenes(test6);
console.log(`Input: N = ${test6}`);
console.log("Resultado:", result6);
console.log(`Cantidad de primos menores que 100: ${result6.length}`);
console.log("Esperado: 25 primos");
console.log("Estado:", result6.length === 25 ? "✅ PASS" : "❌ FAIL");

// Test Case 7: BONUS - Generator infinito
console.log("\n📌 Test Case 7: BONUS - Generator Infinito");
console.log("Generando los primeros 10 primos:");
const generatedPrimes = getFirstNPrimes(10);
console.log("Resultado:", generatedPrimes);
console.log("Esperado: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]");
console.log(
  "Estado:",
  JSON.stringify(generatedPrimes) ===
    JSON.stringify([2, 3, 5, 7, 11, 13, 17, 19, 23, 29])
    ? "✅ PASS"
    : "❌ FAIL"
);

// Test Case 8: BONUS - Primeros 50 primos con generator
console.log("\n📌 Test Case 8: BONUS - Primeros 50 primos");
visualizeGenerator(50);

console.log("\n" + "=".repeat(60));
console.log("🏁 TESTS COMPLETADOS\n");

/**
 * Utilidades de criptografía y seguridad.
 */

/**
 * Genera un hash SHA-256 para una contraseña.
 * @param {string} password - Contraseña en texto plano.
 * @returns {Promise<string>} Hash hexadecimal de la contraseña.
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Genera un número aleatorio seguro entre 0 (inclusivo) y 1 (exclusivo).
 * Reemplaza el uso de Math.random() que es criptográficamente inseguro.
 * @returns {number} Un número flotante pseudoaleatorio seguro.
 */
export function secureRandom() {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

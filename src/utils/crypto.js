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
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    throw new Error('No secure random number generator available.');
  }
  return array[0] / (0xffffffff + 1);
}

// SECRET KEY para simular firma de sesión HMAC-SHA256 en frontend (MOCK)
const generateSessionSecret = () => {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    throw new Error('No secure random number generator available.');
  }
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
};
const MOCK_SESSION_SECRET = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SESSION_SECRET : undefined) || generateSessionSecret();

/**
 * Genera una firma básica (MAC) simulada para los datos de sesión para prevenir Tampering.
 * @param {string} id - ID del usuario.
 * @param {string} role - Rol del usuario.
 * @returns {Promise<string>} Firma generada.
 */
export async function signSession(id, role) {
  const payload = `${id}:${role}:${MOCK_SESSION_SECRET}`;
  return await hashPassword(payload);
}

/**
 * Verifica la firma de la sesión.
 * @param {string} id - ID del usuario.
 * @param {string} role - Rol del usuario.
 * @param {string} signature - Firma a verificar.
 * @returns {Promise<boolean>} Verdadero si la firma coincide.
 */
export async function verifySession(id, role, signature) {
  if (!id || !role || !signature) return false;
  const expectedSignature = await signSession(id, role);
  return signature === expectedSignature;
}

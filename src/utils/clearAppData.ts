/**
 * Utility to clear all app-specific localStorage data
 * This prevents data leakage between user sessions
 */
export const clearAppData = () => {
  const keysToRemove = [
    'clienteInfo',
    'casaPropriaFormData', 
    'rendaExtraFormData',
    'aposentadoriaFormData',
    // Add any other app-specific localStorage keys here
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Namespace localStorage keys by user ID to prevent cross-user data exposure
 * @param userId - The user's ID
 * @param key - The localStorage key
 * @returns Namespaced key
 */
export const getNamespacedKey = (userId: string, key: string) => {
  return `${userId}:${key}`;
};
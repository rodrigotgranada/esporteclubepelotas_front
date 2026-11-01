/**
 * Gera uma senha aleatória segura e legível para uso provisório pelo clube.
 * Atende aos requisitos:
 * - Pelo menos 8 caracteres
 * - Letras maiúsculas e minúsculas
 * - Números
 * - Caracteres especiais
 */
export const generateTemporaryPassword = (): string => {
  const prefixes = ['Pelotas', 'Lobo', 'Avante', 'Agata', 'Boca'];
  const symbols = ['#', '@', '$', '!', '&'];
  
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  
  // 4 random digits (1000 - 9999)
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  
  // 2 random uppercase letters
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const randomLetter1 = letters[Math.floor(Math.random() * letters.length)];
  const randomLetter2 = letters[Math.floor(Math.random() * letters.length)];

  return `${randomPrefix}${randomSymbol}${randomDigits}${randomLetter1}${randomLetter2}`;
};

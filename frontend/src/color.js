const colorScheme = ["#F94144", "#f3722c", "#f8961e", "#f9844a", "#f9c74f", "#90be6d", "#43aa8b", "#4d908e", "#577590", "#277da1", "#FFFFFF", "#000000"];

/** 
 * Get a random color from the list above.
 */
export function randomColor() {
  return colorScheme[Math.floor(Math.random() * colorScheme.length)];
}
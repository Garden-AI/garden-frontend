/**
 * Parses groundhog-hpc function names from Python code.
 * Looks for functions decorated with @hog.function()
 */

export interface ParsedHpcFunction {
  name: string;
  lineNumber: number;
}

/**
 * Extracts all function names decorated with @hog.function() from Python code
 * @param code - The Python source code to parse
 * @returns Array of parsed function information
 */
export function parseHpcFunctions(code: string): ParsedHpcFunction[] {
  const functions: ParsedHpcFunction[] = [];
  const lines = code.split('\n');

  // Pattern to match function name from def statement
  const functionPattern = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line has a @hog.function decorator
    if (line.includes('@hog.function')) {
      // Move forward until we find a line starting with 'def'
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];

        if (nextLine.trim().startsWith('def')) {
          const match = nextLine.match(functionPattern);
          if (match) {
            functions.push({
              name: match[1],
              lineNumber: j + 1, // +1 for 1-based line numbers
            });
          }
          break;
        }
      }
    }
  }

  return functions;
}

/**
 * Validates that the code contains at least one @hog.function() decorated function
 * @param code - The Python source code to validate
 * @returns True if at least one HPC function is found
 */
export function hasHpcFunctions(code: string): boolean {
  return parseHpcFunctions(code).length > 0;
}

/**
 * Converts a snake_case function name to a more readable title
 * e.g., "say_hello" -> "Say Hello"
 */
export function functionNameToTitle(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

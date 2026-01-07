/**
 * Parses groundhog-hpc function names from Python code.
 * Looks for functions decorated with @hog.function() or @hog.method()
 */

export interface ParsedHpcFunction {
  name: string;
  lineNumber: number;
}

/**
 * Extracts all function names decorated with @hog.function() or @hog.method() from Python code
 * @param code - The Python source code to parse
 * @returns Array of parsed function information
 */
export function parseHpcFunctions(code: string): ParsedHpcFunction[] {
  const functions: ParsedHpcFunction[] = [];
  const lines = code.split('\n');

  // Pattern to match function name from def statement
  const functionPattern = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
  // Pattern to match class name
  const classPattern = /class\s+([a-zA-Z_][a-zA-Z0-9_]*)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line has a @hog.function or @hog.method decorator
    if (line.includes('@hog.function') || line.includes('@hog.method')) {
      const isMethod = line.includes('@hog.method');

      // Move forward until we find a line starting with 'def'
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];

        if (nextLine.trim().startsWith('def')) {
          const match = nextLine.match(functionPattern);
          if (match) {
            let functionName = match[1];

            // If it's a method, try to find the class
            if (isMethod) {
              const defIndentation = nextLine.search(/\S/);

              // Search backwards for the class definition
              for (let k = j - 1; k >= 0; k--) {
                const prevLine = lines[k];
                const prevLineTrimmed = prevLine.trim();
                const prevIndentation = prevLine.search(/\S/);

                // Found a class definition with less indentation
                if (prevLineTrimmed.startsWith('class') && prevIndentation < defIndentation && prevIndentation !== -1) {
                  const classMatch = prevLineTrimmed.match(classPattern);
                  if (classMatch) {
                    functionName = `${classMatch[1]}.${functionName}`;
                    break;
                  }
                }
              }
            }

            functions.push({
              name: functionName,
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
 * Validates that the code contains at least one @hog.function() or @hog.method() decorated function
 * @param code - The Python source code to validate
 * @returns True if at least one HPC function is found
 */
export function hasHpcFunctions(code: string): boolean {
  return parseHpcFunctions(code).length > 0;
}

/**
 * Converts a snake_case function name to a more readable title
 * e.g., "say_hello" -> "Say Hello"
 * e.g., "Statistics.compute_mean" -> "Statistics: Compute Mean"
 */
export function functionNameToTitle(name: string): string {
  // Handle namespaced methods from @hog.method
  if (name.includes('.')) {
    const [className, methodName] = name.split('.');
    return `${className}: ${functionNameToTitle(methodName)}`;
  }

  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

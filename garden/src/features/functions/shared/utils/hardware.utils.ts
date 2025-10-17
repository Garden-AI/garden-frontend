/**
 * Utility functions for hardware specification formatting
 */

/**
 * Formats hardware specification object into human-readable string array
 * @param spec - Hardware specification object with key-value pairs
 * @returns Array of formatted strings like "CPU: 4 cores", "Memory: 8GB"
 */
export const formatHardwareSpec = (
  spec: { [key: string]: string } | undefined | null
): string[] => {
  if (!spec) {
    return [];
  }

  return Object.entries(spec).map(([key, value]) => {
    let displayKey = key;

    // Special formatting for common hardware keys
    if (key.toLowerCase() === "gpus" || key.toLowerCase() === "cpu") {
      displayKey = key.toUpperCase();
    } else if (key.toLowerCase() === "memory") {
      displayKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    }

    const displayValue = value || "Not Specified";

    return `${displayKey}: ${displayValue}`;
  });
};

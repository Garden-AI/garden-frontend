// Utility functions for formatting and coloring benchmark metrics

/**
 * Generate a red-yellow-green background color based on value and metric direction
 */
export const getColorForValue = (value: number, betterIs: 'higher' | 'lower' = 'higher'): string => {
    let normalizedValue = value;

    // For "lower is better" metrics, we need to invert the color logic
    if (betterIs === 'lower') {
        // For lower-is-better metrics, smaller values should be green
        // We'll map the value to a 0-1 scale where 0 = green (best) and 1 = red (worst)
        if (value <= 0) {
            // Perfect score for lower-is-better (0 or negative) = bright green
            return `rgba(0, 180, 0, 0.4)`;
        } else if (value >= 1) {
            // Very bad score for lower-is-better (1 or higher) = use log scale
            const intensity = Math.min(0.6, 0.3 + Math.log10(value) * 0.15);
            return `rgba(255, 0, 0, ${intensity})`;
        } else {
            // Invert the value so that 0 = 1 (green) and 1 = 0 (red)
            normalizedValue = 1 - value;
        }
    } else {
        // For "higher is better" metrics (original logic)
        if (value > 1) {
            const intensity = Math.min(0.6, 0.3 + Math.log10(value) * 0.15);
            return `rgba(0, 180, 0, ${intensity})`;
        }
        normalizedValue = value;
    }

    // Ensure value is between 0 and 1 for color interpolation
    const clampedValue = Math.max(0, Math.min(1, normalizedValue));

    // Red-Yellow-Green transition
    // For values 0-0.5: red to yellow
    // For values 0.5-1: yellow to green
    let red, green, blue;

    if (clampedValue < 0.5) {
        // Red to Yellow (red stays at 255, green increases)
        red = 255;
        green = Math.round(255 * (clampedValue * 2)); // *2 to reach 255 at value=0.5
        blue = 0;
    } else {
        // Yellow to Green (green stays at 255, red decreases)
        red = Math.round(255 * (1 - (clampedValue - 0.5) * 2)); // *2 to reach 0 at value=1
        green = 255;
        blue = 0;
    }

    // Higher opacity for better visibility
    const opacity = 0.3;

    // Return rgba color with appropriate transparency
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

// Metric category themes for consistent coloring across UI
export const METRIC_CATEGORY_THEMES: Record<string, string> = {
    // Hardware - Slate/Blue
    'device_type': 'border-slate-400/50 bg-slate-50/50 dark:bg-slate-900/50',
    'num_gpus': 'border-slate-400/50 bg-slate-50/50 dark:bg-slate-900/50',
    'gpu_names': 'border-slate-400/50 bg-slate-50/50 dark:bg-slate-900/50',

    // Timing/Performance - Green
    'total_seconds': 'border-green-400/50 bg-green-50/50 dark:bg-green-900/50',
    'throughput_per_second': 'border-green-400/50 bg-green-50/50 dark:bg-green-900/50',
    'num_workers': 'border-green-400/50 bg-green-50/50 dark:bg-green-900/50',

    // Cost - Amber
    'total_gpu_hours': 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/50',
    'estimated_cost_usd': 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/50',
    'estimated_cost_per_1000_structures_usd': 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-900/50',

    // Dataset - Purple
    'num_structures_processed': 'border-purple-400/50 bg-purple-50/50 dark:bg-purple-900/50',
    'num_structures_total': 'border-purple-400/50 bg-purple-50/50 dark:bg-purple-900/50',
};

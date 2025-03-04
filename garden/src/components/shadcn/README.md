# Shadcn UI Components

This directory contains vendored components from [shadcn/ui](https://ui.shadcn.com/), which are re-usable components built on top of Radix UI primitives.

## Important Notes

- **These are vendored components** - They originated from the shadcn/ui project but are copied into our codebase
- **Avoid direct modifications** - Instead of editing these files directly, prefer composition or extension
- **If you must modify** - Document your changes clearly with comments explaining why the modification was necessary

## Adding New Components

To add a new shadcn component, use the CLI:

```bash
npx shadcn add [component-name]
```
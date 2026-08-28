import { describe, it, expect } from 'vitest';
import { parseHpcFunctions, hasHpcFunctions, functionNameToTitle } from '@/features/functions/hpc/utils/parseHpcFunctions';

describe('parseHpcFunctions', () => {
  it('should parse @hog.function decorators', () => {
    const code = `
@hog.function()
def my_func():
    pass
    `;
    const result = parseHpcFunctions(code);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ name: 'my_func', lineNumber: 3 });
  });

  it('should parse @hog.method decorators', () => {
    const code = `
class MyStats:
    @hog.method(endpoint="anvil")
    def compute_mean(numbers):
        return sum(numbers) / len(numbers)
    `;
    const result = parseHpcFunctions(code);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ name: 'MyStats.compute_mean', lineNumber: 4 });
  });

  it('should namespace @hog.method functions with their class name', () => {
    const code = `
class Statistics:
    @hog.method()
    def compute_mean(numbers):
        pass
    `;
    const result = parseHpcFunctions(code);
    expect(result[0].name).toBe('Statistics.compute_mean');
  });

  it('should parse multiple decorators in the same file', () => {
    const code = `
@hog.function()
def func1():
    pass

class MyClass:
    @hog.method()
    def method1():
        pass
    `;
    const result = parseHpcFunctions(code);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('func1');
    expect(result[1].name).toBe('MyClass.method1');
  });

  it('should return an empty array if no decorators are present', () => {
    const code = `
def regular_func():
    pass
    `;
    const result = parseHpcFunctions(code);
    expect(result).toHaveLength(0);
  });
});

describe('hasHpcFunctions', () => {
  it('should return true if @hog.function is present', () => {
    const code = '@hog.function()\ndef f(): pass';
    expect(hasHpcFunctions(code)).toBe(true);
  });

  it('should return true if @hog.method is present', () => {
    const code = '@hog.method()\ndef f(): pass';
    expect(hasHpcFunctions(code)).toBe(true);
  });

  it('should return false if no HPC decorators are present', () => {
    const code = 'def f(): pass';
    expect(hasHpcFunctions(code)).toBe(false);
  });
});

describe('functionNameToTitle', () => {
  it('should convert snake_case to Title Case', () => {
    expect(functionNameToTitle('my_function_name')).toBe('My Function Name');
    expect(functionNameToTitle('hello')).toBe('Hello');
  });

  it('should handle namespaced names from @hog.method', () => {
    expect(functionNameToTitle('Statistics.compute_mean')).toBe('Statistics: Compute Mean');
  });
});

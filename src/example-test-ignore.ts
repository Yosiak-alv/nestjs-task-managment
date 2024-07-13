function addNumbers(a, b) {
  return a + b;
}

describe('addNumbers', () => {
  it('should add two numbers', () => {
    expect(addNumbers(1, 2)).toBe(3);
  });
});
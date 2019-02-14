const add1 = (n: number) => n + 1;

describe('hello world d', async () => {
  it(`should add 1`, async () => {
    expect(add1(2)).to.equal(3);
  });
});
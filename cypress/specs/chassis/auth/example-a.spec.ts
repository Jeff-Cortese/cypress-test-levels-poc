const sayHello = () => 'hello';

describe('hello world', async () => {
  it(`should say hello`, async () => {
    expect(sayHello()).to.equal('hello');
  });
});
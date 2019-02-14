const saySomething = () => 'something';

describe('hello world c', async () => {
  it(`should say something`, async () => {
    expect(saySomething()).to.equal('something');
  });
});
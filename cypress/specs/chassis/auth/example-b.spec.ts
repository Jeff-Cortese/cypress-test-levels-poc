const sayGoodbye = () => 'bye';

describe('hello world b', async () => {
  it(`should say bye`, async () => {
    expect(sayGoodbye()).to.equal('bye');
  });
});
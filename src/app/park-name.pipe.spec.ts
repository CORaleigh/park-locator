import { ParkNamePipe } from './park-name.pipe';

describe('ParkNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ParkNamePipe();
    expect(pipe).toBeTruthy();
  });
});

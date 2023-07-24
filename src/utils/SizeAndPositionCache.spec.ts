import SizeAndPositionCache from './SizeAndPositionCache'

describe('SizeAndPositionCache', () => {
  it('From less to greater', () => {
    const cache = new SizeAndPositionCache();

    cache.push(0, 10);
    cache.push(10, 20);
    cache.push(20, 30);
    cache.push(30, 40);
    cache.push(40, 50);

    expect(cache.get(0)).toEqual(0);
    expect(cache.get(9)).toEqual(0);
    expect(cache.get(10)).toEqual(1);
    expect(cache.get(19)).toEqual(1);
    expect(cache.get(20)).toEqual(2);
    expect(cache.get(29)).toEqual(2);
    expect(cache.get(30)).toEqual(3);
    expect(cache.get(39)).toEqual(3);
    expect(cache.get(40)).toEqual(4);
    expect(cache.get(49)).toEqual(4);
    expect(cache.get(50)).toEqual(-1);
  })
})
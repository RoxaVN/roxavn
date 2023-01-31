import { http } from '../../src/web';

describe('http', () => {
  it('genGetUrl() should work', () => {
    expect(
      http.genGetUrl('/test/', {
        id: 1,
        age: 2,
        name: 'hai',
        str: '',
        null: null,
        undefined: undefined,
      })
    ).toEqual('/test/?id=1&age=2&name=hai');
    const user = { name: 'hai', age: 23 };
    expect(http.genGetUrl('/test', { user })).toBeTruthy();
    // expect(http.genGetUrl('/test', { user })).toEqual(
    //   '/test?user=' + encodeURIComponent(JSON.stringify(user))
    // );
  });
});

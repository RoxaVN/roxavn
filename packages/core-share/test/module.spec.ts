import { BaseModule, INTERNAL_WEB_BASE_PATH } from '../src';

describe('module', () => {
  describe('BaseModule', () => {
    it('should define', () => {
      expect(BaseModule).toBeTruthy();
    });

    it('getBasePath() should throw', () => {
      expect(() => BaseModule.getBasePath('n')).toThrow();
    });

    it('genWebLink should work', () => {
      const m = new BaseModule('name');
      const orgGetBasePath = BaseModule.getBasePath;
      BaseModule.getBasePath = (n) => n;
      expect(m.genWebPath({ path: '/login', isInternal: false })).toEqual(
        '/name/login'
      );
      expect(m.genWebPath({ path: '/login', isInternal: true })).toEqual(
        INTERNAL_WEB_BASE_PATH + '/login'
      );
      BaseModule.getBasePath = orgGetBasePath;
    });

    describe('escapedName', () => {
      it('should work', () => {
        const module = new BaseModule('@roxavn/module');
        expect(module.name).toEqual('@roxavn/module');
        expect(module.escapedName).toEqual('@roxavn@module');
      });
    });

    describe('escapeName', () => {
      it('should work', () => {
        expect(BaseModule.escapeName('@roxavn/module')).toEqual(
          '@roxavn@module'
        );
      });
    });

    describe('api', () => {
      it('should work', () => {
        const module = new BaseModule('@roxavn/module');
        let api = module.api(
          {
            method: 'GET',
            path: '/test',
          },
          true
        );
        expect(api.path).toEqual('/__api/internal/@roxavn@module/test');

        api = module.api(
          {
            method: 'GET',
            path: '/:id/test',
          },
          false,
          { id: '123' }
        );
        expect(api.path).toEqual('/__api/external/@roxavn@module/123/test');
      });
    });
  });
});

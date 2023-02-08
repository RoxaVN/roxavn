import { BaseModule } from '../../src/base';

describe('module', () => {
  describe('BaseModule', () => {
    it('should define', () => {
      expect(BaseModule).toBeTruthy();
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
        const api = module.api({
          method: 'GET',
          path: '/test',
        });
        expect(api.path).toEqual('/__api/@roxavn@module/test');
      });
    });
  });
});

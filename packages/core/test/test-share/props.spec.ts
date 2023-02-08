import { ExactProps, PartialProps } from '../../src/base';

describe('props', () => {
  describe('ExactProps', () => {
    it('should work with required props', () => {
      class X extends ExactProps<X> {
        name!: string;
        age!: number;
        address?: string;
      }

      const x = new X({ name: 'Alice', age: 18 });
      expect(x.name).toEqual('Alice');
      expect(x.age).toEqual(18);
      expect(x.address).toBeUndefined();
    });

    it('should work with all props', () => {
      class X extends ExactProps<X> {
        name!: string;
        age!: number;
        address?: string;
      }

      const x = new X({ name: 'Alice', age: 18, address: 'Vietnam' });
      expect(x.name).toEqual('Alice');
      expect(x.age).toEqual(18);
      expect(x.address).toEqual('Vietnam');
    });
  });

  describe('PartialProps', () => {
    it('should work with no props', () => {
      class X extends PartialProps<X> {
        name!: string;
        age!: number;
      }

      const x = new X();
      expect(x.name).toBeUndefined();
      expect(x.age).toBeUndefined();
    });

    it('should work with partial props', () => {
      class X extends PartialProps<X> {
        name!: string;
        age!: number;
      }

      const x = new X({ name: 'Alice' });
      expect(x.name).toEqual('Alice');
      expect(x.age).toBeUndefined();
    });

    it('should work with all props', () => {
      class X extends PartialProps<X> {
        name!: string;
        age!: number;
      }

      const x = new X({ name: 'Alice', age: 18 });
      expect(x.name).toEqual('Alice');
      expect(x.age).toEqual(18);
    });
  });
});

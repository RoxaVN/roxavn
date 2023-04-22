import { Transform, Type } from 'class-transformer';

export const TransformArray = (transformElement?: (element: any) => any) =>
  Transform(({ value }) => {
    const result = Array.isArray(value) ? value : [value];
    if (transformElement) {
      return result.map(transformElement);
    }
    return result;
  });

export const TransformJson = () => Transform(({ value }) => JSON.parse(value));

export const TransformNumber = () => Type(() => Number);

export const TransformDate = () => Type(() => Date);

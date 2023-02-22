import { Transform, Type } from 'class-transformer';

export const TransformArray = () =>
  Transform(({ value }) => (Array.isArray(value) ? value : [value]));

export const TransformNumber = () => Type(() => Number);

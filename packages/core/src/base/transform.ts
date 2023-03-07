import { Transform, Type } from 'class-transformer';

export const TransformArray = () =>
  Transform(({ value }) => (Array.isArray(value) ? value : [value]));

export const TransformJson = () => Transform(({ value }) => JSON.parse(value));

export const TransformNumber = () => Type(() => Number);

export const TransformDate = () => Type(() => Date);

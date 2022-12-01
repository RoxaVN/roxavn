import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validateByClass = <T extends Record<string, any>>(
  cls: ClassConstructor<T>,
  object: Record<string, unknown>
): T => {
  const clsInstance = plainToClass(cls, object);

  const errors = validateSync(clsInstance, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    const errorMessage = errors.map((error) => error.toString()).join('\n');
    console.log(errorMessage);

    throw new Error(errorMessage);
  }

  return clsInstance;
};

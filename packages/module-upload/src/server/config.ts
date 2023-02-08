import { IsOptional, MinLength, validateByClass } from '@roxavn/core/base';
import { Type } from 'class-transformer';

class EnvClass {
  @MinLength(1)
  SEAWEED_MASTER_URL!: string;

  @IsOptional()
  @Type(() => Boolean)
  SEAWEED_USE_PUBLIC_URL = false;
}

export const Env = validateByClass(EnvClass, process.env);

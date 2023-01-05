import {
  ArrayContains as _ArrayContains,
  ArrayMaxSize as _ArrayMaxSize,
  ArrayMinSize as _ArrayMinSize,
  ArrayNotContains as _ArrayNotContains,
  ArrayNotEmpty as _ArrayNotEmpty,
  ArrayUnique as _ArrayUnique,
  ArrayUniqueIdentifier,
  Contains as _Contains,
  IsAlpha as _IsAlpha,
  IsAlphanumeric as _IsAlphanumeric,
  IsArray as _IsArray,
  IsBoolean as _IsBoolean,
  IsBooleanString as _IsBooleanString,
  IsDate as _IsDate,
  IsDateString as _IsDateString,
  IsDecimal as _IsDecimal,
  IsDefined as _IsDefined,
  IsDivisibleBy as _IsDivisibleBy,
  IsEmail as _IsEmail,
  IsEnum as _IsEnum,
  IsIn as _IsIn,
  IsInt as _IsInt,
  IsLatitude as _IsLatitude,
  IsLatLong as _IsLatLong,
  IsLongitude as _IsLongitude,
  IsLowercase as _IsLowercase,
  IsMimeType as _IsMimeType,
  IsNegative as _IsNegative,
  IsNotEmpty as _IsNotEmpty,
  IsNotEmptyObject as _IsNotEmptyObject,
  IsNotIn as _IsNotIn,
  IsNumber as _IsNumber,
  IsNumberOptions,
  IsNumberString as _IsNumberString,
  IsObject as _IsObject,
  IsOptional as _IsOptional,
  IsPhoneNumber as _IsPhoneNumber,
  IsPositive as _IsPositive,
  IsString as _IsString,
  IsUppercase as _IsUppercase,
  IsUrl as _IsUrl,
  IsUUID as _IsUUID,
  Matches as _Matches,
  Max as _Max,
  MaxDate as _MaxDate,
  MaxLength as _MaxLength,
  Min as _Min,
  MinDate as _MinDate,
  MinLength as _MinLength,
  NotContains as _NotContains,
  NotEquals as _NotEquals,
  registerDecorator,
  UUIDVersion,
  ValidationOptions,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js';
import validator from 'validator';
import { ApiFilter } from './api';
import { I18nErrorField } from './errors';
import { baseModule } from './module';

const buildContext = (
  key: string,
  params?: Record<string, unknown>
): I18nErrorField => ({
  key: 'Validation.' + key,
  ns: baseModule.escapedName,
  params,
});

export function IsQueryFilter(
  filters: string[],
  validationOptions?: ValidationOptions
) {
  return function (object: Record<string, any>, propertyName: string) {
    const target: any = object.constructor;
    if (!target.__filters__) {
      target.__filters__ = {};
    }
    target.__filters__[propertyName] = filters;

    registerDecorator({
      name: 'isQueryFilter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [filters],
      options: {
        context: buildContext('IsQueryFilter', { filters }),
        ...validationOptions,
      },
      validator: {
        defaultMessage: () => `Not in ${filters.join(', ')}`,
        validate(value: any) {
          return (
            value instanceof ApiFilter &&
            !!value.mode &&
            filters.includes(value.mode)
          );
        },
      },
    });
  };
}

export const IsDefined = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDefined({
    ...validationOptions,
    context: buildContext('IsDefined'),
  });
};

export const IsOptional = _IsOptional;

export const NotEquals = (
  comparison: any,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _NotEquals(comparison, {
    ...validationOptions,
    context: buildContext('NotEquals', { comparison }),
  });
};

export const IsNotEmpty = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNotEmpty({
    ...validationOptions,
    context: buildContext('IsNotEmpty'),
  });
};

export const IsIn = (
  values: readonly any[],
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsIn(values, {
    ...validationOptions,
    context: buildContext('IsIn', { values }),
  });
};

export const IsNotIn = (
  values: readonly any[],
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNotIn(values, {
    ...validationOptions,
    context: buildContext('IsNotIn', { values }),
  });
};

export const IsBoolean = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsBoolean({
    ...validationOptions,
    context: buildContext('IsBoolean'),
  });
};

export const IsDate = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDate({
    ...validationOptions,
    context: buildContext('IsDate'),
  });
};

export const IsNumber = (
  options?: IsNumberOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNumber(options, {
    ...validationOptions,
    context: buildContext('IsNumber'),
  });
};

export const IsInt = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsInt({
    ...validationOptions,
    context: buildContext('IsInt'),
  });
};

export const IsString = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsString({
    ...validationOptions,
    context: buildContext('IsString'),
  });
};

export const IsArray = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsArray({
    ...validationOptions,
    context: buildContext('IsArray'),
  });
};

export const IsDivisibleBy = (
  number: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDivisibleBy(number, {
    ...validationOptions,
    context: buildContext('IsDivisibleBy', { number }),
  });
};

export const IsPositive = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsPositive({
    ...validationOptions,
    context: buildContext('IsPositive'),
  });
};

export const IsNegative = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNegative({
    ...validationOptions,
    context: buildContext('IsNegative'),
  });
};

export const Min = (
  min: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _Min(min, {
    ...validationOptions,
    context: buildContext('Min', { number: min }),
  });
};

export const Max = (
  max: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _Max(max, {
    ...validationOptions,
    context: buildContext('Max', { number: max }),
  });
};

export const MinDate = (
  date: Date,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _MinDate(date, {
    ...validationOptions,
    context: buildContext('MinDate', { date }),
  });
};

export const MaxDate = (
  date: Date,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _MaxDate(date, {
    ...validationOptions,
    context: buildContext('MaxDate', { date }),
  });
};

export const IsDateString = (
  options?: validator.IsISO8601Options,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDateString(options, {
    ...validationOptions,
    context: buildContext('IsDateString'),
  });
};

export const IsBooleanString = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsBooleanString({
    ...validationOptions,
    context: buildContext('IsBooleanString'),
  });
};

export const IsNumberString = (
  options?: validator.IsNumericOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNumberString(options, {
    ...validationOptions,
    context: buildContext('IsNumberString'),
  });
};

export const Contains = (
  seed: string,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _Contains(seed, {
    ...validationOptions,
    context: buildContext('Contains', { seed }),
  });
};

export const NotContains = (
  seed: string,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _NotContains(seed, {
    ...validationOptions,
    context: buildContext('NotContains', { seed }),
  });
};

export const IsAlpha = (
  locale?: string,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsAlpha(locale, {
    ...validationOptions,
    context: buildContext('IsAlpha'),
  });
};

export const IsAlphanumeric = (
  locale?: string,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsAlphanumeric(locale, {
    ...validationOptions,
    context: buildContext('IsAlphanumeric'),
  });
};

export const IsDecimal = (
  options?: validator.IsDecimalOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDecimal(options, {
    ...validationOptions,
    context: buildContext('IsDecimal'),
  });
};

export const IsLatLong = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsLatLong({
    ...validationOptions,
    context: buildContext('IsLatLong'),
  });
};

export const IsLatitude = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsLatitude({
    ...validationOptions,
    context: buildContext('IsLatitude'),
  });
};

export const IsLongitude = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsLongitude({
    ...validationOptions,
    context: buildContext('IsLongitude'),
  });
};

export const IsEmail = (
  options?: validator.IsEmailOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsEmail(options, {
    ...validationOptions,
    context: buildContext('IsEmail'),
  });
};

export const IsEnum = (
  entity: Record<string, unknown>,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsEnum(entity, {
    ...validationOptions,
    context: buildContext('IsEnum'),
  });
};

export const IsLowercase = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsLowercase({
    ...validationOptions,
    context: buildContext('IsLowercase'),
  });
};

export const IsUppercase = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsUppercase({
    ...validationOptions,
    context: buildContext('IsUppercase'),
  });
};

export const IsPhoneNumber = (
  region?: CountryCode,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsPhoneNumber(region, {
    ...validationOptions,
    context: buildContext('IsPhoneNumber'),
  });
};

export const IsUrl = (
  options?: validator.IsURLOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsUrl(options, {
    ...validationOptions,
    context: buildContext('IsUrl'),
  });
};

export const IsUUID = (
  version?: UUIDVersion,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsUUID(version, {
    ...validationOptions,
    context: buildContext('IsUUID'),
  });
};

export const IsMimeType = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsMimeType({
    ...validationOptions,
    context: buildContext('IsMimeType'),
  });
};

export const IsObject = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsObject({
    ...validationOptions,
    context: buildContext('IsObject'),
  });
};

export const IsNotEmptyObject = (
  options?: { nullable?: boolean },
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNotEmptyObject(options, {
    ...validationOptions,
    context: buildContext('IsNotEmptyObject'),
  });
};

export const MinLength = (
  min: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _MinLength(min, {
    ...validationOptions,
    context: buildContext('MinLength', { number: min }),
  });
};

export const MaxLength = (
  max: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _MaxLength(max, {
    ...validationOptions,
    context: buildContext('MaxLength', { number: max }),
  });
};

export const Matches = (
  pattern: RegExp,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _Matches(pattern, {
    ...validationOptions,
    context: buildContext('Matches'),
  });
};

export const ArrayContains = (
  values: any[],
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayContains(values, {
    ...validationOptions,
    context: buildContext('ArrayContains', { values }),
  });
};

export const ArrayNotContains = (
  values: any[],
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayNotContains(values, {
    ...validationOptions,
    context: buildContext('ArrayNotContains', { values }),
  });
};

export const ArrayNotEmpty = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayNotEmpty({
    ...validationOptions,
    context: buildContext('ArrayNotEmpty'),
  });
};

export const ArrayMinSize = (
  min: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayMinSize(min, {
    ...validationOptions,
    context: buildContext('ArrayMinSize', { number: min }),
  });
};

export const ArrayMaxSize = (
  max: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayMaxSize(max, {
    ...validationOptions,
    context: buildContext('ArrayMaxSize', { number: max }),
  });
};

export const ArrayUnique = (
  identifierOrOptions?: ValidationOptions | ArrayUniqueIdentifier<any>,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayUnique(identifierOrOptions, {
    ...validationOptions,
    context: buildContext('ArrayUnique'),
  });
};

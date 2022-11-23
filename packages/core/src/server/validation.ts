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
  UUIDVersion,
  ValidationOptions,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js';
import validator from 'validator';

const buildMessage = (
  message: string,
  params?: Record<string, unknown>
): string => {
  return JSON.stringify({ message: `Validation.${message}`, params });
};

export const IsDefined = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDefined({
    ...validationOptions,
    message: buildMessage('IsDefined'),
  });
};

export const IsOptional = _IsOptional;

export const NotEquals = (
  comparison: any,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _NotEquals(comparison, {
    ...validationOptions,
    message: buildMessage('NotEquals', { comparison }),
  });
};

export const IsNotEmpty = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNotEmpty({
    ...validationOptions,
    message: buildMessage('IsNotEmpty'),
  });
};

export const IsIn = (
  values: readonly any[],
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsIn(values, {
    ...validationOptions,
    message: buildMessage('IsIn', { values }),
  });
};

export const IsNotIn = (
  values: readonly any[],
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNotIn(values, {
    ...validationOptions,
    message: buildMessage('IsNotIn', { values }),
  });
};

export const IsBoolean = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsBoolean({
    ...validationOptions,
    message: buildMessage('IsBoolean'),
  });
};

export const IsDate = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDate({
    ...validationOptions,
    message: buildMessage('IsDate'),
  });
};

export const IsNumber = (
  options?: IsNumberOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNumber(options, {
    ...validationOptions,
    message: buildMessage('IsNumber'),
  });
};

export const IsInt = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsInt({
    ...validationOptions,
    message: buildMessage('IsInt'),
  });
};

export const IsString = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsString({
    ...validationOptions,
    message: buildMessage('IsString'),
  });
};

export const IsArray = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsArray({
    ...validationOptions,
    message: buildMessage('IsArray'),
  });
};

export const IsDivisibleBy = (
  number: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDivisibleBy(number, {
    ...validationOptions,
    message: buildMessage('IsDivisibleBy', { number }),
  });
};

export const IsPositive = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsPositive({
    ...validationOptions,
    message: buildMessage('IsPositive'),
  });
};

export const IsNegative = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNegative({
    ...validationOptions,
    message: buildMessage('IsNegative'),
  });
};

export const Min = (
  min: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _Min(min, {
    ...validationOptions,
    message: buildMessage('Min', { number: min }),
  });
};

export const Max = (
  max: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _Max(max, {
    ...validationOptions,
    message: buildMessage('Max', { number: max }),
  });
};

export const MinDate = (
  date: Date,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _MinDate(date, {
    ...validationOptions,
    message: buildMessage('MinDate', { date }),
  });
};

export const MaxDate = (
  date: Date,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _MaxDate(date, {
    ...validationOptions,
    message: buildMessage('MaxDate', { date }),
  });
};

export const IsDateString = (
  options?: validator.IsISO8601Options,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDateString(options, {
    ...validationOptions,
    message: buildMessage('IsDateString'),
  });
};

export const IsBooleanString = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsBooleanString({
    ...validationOptions,
    message: buildMessage('IsBooleanString'),
  });
};

export const IsNumberString = (
  options?: validator.IsNumericOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNumberString(options, {
    ...validationOptions,
    message: buildMessage('IsNumberString'),
  });
};

export const Contains = (
  seed: string,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _Contains(seed, {
    ...validationOptions,
    message: buildMessage('Contains', { seed }),
  });
};

export const NotContains = (
  seed: string,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _NotContains(seed, {
    ...validationOptions,
    message: buildMessage('NotContains', { seed }),
  });
};

export const IsAlpha = (
  locale?: string,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsAlpha(locale, {
    ...validationOptions,
    message: buildMessage('IsAlpha'),
  });
};

export const IsAlphanumeric = (
  locale?: string,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsAlphanumeric(locale, {
    ...validationOptions,
    message: buildMessage('IsAlphanumeric'),
  });
};

export const IsDecimal = (
  options?: validator.IsDecimalOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsDecimal(options, {
    ...validationOptions,
    message: buildMessage('IsDecimal'),
  });
};

export const IsLatLong = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsLatLong({
    ...validationOptions,
    message: buildMessage('IsLatLong'),
  });
};

export const IsLatitude = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsLatitude({
    ...validationOptions,
    message: buildMessage('IsLatitude'),
  });
};

export const IsLongitude = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsLongitude({
    ...validationOptions,
    message: buildMessage('IsLongitude'),
  });
};

export const IsEmail = (
  options?: validator.IsEmailOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsEmail(options, {
    ...validationOptions,
    message: buildMessage('IsEmail'),
  });
};

export const IsEnum = (
  entity: Record<string, unknown>,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsEnum(entity, {
    ...validationOptions,
    message: buildMessage('IsEnum'),
  });
};

export const IsLowercase = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsLowercase({
    ...validationOptions,
    message: buildMessage('IsLowercase'),
  });
};

export const IsUppercase = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsUppercase({
    ...validationOptions,
    message: buildMessage('IsUppercase'),
  });
};

export const IsPhoneNumber = (
  region?: CountryCode,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsPhoneNumber(region, {
    ...validationOptions,
    message: buildMessage('IsPhoneNumber'),
  });
};

export const IsUrl = (
  options?: validator.IsURLOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsUrl(options, {
    ...validationOptions,
    message: buildMessage('IsUrl'),
  });
};

export const IsUUID = (
  version?: UUIDVersion,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsUUID(version, {
    ...validationOptions,
    message: buildMessage('IsUUID'),
  });
};

export const IsMimeType = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsMimeType({
    ...validationOptions,
    message: buildMessage('IsMimeType'),
  });
};

export const IsObject = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsObject({
    ...validationOptions,
    message: buildMessage('IsObject'),
  });
};

export const IsNotEmptyObject = (
  options?: { nullable?: boolean },
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _IsNotEmptyObject(options, {
    ...validationOptions,
    message: buildMessage('IsNotEmptyObject'),
  });
};

export const MinLength = (
  min: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _MinLength(min, {
    ...validationOptions,
    message: buildMessage('MinLength', { number: min }),
  });
};

export const MaxLength = (
  max: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _MaxLength(max, {
    ...validationOptions,
    message: buildMessage('MaxLength', { number: max }),
  });
};

export const Matches = (
  pattern: RegExp,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _Matches(pattern, {
    ...validationOptions,
    message: buildMessage('Matches'),
  });
};

export const ArrayContains = (
  values: any[],
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayContains(values, {
    ...validationOptions,
    message: buildMessage('ArrayContains', { values }),
  });
};

export const ArrayNotContains = (
  values: any[],
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayNotContains(values, {
    ...validationOptions,
    message: buildMessage('ArrayNotContains', { values }),
  });
};

export const ArrayNotEmpty = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayNotEmpty({
    ...validationOptions,
    message: buildMessage('ArrayNotEmpty'),
  });
};

export const ArrayMinSize = (
  min: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayMinSize(min, {
    ...validationOptions,
    message: buildMessage('ArrayMinSize', { number: min }),
  });
};

export const ArrayMaxSize = (
  max: number,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayMaxSize(max, {
    ...validationOptions,
    message: buildMessage('ArrayMaxSize', { number: max }),
  });
};

export const ArrayUnique = (
  identifierOrOptions?: ValidationOptions | ArrayUniqueIdentifier<any>,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return _ArrayUnique(identifierOrOptions, {
    ...validationOptions,
    message: buildMessage('ArrayUnique'),
  });
};

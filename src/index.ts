import {
  StringType,
  BooleanType,
  NumberType,
  DateType,
  EnumType,
  EnumSetType,
  ObjectType,
  ArrayType,
  FileType,
  SchemaObject,
  SchemaArray,
  SchemaLiteral,
  TypedSchema,
} from "@ioc:Adonis/Core/Validator";

import { Constructor } from "../contracts/common";

/**
 * Declare validation rule.
 *
 * @param paramSchema Adonis Validation Schema
 * @returns
 */
export const rule = function (paramSchema: SchemaType) {
  return function (target: any, propertyKey: string) {
    const validationSchema = getTargetValidatorSchema(target);
    validationSchema.meta[propertyKey] = paramSchema as any;
  };
};

/**
 * Convert a class to a member type.
 *
 * @param nestedClass Class
 * @returns Member type.
 */
export const nested = <T>(nestedClass: Constructor<T>): TypedSchema =>
  getTargetValidatorSchema(nestedClass).meta;

/**
 * Get the schema of a target.
 *
 * @param target Target
 * @returns Validation Schema.
 */
export const getTargetValidatorSchema = (target: any): ClassValidatorSchema => {
  const id = "@__validatorSchema";
  const prototype = (target && target.prototype) || target;
  if (prototype?.[id]) return prototype[id];

  const cacheKey = `${__dirname}.${prototype.constructor.name}`;
  prototype[id] = { cacheKey, meta: {} };
  return prototype[id];
};

/**
 * Class validator schema.
 */
type ClassValidatorSchema = {
  key: string;
  meta: TypedSchema;
};

/**
 * Types that have members.
 */
export type MemberType = {
  t: { [x: string]: any };
  getTree(): SchemaLiteral | SchemaArray | SchemaObject;
};

/**
 * Supported class validation base schemas (leverages default Adonis types).
 */
type SchemaType =
  | ReturnType<StringType>
  | ReturnType<BooleanType>
  | ReturnType<NumberType>
  | ReturnType<DateType>
  | ReturnType<EnumType>
  | ReturnType<EnumSetType>
  | ReturnType<ObjectType>
  | ReturnType<ArrayType>
  | ReturnType<FileType>
  | MemberType;

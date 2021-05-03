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
} from "@ioc:Adonis/Core/Validator";

/**
 * Declare validation rule.
 *
 * @param schema Adonis Validation Schema
 * @returns
 */
export const rule = (schema: SchemaType) => (
  target: any,
  propertyKey: string
) => {
  if (target.__validationSchema == undefined) {
    target.__validationSchema = {
      cacheKey: target.constructor.name,
    };
  }

  if (isObjectSchema(target[propertyKey])) {
    (target[propertyKey] as ReturnType<ObjectType>).members(
      target[propertyKey].__validationSchema
    );
  } else {
    target.__validationSchema[propertyKey] = schema;
  }
};

export const isObjectSchema = (schema: SchemaType) => {
  return (schema as ReturnType<ObjectType>).members != undefined;
};

/**
 * Supported Adonis base schemas.
 */
export type SchemaType =
  | ReturnType<StringType>
  | ReturnType<BooleanType>
  | ReturnType<NumberType>
  | ReturnType<DateType>
  | ReturnType<EnumType>
  | ReturnType<EnumSetType>
  | ReturnType<ObjectType>
  | ReturnType<ArrayType>
  | ReturnType<FileType>;

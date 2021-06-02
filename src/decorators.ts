import {
  nested,
  schemaIsDate,
  schemaIsArray,
  getValidatorBag,
  transformMessages,
} from "./utils";
import {
  Type as typeAnnotate,
  Transform as transformAnnotate,
} from "class-transformer";
import {
  Class,
  SchemaType,
  ValidateDecorator,
  NestedSchemaTypeFn,
} from "@ioc:Adonis/ClassValidator/Shared";
import { DateTime } from "luxon";
import { CustomMessages } from "@ioc:Adonis/Core/Validator";

/**
 * Validate a decorated field in a class.
 * @param schema Adonis validation schema for field.
 * @param messages Custom messages for field
 * @returns void
 */
export const validate: ValidateDecorator = (
  schema: SchemaType,
  messages?: CustomMessages
) => {
  return function (target: any, propertyKey: string) {
    const validatorBag = getValidatorBag(target);
    validatorBag.schema[propertyKey] = schema as any;

    validatorBag.messages = {
      ...validatorBag.messages,
      ...(messages ? transformMessages(propertyKey, messages) : {}),
    };

    if (schemaIsDate(schema)) {
      typeAnnotate(() => String)(target, propertyKey);
      transformAnnotate(({ value }) => DateTime.fromISO(value))(
        target,
        propertyKey
      );
    }
  };
};

/**
 * Validated a field with complex type using a custom validator class.
 * @param validatorClass Validator class to use for field.
 * @param schema Adonis validation schema
 * @param messages Custom messages for field.
 * @returns void
 */
validate.nested = <T>(
  validatorClass: Class<T>,
  schema: NestedSchemaTypeFn,
  messages?: CustomMessages
) => {
  return function (target: any, propertyKey: string) {
    const validatorBag = getValidatorBag(target);
    const validatorSchema = schema(nested(validatorClass));
    validatorBag.schema[propertyKey] = validatorSchema as any;

    const isArray = schemaIsArray(validatorSchema);
    const validatorClassMessages = getValidatorBag(validatorClass).messages;

    validatorBag.messages = {
      ...validatorBag.messages,
      // Messages added directly on field.
      ...(messages ? transformMessages(propertyKey, messages) : {}),
      // Messages added on nested field with reference to current field.
      ...transformMessages(propertyKey, validatorClassMessages, isArray),
    };

    // Initialize nested property for type casting to a class.
    typeAnnotate(() => validatorClass)(target, propertyKey);
  };
};

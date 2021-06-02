import {
  ClassValidatorBag,
  Class,
  SchemaType,
} from "@ioc:Adonis/ClassValidator/Shared";
import { TypedSchema, CustomMessages } from "@ioc:Adonis/Core/Validator";

/**
 * Get the typed schema of a nested validator class.
 * @param nestedClass Validator class
 * @returns Typed schema of validator class.
 */
export const nested = <T>(nestedClass: Class<T>): TypedSchema =>
  getValidatorBag(nestedClass).schema;

/**
 * Get the validation bag of a target.
 *
 * If none exists, target is initialized with an empty bag.
 * @param target Target
 * @returns Validation Schema.
 */
export const getValidatorBag = (target: any): ClassValidatorBag => {
  const prototype = target?.prototype || target;
  const metadataKey = `@${prototype.constructor.name}.classValidatorBag`;
  const metadata = Reflect.getMetadata(metadataKey, prototype);
  if (metadata) return metadata;

  const key = `${nonce()}.${prototype.constructor.name}`;
  const validatorBag: ClassValidatorBag = { key, schema: {}, messages: {} };
  Reflect.defineMetadata(metadataKey, validatorBag, prototype);
  return Reflect.getMetadata(metadataKey, prototype);
};

/**
 * Converts messages field name into a format compatible with Adonis.
 * @param fieldName Field name
 * @param messages Messages rules for the field specified
 * @returns Transformed messages
 */
export const transformMessages = (
  fieldName: string,
  messages: CustomMessages,
  isArray = false
) =>
  Object.entries(messages).reduce((prev, [key, value]) => {
    prev[`${fieldName}${isArray ? ".*." : "."}${key}`] = value;
    return prev;
  }, {});

/**
 * Check if a schema is an array schema.
 * @param schema Schema to check.
 * @returns If schema is an array.
 */
export const schemaIsArray = (schema: SchemaType) =>
  "getTree" in schema && (schema as any).getTree().type === "array";

/**
 * Generate a unique and ever increasing nonce of length 15.
 * @returns Unique number
 */
export const nonce = ((length: number = 15) => {
  let [last, repeat] = [Date.now(), 0];

  return () => {
    const now = Math.pow(10, 2) * +new Date();
    if (now === last) repeat++;
    else [last, repeat] = [now, 0];

    const s = (now + repeat).toString();
    return +s.substr(s.length - length);
  };
})();

/**
 * Append child validator bag to parent validator bag.
 * @param childBag Child validator bag.
 * @param parentBag Parent validator bag.
 * @returns Updated child validator bag.
 */
export const appendToChildValidatorBag = (
  childBag: ClassValidatorBag,
  parentBag: ClassValidatorBag
): ClassValidatorBag => {
  childBag.schema = {
    ...parentBag.schema,
    ...childBag.schema,
  };

  childBag.messages = {
    ...parentBag.messages,
    ...childBag.messages,
  };

  return childBag;
};

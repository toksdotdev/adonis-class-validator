declare module "@ioc:Adonis/ClassValidator/Shared" {
  import {
    ArrayType,
    BooleanType,
    CustomMessages,
    DateType,
    EnumSetType,
    EnumType,
    FileType,
    NumberType,
    ObjectType,
    SchemaArray,
    SchemaLiteral,
    SchemaObject,
    StringType,
    TypedSchema,
    ValidatorNode,
  } from "@ioc:Adonis/Core/Validator";

  /**
   * Class constructor.
   */
  export type Class<T> = new (...args: any) => T;

  /**
   * Nested schema function.
   */
  export type NestedSchemaTypeFn = (nested: TypedSchema) => SchemaType;

  /**
   * Decorator function.
   */
  export type DecoratorFn = (target: any, propertyKey: string) => void;

  /**
   * Class validator schema.
   */
  export type ClassValidatorBag = {
    messages: CustomMessages;
    schema: TypedSchema;
    key: string;
  };

  /**
   * Types that have members.
   */
  export type MemberType = {
    t?: { [x: string]: any } | undefined;
    getTree(): SchemaLiteral | SchemaArray | SchemaObject;
  };

  /**
   * Supported class validation base schemas (leverages default Adonis types).
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
    | ReturnType<FileType>
    | MemberType;

  /**
   * Append an optional field to the type.
   */
  type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  /**
   * Class validator argument
   */
  export type ClassValidatorArg = Omit<
    WithOptional<ValidatorNode<any>, "data">,
    "schema"
  >;

  /**
   * Validate decorator.
   */
  export type ValidateDecorator = ((
    schema: SchemaType,
    messages?: CustomMessages
  ) => DecoratorFn) & {
    nested: ValidateNestedDecorator<any>;
  };

  /**
   * Nested validate decorator.
   */
  export type ValidateNestedDecorator<T> = (
    nested: Class<T>,
    schema: NestedSchemaTypeFn,
    messages?: CustomMessages
  ) => DecoratorFn;
}

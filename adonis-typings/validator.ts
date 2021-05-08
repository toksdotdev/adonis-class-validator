declare module "@ioc:Adonis/ClassValidator" {
  import { ValidateDecorator } from "@ioc:Adonis/ClassValidator/Shared";
  import { validator, schema, rules } from "@ioc:Adonis/Core/Validator";

  const validate: ValidateDecorator;

  export { validate, schema, rules, validator };
}

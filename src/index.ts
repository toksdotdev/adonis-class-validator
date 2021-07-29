export { validate } from "./decorators";
export { getValidatorBag } from "./utils";
import { getValidatorBag } from "./utils";
import { plainToClass } from "class-transformer";
import { schema } from "@adonisjs/validator/build/src/Schema";
import { validator } from "@adonisjs/validator/build/src/Validator";
import { Class, ClassValidatorArg } from "@ioc:Adonis/ClassValidator/Shared";

export class ClassValidate {
  /**
   * Validate data using a class schema.
   * @param validatorClass Validator class.
   * @param data Data to validate.
   * @param args Validator config.
   * @returns Validated data.
   */
  public static async validate<T>(
    validatorClass: Class<T>,
    data: any,
    args?: Omit<ClassValidatorArg, "data">
  ): Promise<T> {
    const validatorBag = getValidatorBag(validatorClass);

    const validatedData = await validator.validate({
      schema: schema.create(validatorBag.schema),
      cacheKey: validatorBag.key,
      data,
      ...args,
    });

    return plainToClass(validatorClass, validatedData);
  }
}

import { schema } from "@ioc:Adonis/Core/Validator";
import { ApplicationContract } from "@ioc:Adonis/Core/Application";
import { RequestConstructorContract } from "@ioc:Adonis/Core/Request";
import { Class, ClassValidatorArg } from "@ioc:Adonis/ClassValidator/Shared";

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = (await import('@ioc:Adonis/Lucid/Database')).default
|   const Event = (await import('@ioc:Adonis/Core/Event')).default
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class ClassValidatorProvider {
  public static needsApplication = true;
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    this.bindClassValidator();
    this.registerRequestMacro();
  }

  /**
   * Bind the class validator to the IOC.
   */
  private bindClassValidator() {
    this.app.container.singleton("Adonis/ClassValidator", () => {
      return {
        validate: require("../src").validate,
      };
    });
  }

  /**
   * Register the `classValidate(...)` macros to the Request instance.
   */
  private registerRequestMacro() {
    this.app.container.with(
      ["Adonis/Core/Request"],
      (request: RequestConstructorContract) => {
        const { getValidatorBag } = require("../src");

        request.macro("classValidate", async function classValidate<
          T
        >(this: any, validatorClass: Class<T>, args?: ClassValidatorArg): Promise<T> {
          const validatorBag = getValidatorBag(validatorClass);
          const data = await this.validate({
            schema: schema.create(validatorBag.schema),
            cacheKey: validatorBag.key,
            ...args,
          });

          return data as T;
        });
      }
    );
  }
}

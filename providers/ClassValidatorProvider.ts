import { schema } from "@ioc:Adonis/Core/Validator";
import { ApplicationContract } from "@ioc:Adonis/Core/Application";
import { Class, ClassValidatorArg } from "../contracts/common";
import { RequestConstructorContract } from "@ioc:Adonis/Core/Request";

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
    this.app.container.with(
      ["Adonis/Core/Request"],
      async (request: RequestConstructorContract) => {
        const { getValidatorSchema } = await import("../src/index");

        request.macro("classValidate", async function classValidate<
          T
        >(this: any, validatorClass: Class<T>, args?: ClassValidatorArg): Promise<T> {
          const schemaTemplate = getValidatorSchema(validatorClass);
          const data = await this.validate({
            schema: schema.create(schemaTemplate.schema),
            cacheKey: schemaTemplate.key,
            ...args,
          });

          return data as T;
        });
      }
    );
  }
}

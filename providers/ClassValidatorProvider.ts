import { ApplicationContract } from "@ioc:Adonis/Core/Application";
import { RequestContract } from "@ioc:Adonis/Core/Request";

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

  public register() {
    this.app.container.singleton("Logistics/Postmates", (app) => {});
  }

  public async boot() {
    // All bindings are ready, feel free to use them
    this.app.container.bind(
      "Adonis/Core/Request",
      (container: RequestContract) => {
        container.
      }
    );
    // require("../src/Bindings/Request").default(
    //   Request,
    //   validator.validate,
    //   validator.config
    // );
    // });
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}

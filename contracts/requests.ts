import { ClassValidatorArg, Constructor } from "./common";

declare module "@ioc:Adonis/Core/Request" {
  interface RequestContract {
    /**
     * Validate current request using a class . The data is optional here, since request
     * can pre-fill it for us
     */
    classValidate<T>(
      validatorClass: Constructor<T>,
      args?: ClassValidatorArg
    ): Promise<T>;
  }
}

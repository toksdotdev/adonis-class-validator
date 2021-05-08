import { ClassValidatorArg, Class } from "./common";

declare module "@ioc:Adonis/Core/Request" {
  interface RequestContract {
    /**
     * Validate current request using a schema class. The data is
     * optional here, since request can pre-fill it for us.
     *
     * @param validatorClass Class to use foe validation.
     * @param args Custom config.
     */
    classValidate<T>(
      validatorClass: Class<T>,
      args?: ClassValidatorArg
    ): Promise<T>;
  }
}

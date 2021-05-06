import { ValidatorNode } from "@ioc:Adonis/Core/Validator";

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Class validator argument
 */
export type ClassValidatorArg = Omit<
  WithOptional<ValidatorNode<any>, "data">,
  "schema"
>;

/**
 * Class constructor.
 */
export type Constructor<T> = new (...args: any) => T;

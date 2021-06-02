import { validate } from "../../src";
import { rules } from "@adonisjs/validator/build/src/Rules";
import { schema } from "@adonisjs/validator/build/src/Schema";

export class NoSchema {
  public name!: String;
}

class AddressPoint {
  @validate(schema.string({}, [rules.required()]))
  public uniqueId!: String;
}

export class BaseClass {
  @validate(schema.number())
  public id!: number;

  @validate(schema.string())
  public firstName!: string;

  @validate(schema.string())
  public lastName!: string;
}

export class ChildA extends BaseClass {
  @validate(schema.string(), { hello: "required" })
  public alias!: string;
}

export class ChildB extends BaseClass {
  @validate(schema.string())
  public status!: string;
}

export class ChildC extends BaseClass {
  @validate(schema.string())
  public signature!: string;
}

class Address {
  @validate(
    schema.string({ escape: true }, [rules.required(), rules.minLength(10)])
  )
  public street!: String;

  @validate(schema.enum(["nigeria", "france", "canada"], [rules.required()]))
  public country: String | undefined;

  @validate(schema.number([rules.required()]))
  public zipcode!: String;

  @validate.nested(
    AddressPoint,
    (addressPoint) => schema.object([rules.required()]).members(addressPoint),
    { required: "Field is required." }
  )
  public point!: AddressPoint;
}

export class User {
  @validate(schema.string())
  public username!: string;

  @validate(schema.string({}, [rules.url()]), { url: "Invalid URL specified." })
  public profile!: string;

  @validate.nested(
    Address,
    (address) =>
      schema
        .array([rules.minLength(2)])
        .members(schema.object().members(address)),
    { minLength: "Length must be at least 2." }
  )
  public addresses!: Address[];

  @validate(schema.date({ format: "yyyy-MM-dd HH:mm:ss" }))
  public date!: Date[];
}

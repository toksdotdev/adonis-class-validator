import { validate } from "../../src";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

export class NoSchema {
  public name!: String;
}

class AddressPoint {
  @validate(schema.string({}, [rules.required()]))
  public uniqueId!: String;
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

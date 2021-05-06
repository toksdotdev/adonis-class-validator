import test from "japa";
import { Assert } from "japa/build/src/Assert";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { getTargetValidatorSchema, nested, rule } from "../src";

test.group("Nested Class Validation", () => {
  test("doesn't validate on empty schema", (assert: Assert) => {
    class User {
      public name!: String;
    }

    assert.deepEqual(
      schema.create(getTargetValidatorSchema(User).meta),
      schema.create({})
    );
  });

  test("validation rules are correct for nested class rules", (assert: Assert) => {
    class AddressPoint {
      @rule(schema.string({}, [rules.required()]))
      public uniqueId!: String;
    }

    class Address {
      @rule(
        schema.string({ escape: true }, [rules.required(), rules.minLength(10)])
      )
      public street!: String;

      @rule(schema.enum(["nigeria", "france", "canada"], [rules.required()]))
      public country: String | undefined;

      @rule(schema.number([rules.required()]))
      public zipcode!: String;

      @rule(schema.object([rules.required()]).members(nested(AddressPoint)))
      public point!: AddressPoint;
    }

    class User {
      @rule(schema.string())
      public username!: string;

      @rule(
        schema
          .array([rules.minLength(2)])
          .members(schema.object().members(nested(Address)))
      )
      public addresses!: Address[];

      @rule(schema.date({ format: "yyyy-MM-dd HH:mm:ss" }))
      public date!: Date[];
    }

    assert.deepEqual(
      schema.create(getTargetValidatorSchema(User).meta),
      schema.create({
        username: schema.string(),
        addresses: schema.array([rules.minLength(2)]).members(
          schema.object().members({
            street: schema.string({ escape: true }, [
              rules.required(),
              rules.minLength(10),
            ]),
            country: schema.enum(
              ["nigeria", "france", "canada"],
              [rules.required()]
            ),
            zipcode: schema.number([rules.required()]),
            point: schema.object([rules.required()]).members({
              uniqueId: schema.string({}, [rules.required()]),
            }),
          })
        ),
        date: schema.date({ format: "yyyy-MM-dd HH:mm:ss" }),
      })
    );
  });
});

import test from "japa";
import { Assert } from "japa/build/src/Assert";
import { User, NoSchema } from "./cases/classes";
import { getValidatorBag } from "../src/utils";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

test.group("Class Validation", () => {
  test("doesn't validate on empty schema", (assert: Assert) => {
    console.log({} instanceof NoSchema);
    assert.deepEqual(
      schema.create(getValidatorBag(NoSchema).schema),
      schema.create({})
    );
  });

  test("validation rules are correct for nested class rules", (assert: Assert) => {
    assert.deepEqual(
      schema.create(getValidatorBag(User).schema),
      schema.create({
        username: schema.string(),
        profile: schema.string({}, [rules.url()]),
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

import test from "japa";
import { Assert } from "japa/build/src/Assert";
import { getValidatorBag } from "../src/utils";
import { rules } from "@adonisjs/validator/build/src/Rules";
import { schema } from "@adonisjs/validator/build/src/Schema";
import {
  User,
  NoSchema,
  ChildA,
  ChildB,
  ChildC,
  ParentClass,
  GrandParentClass,
} from "./cases/classes";

test.group("Class Validation", () => {
  test("doesn't validate on empty schema", (assert: Assert) => {
    assert.deepEqual(
      schema.create(getValidatorBag(NoSchema).schema),
      schema.create({})
    );
  });

  test("validation rules are correct for inherited classes", (assert: Assert) => {
    const grandParentRules = {
      totalSiblings: schema.number(),
    };

    const parentRules = {
      ...grandParentRules,
      id: schema.number(),
      firstName: schema.string(),
      lastName: schema.string(),
    };

    assert.deepEqual(
      schema.create(getValidatorBag(GrandParentClass).schema),
      schema.create(grandParentRules)
    );

    assert.deepEqual(
      schema.create(getValidatorBag(ParentClass).schema),
      schema.create(parentRules)
    );

    assert.deepEqual(
      schema.create(getValidatorBag(ChildA).schema),
      schema.create({
        ...parentRules,
        alias: schema.string(),
      })
    );

    assert.deepEqual(
      schema.create(getValidatorBag(ChildB).schema),
      schema.create({
        ...parentRules,
        status: schema.string(),
      })
    );

    assert.deepEqual(
      schema.create(getValidatorBag(ChildC).schema),
      schema.create({
        ...parentRules,
        signature: schema.string(),
      })
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
            optionalPoint: schema.object.optional().members({
              uniqueId: schema.string({}, [rules.required()]),
            }),
          })
        ),
        date: schema.date({ format: "yyyy-MM-dd HH:mm:ss" }),
      })
    );
  });
});

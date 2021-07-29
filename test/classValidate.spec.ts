import test from "japa";
import { DateTime } from "luxon";
import { ClassValidator } from "../src";
import { validate } from "../src/decorators";
import { Assert } from "japa/build/src/Assert";
import { AddressPoint, NoSchema } from "./cases/classes";
import { schema } from "@adonisjs/validator/build/src/Schema";
import { ValidationException } from "@adonisjs/validator/build/src/ValidationException";

test.group("ClassValidator", () => {
  test("ClassValidator.validate(...) formats and transforms correctly", async (assert: Assert) => {
    const dob = "2001-02-12";
    const format = "yyyy-MM-dd";

    class DateSchema {
      @validate(schema.date({ format }))
      public dob!: DateTime;
    }

    const actual = await ClassValidator.validate(DateSchema, { dob });
    assert.deepEqual(actual, { dob: DateTime.fromFormat(dob, format) });
  });

  test("ClassValidator.validate(...) validates correctly", async (assert: Assert) => {
    const expected: AddressPoint = { uniqueId: "hello world" };
    const actual = await ClassValidator.validate(AddressPoint, expected);
    assert.deepEqual(actual, expected);
  });

  test("ClassValidator.validate(...) fails on invalid input validation", async (assert: Assert) => {
    assert.plan(1);

    try {
      const expected = { uniqueId: 2 };
      await ClassValidator.validate(AddressPoint, expected);
    } catch (err) {
      assert.instanceOf(err, ValidationException);
    }
  });

  test("ClassValidator.validate(...) fails on empty input validation", async (assert: Assert) => {
    assert.plan(1);

    try {
      await ClassValidator.validate(AddressPoint, {});
    } catch (err) {
      assert.instanceOf(err, ValidationException);
    }
  });

  test("ClassValidator.validate(...) succeeds with empty validation schema", async (assert: Assert) => {
    const actual = await ClassValidator.validate(NoSchema, { hello: "hi" });
    assert.deepEqual(actual as any, {});
  });
});

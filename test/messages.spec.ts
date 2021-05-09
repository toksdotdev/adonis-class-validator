import test from "japa";
import { Assert } from "japa/build/src/Assert";
import { User, NoSchema } from "./cases/classes";
import { getValidatorBag } from "../src/utils";

test.group("Validation Message", () => {
  test("doesn't get message on empty schema", (assert: Assert) => {
    assert.deepEqual(getValidatorBag(NoSchema).messages, {});
  });

  test("validation messages are generated accurately for nested class messages", (assert: Assert) => {
    assert.deepEqual(getValidatorBag(User).messages, {
      "profile.url": "Invalid URL specified.",
      "addresses.*.point.required": "Field is required.",
      "addresses.minLength": "Length must be at least 2.",
    });
  });
});

import test from "japa";
import { DateTime } from "luxon";
import { validate } from "../src/decorators";
import { Assert } from "japa/build/src/Assert";
import { getValidatorBag } from "../src/utils";
import { plainToClass } from "class-transformer";
import { schema } from "@adonisjs/validator/build/src/Schema";
import { validator } from "@adonisjs/validator/build/src/Validator/index";

test.group("Class Validation and Transform", () => {
  test("Date field is formatted and transformed correctly", async (assert: Assert) => {
    const dob = "2001-02-12";
    const format = "yyyy-MM-dd";

    class DateSchema {
      @validate(schema.date({ format }))
      public dob!: DateTime;
    }

    const validatorBag = getValidatorBag(DateSchema);
    const data = await validator.validate({
      schema: schema.create(validatorBag.schema),
      cacheKey: validatorBag.key,
      data: { dob },
    });

    const classData = plainToClass(DateSchema, data);
    assert.deepEqual(classData.dob, DateTime.fromFormat(dob, format));
  });
});

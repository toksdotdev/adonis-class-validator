import "reflect-metadata";
import { configure } from "japa";

/**
 * Configure test runner
 */
configure({
  files: ["test/**/*.spec.ts"],
});

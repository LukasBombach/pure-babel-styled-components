const { resolve } = require("path");
const { transformAsync } = require("@babel/core");

async function transformCode(code: string) {
  return await transformAsync(code, {
    cwd: resolve(__dirname),
    filename: "code.js",
    plugins: ["babel-plugin-macros"],
  });
}

describe("test test", () => {
  const code = `import styled from "./styled.macro.js"; styled();`;

  test("it calls console.log", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    const result = await transformCode(code);
    expect(result.code).toBe("styled();");
    expect(spy).toHaveBeenCalled();
  });
});

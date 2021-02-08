const { resolve } = require("path");
const { transformAsync } = require("@babel/core");

async function transformCode(code: string) {
  return await transformAsync(code, {
    cwd: resolve(__dirname),
    filename: "code.js",
    plugins: ["babel-plugin-macros"],
  });
}
const code = `
import styled from "./styled.macro.js";

const MyComponent = styled.div(\`
  background-color: #f00;
\`);`;

const transformedCode = `
const MyComponent = ({
  children,
  ...props
}) => React.createElement('div', props, children);
`.trim();

describe("styled macro", () => {
  test("styled call is replaced with react component", async () => {
    const result = await transformCode(code);
    expect(result.code).toBe(transformedCode);
  });
});

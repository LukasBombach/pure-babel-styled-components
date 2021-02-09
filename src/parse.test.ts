function validate(css: string): void {}

function getDeclarations(css: string): string[] {
  return css
    .split(";")
    .map(declaration => declaration.trim())
    .filter(declaration => declaration !== "");
}

interface DeclarationFixture {
  css: string;
  expected: string[];
}
describe("validator", () => {
  test.each`
    case                       | css
    ${"an empty string"}       | ${""}
    ${"a single declaration"}  | ${"color: red;"}
    ${"multiple declarations"} | ${"color: red; display: block;"}
  `("accepts $case", () => {});

  test.each`
    case                                                  | css
    ${"a single declaration missing a semicolon"}         | ${"color: red"}
    ${"a missing a semicolon inbetween declarations"}     | ${"color: red display: block;"}
    ${"a missing a semicolon at the end of declarations"} | ${"color: red; display: block"}
    ${"a single declaration missing a colon"}             | ${"color red;"}
    ${"a missing a colon in one of the declarations"}     | ${"color red; display: block;"}
    ${"too many colons in a single declaration"}          | ${"color: :red;"}
    ${"too many colons in one of the declarations"}       | ${"color: :red; display: block;"}
  `("rejects $case", () => {});
});

describe("parser", () => {
  test.each`
    desc                       | css                              | expected
    ${"an empty string"}       | ${""}                            | ${[]}
    ${"a single declaration"}  | ${"color: red;"}                 | ${["color: red"]}
    ${"multiple declarations"} | ${"color: red; display: block;"} | ${["color: red", "display: block"]}
  `(
    "it singles out declarations for $desc",
    ({ css, expected }: DeclarationFixture) => {
      const declarations = getDeclarations(css);
      expect(declarations).toEqual(expected);
    }
  );
});

import { createMacro } from "babel-plugin-macros";
import { parse } from "@babel/parser";

import { StyledBackend } from "./backend";

const backend = new StyledBackend();

export default createMacro(({ references, babel }) => {
  const { types: t } = babel;

  references.default.forEach(reference => {
    const call = reference.parentPath.parentPath;
    if (call.type === "CallExpression") {
      const tag = reference.parentPath.get("property").get("name").node;
      const css = call.get("arguments")[0].get("quasis")[0].node.value.raw;
      const classNames = backend.getClassNames(css);
      const replacement = getCreateElementAst(tag, classNames);
      call.replaceWith(replacement);
    }
  });
});

function getCreateElementAst(tag, classNames) {
  const className = classNames.join(" ");
  const result = parse(
    `({children}) => React.createElement('${tag}', {className: '${className}'}, children);`
  );
  return result.program.body[0];
}

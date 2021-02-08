import { createMacro } from "babel-plugin-macros";
import { parse } from "@babel/parser";

export default createMacro(({ references, babel }) => {
  const { types: t } = babel;

  references.default.forEach(reference => {
    if (reference.parentPath.parentPath.type === "CallExpression") {
      const tag = reference.parentPath.get("property").get("name").node;
      const replacement = getCreateElementAst(tag);
      // debugger;
      reference.parentPath.parentPath.replaceWith(replacement);
    }
  });
});

function getCreateElementAst(tag) {
  const result = parse(
    `({children, ...props}) => React.createElement('${tag}', props, children);`
  );
  return result.program.body[0];
}

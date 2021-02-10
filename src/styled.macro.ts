import { createMacro } from "babel-plugin-macros";
import { parse } from "@babel/parser";
import template from "@babel/template";

import { StyledBackend } from "./backend";

const backend = new StyledBackend();

const buildCreateElement = template(`
({children}) => React.createElement('TAG', {className: 'CLASSNAME'}, children);
`);

export default createMacro(({ references, babel }) => {
  references.default.forEach(reference => {
    const call = reference.parentPath.parentPath;
    if (call.type === "CallExpression") {
      const tag = reference.parentPath.get("property").get("name").node;
      const css = call.get("arguments")[0].get("quasis")[0].node.value.raw;
      const className = backend.getClassNames(css).join(" ");
      const replacement = buildCreateElement(tag, className);
      call.replaceWith(replacement);
    }
  });
});

/* function getCreateElementAst(tag: string, classNames: string[]) {
  const className = classNames.join(" ");
  const result = parse(
    `({children}) => React.createElement('${tag}', {className: '${className}'}, children);`
  );
  return result.program.body[0];
}
 */

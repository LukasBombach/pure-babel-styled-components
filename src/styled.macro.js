import { createMacro } from "babel-plugin-macros";

function myMacro({ references }) {
  // state is the second argument you're passed to a visitor in a
  // normal babel plugin. `babel` is the `babel-plugin-macros` module.
  // do whatever you like to the AST paths you find in `references`
  // read more below...
  console.log(references);
}

// `createMacro` is simply a function that ensures your macro is only
// called in the context of a babel transpilation and will throw an
// error with a helpful message if someone does not have babel-plugin-macros
// configured correctly
export default createMacro(myMacro);

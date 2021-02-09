import postcss from "postcss";

export class StyledBackend {
  nextId = -1;
  values = {};

  getClassNames(css) {
    const { root } = postcss([]).process(css);
    return root.nodes.map(declaration => {
      const { prop, value } = declaration;
      const key = `${prop}:${value}`;
      if (key in this.values) {
        return this.values[key].className;
      }
      const className = `s${++this.nextId}`;
      this.values[key] = { className, prop, value };
      return className;
    });
  }
}

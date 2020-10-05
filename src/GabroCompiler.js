function Compile(input, config) {
  //console.log(input);
  let result = "";
  for (let component of input) {
    result += ConvertToJsx(component, config);
    result += "\n";
  }
  return WrapWithBase(result, config);
}

function ConvertToJsx(component, config) {
  if (component.name == "Text") {
    if (component.props[0] == undefined) return "";
    if (component.props[0].val == undefined) return "";
    return component.props[0].val;
  }
  let syntax = CreateSyntax(component, config);

  if (component.children == null) {
    syntax = syntax.replace("{children}", "");
  } else {
    let result = "";
    for (let children of component.children) {

      result += ConvertToJsx(children, config);
      result += "\n";
    }
    syntax = syntax.replace("{children}", result);
  }

  let props = "";
  for (let prop of component.props) {
    if (prop.val == "") continue;
    let name = prop.name.replace("?", "")
    props += " " + name + '="' + prop.val + '" ';
  }
  syntax = syntax.replace("{atr}", props);

  return syntax;
}

function CreateSyntax(component, config) {
  let has_children = false;
  for (let prop of config.components[component.name].props) {
    if (prop.name == "children?") {
      has_children = true;
    }
  }
  if (!has_children) {
    return "<" + component.name + "{atr} />"
  } else {
    return "<" + component.name + "{atr} >{children} </" + component.name + ">"
  }
}

function WrapWithBase(data, config) {
  let imports = "";
  for (let component of Object.keys(config.components)) {
    if (component != "Text") {
      imports += component + ",";
    }
  }
  return "import React from 'react'\n \
    import './App.scss';\n \
    import {" +
    imports +
    "} from '@janskvaril/gabro-framework'\n \
    function App() {\n \
      return (\n \
        <div>\n " +
    data +
    " </div> \n \
      );\n \
    }\n \
    export default App;"
}

exports.Compile = Compile;
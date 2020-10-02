function Compile(input, config) {
  console.log(input);
  let result = "";
  for (let component of input) {
    result += ConvertToJsx(component, config);
    result += "\n";
  }
  return WrapWithBase(result);
}

function ConvertToJsx(component, config) {
  let syntax = CreateSyntax(component, config);
  syntax = syntax.replace("{children}", "Test");

  let props = "";
  for (let prop of component.props) {
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
  }
  else {
    return "<" + component.name + "{atr} >{children} </" + component.name + ">"
  }
}

function WrapWithBase(data) {
  return "import React from 'react'\n \
    import './App.scss';\n \
    import {Section, Card \n \
      //Here write components you want to use\n \
      //e.g. Section, LandingPage, Full, Half\n \
    } from '@janskvaril/gabro-framework'\n \
    function App() {\n \
      return (\n \
        <div>\n "
    + data +
    " </div> \n \
      );\n \
    }\n \
    export default App;"
}

exports.Compile = Compile;
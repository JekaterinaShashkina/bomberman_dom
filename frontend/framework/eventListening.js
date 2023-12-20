import * as check from "./helper.js";

export function createListener(element, type, func) {
    check.isText(type)
    check.isFunc(func)
    check.isElement(element)

    if (!element.functions) {
        element.functions = {};
    }

    if (!element.functions[type]) {
        element.functions[type] = [];
    }

    element.functions[type].push(func);

    const runFuncs = function (type, event) {
        element.functions[type]?.forEach((funcElem) => {
            funcElem(event);
        });
    };

    element.onclick = (event) => { runFuncs("click", event) };
    element.onmouseover = (event) => { runFuncs("mouseover", event) };
    element.onpopstate = (event) => { runFuncs("popstate", event) };
    element.onchange = (event) => { runFuncs("change", event) };
    element.oninput = (event) => { runFuncs("input", event) };
    element.onkeypress = (event) => { runFuncs("keypress", event) };
    element.ondblclick = (event) => { runFuncs("dblclick", event) };
}

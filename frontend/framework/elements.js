import { createListener } from "./eventListening.js";
import * as check from "./helper.js";

function createElement(type, attrs, children) {
    check.isObject(attrs)

    const element = document.createElement(type);

    for (const key in attrs) {
        element.setAttribute(key, attrs[key]);
    }

    children.forEach((elem) => {
        if (elem instanceof Element) {
            element.appendChild(elem);
        } else if (typeof elem === "string") {
            element.innerHTML = element.innerHTML + elem;
        } else {
            throw new Error("Invalid input type in element: " + element +
                "\nInput should be string or element not " + typeof elem
                + " " + elem)
        }
    });

    element.addBinding = function (binding) {
        binding.addElement(
            element
        )
        return element
    }

    element.addOutput = function (binding) {
        binding.addOutput(
            element
        )
        return element
    }

    element.bindElement = function (binding) {
        binding.bindElement(
            element
        )
        return element
    }

    element.click = (func) => {
        createListener(element, 'click', func)
        return element
    }

    element.keypress = (func) => {
        createListener(element, 'keypress', func)
        return element
    }

    element.mouseover = (func) => {
        createListener(element, 'mouseover', func)
        return element
    }

    element.popstate = (func) => {
        createListener(element, 'popstate', func)
        return element
    }

    element.change = (func) => {
        createListener(element, 'change', func)
        return element
    }

    element.input = (func) => {
        createListener(element, 'input', func)
        return element
    }

    element.dblclick = (func) => {
        createListener(element, 'dblclick', func)
        return element
    }

    return element;
}

export function createA(attrs, ...children) {
    return createElement("a", attrs, children);
}

export function createH1(attrs, ...children) {
    return createElement("h1", attrs, children);
}

export function createDiv(attrs, ...children) {
    return createElement("div", attrs, children);
}

export function createInput(attrs, ...children) {
    return createElement("input", attrs, children);
}

export function createButton(attrs, ...children) {
    return createElement("button", attrs, children);
}

export function createSection(attrs, ...children) {
    return createElement("section", attrs, children);
}

export function createHeader(attrs, ...children) {
    return createElement("header", attrs, children);
}

export function createFooter(attrs, ...children) {
    return createElement("footer", attrs, children);
}

export function createLabel(attrs, ...children) {
    return createElement("label", attrs, children);
}

export function createUl(attrs, ...children) {
    return createElement("ul", attrs, children);
}

export function createSpan(attrs, ...children) {
    return createElement("span", attrs, children);
}

export function createLi(attrs, ...children) {
    return createElement("li", attrs, children);
}

export function createP(attrs, ...children) {
    return createElement("p", attrs, children);
}

export function createBr(attrs, ...children) {
    return createElement("br", attrs, children);
}

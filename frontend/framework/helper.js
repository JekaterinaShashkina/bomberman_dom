export function isRouteValid(route) {
    if (typeof route !== 'string') {
        throw new Error("Invalid route. Route is not a string: " + route)
    }
    if (route[0] !== '/') {
        throw new Error("Invalid route. Route does not start with '/': " + route)
    }
}

export function isFunc(func) {
    if (typeof func !== 'function') {
        throw new Error("Invalid input type. Function is: " + typeof func)
    }
}

export function isText(text) {
    if (typeof text !== 'string') {
        throw new Error("Invalid input type. Text is: " + typeof text)
    }
}

export function isObject(obj) {
    if (obj) {
        if (typeof obj !== 'object') {
            throw new Error("Invalid input type. Object is: " + typeof obj)
        }
    }
}

export function isElement(element) {
    if (!(element instanceof HTMLElement) && element !== window) {
        throw new Error('Invalid input type: ' + element)
    }
}

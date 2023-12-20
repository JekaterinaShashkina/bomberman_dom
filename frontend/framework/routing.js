import { createA } from "./elements.js";
import { createListener } from "./eventListening.js";
import * as check from "./helper.js";

export function createRouter() {
    const routes = {};
    createListener(window, "popstate", () => {
        const route = window.location.pathname;
        if (routes[route]) {
            routes[route]();
        }
    });
    return {
        addRoute: function (route, func) {
            check.isRouteValid(route)
            check.isFunc(func)

            routes[route] = func;
        },
        createRouterLink(route, text, attrs) {
            check.isRouteValid(route)
            check.isText(text)
            check.isObject(attrs)

            attrs = attrs ?? {}
            const a = createA(attrs, text);
            a.onclick = (event) => {
                if (window.location.pathname !== route) {
                    window.history.pushState({}, "", route);
                }
                routes[route](event);
            };
            return a;
        },
    };
}

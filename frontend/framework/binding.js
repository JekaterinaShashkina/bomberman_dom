import * as check from "./helper.js";

export function binding(func) {
    check.isFunc(func)

    this.element = null
    this.elements = []
    this.outputElements = []
    this.func = func
    this.funcs = []

    binding.prototype.bindFunctionNewElement = function (element) {
        if (this.outputElements.length != 0) {
            this.outputElements.forEach(outputElem => {
                this.addFunc(element, outputElem)
            })
        }
    };

    binding.prototype.bindFunctionNewOutput = function (outputElem) {
        if (this.elements.length != 0) {
            this.elements.forEach(element => {
                this.addFunc(element, outputElem)
            })
        }
    };

    binding.prototype.addFunc = function (element, outputElem) {
        this.func(element, outputElem)
        this.funcs.push(() => this.func(element, outputElem))
    }

    binding.prototype.checkIsValidBinding = function () {
        if (this.element != null && (this.elements.length != 0 || this.outputElements.length != 0)) {
            throw new Error("Creating invalid binding. Cannot create single element and multi element binding at the same time")
        }
    }

}

binding.prototype.addElement = function (element) {
    check.isElement(element)

    this.elements.push(element)
    this.checkIsValidBinding()

    this.bindFunctionNewElement(element)
};

binding.prototype.addOutput = function (element) {
    check.isElement(element)

    this.outputElements.push(element)
    this.checkIsValidBinding()

    this.bindFunctionNewOutput(element)
};

binding.prototype.bindElement = function (element) {
    this.element = element
    check.isElement(element)
    this.checkIsValidBinding()

    this.funcs.push(() => this.func(this.element))
};

binding.prototype.runFuncs = function () {
    this.funcs.forEach(func => {
        func()
    })
}

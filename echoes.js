"use strict";
var PREFIX = "ECHOES";
var DEBUG = false;
var EVENTS = {};

var SCROLL_EVENT = null;
var SCROLL_VALUE = [0, 0];

//  -----------  LOG SECTION  -----------

class ELog {
    log(message) {
        if(DEBUG)
            console.log(PREFIX + ": " + message)
    }

    warn(message) {
        if(DEBUG)
            console.warn(PREFIX + ": " + message)
    }

    error(message) {
        if(DEBUG)
            console.error(PREFIX + ": " + message)
    }
}

const ELogger = new ELog();

//  -----------  FUNCTIONS  -----------

export function setDebug(state) {
    if(typeof state !== 'boolean') {
        console.error('The state must be a boolean');
        return;
    } else {
        DEBUG = state;
    }
}

export function addEvent(eventName, eventType) {
    if (typeof eventName !== 'string') {
        ELogger.error("Invalid event name");
        return;
    }

    if (eventType === undefined) {
        console.error("Invalid event type");
        return;
    }

    if (EVENTS[eventName]) {
        ELogger.error("The event \"" + eventName + "\" already exists");
    } else {
        ELogger.log("The event \"" + eventName + "\" has been created");
        EVENTS[eventName] = eventType;
    }
}

export function checkEvent(eventName) {
    if(!EVENTS[eventName]) {
        ELogger.error("The event \"" + eventName + "\" doesn't exist");
    } else {
        return EVENTS[eventName].check();
    }
}

export function getEvent(eventName) {
    if(!EVENTS[eventName]) {
        ELogger.error("The event \"" + eventName + "\" doesn't exist");
    } else {
        return EVENTS[eventName];
    }
}

export function addClass(element, className) {
    if(document.body.contains(element)) {
        return element.classList.add(className);
    }

    ELogger.error("There is no element " +  element);
}

export function hasClass(element, className) {
    if(document.body.contains(element)) {
        return element.classList.contains(className);
    }

    ELogger.error("There is no element " +  element);
}

export function removeClass(element, className) {
    if(document.body.contains(element)) {
        return element.classList.remove(className);
    }

    ELogger.error("There is no element " +  element);
}


//  ----------- EVENT SECTION -----------

export class EventHandler {

    constructor() {
        ELogger.log('is now operative');
    }

    onStart(start_function) {
        if(typeof(start_function) === 'function') {
            document.addEventListener("DOMContentLoaded", function() {
                start_function();
            });
        } else {
            ELogger.error('The argument of "onStart" is not a function');
        }
    }

    onAwake(awake_function) {
        if(typeof(awake_function) === 'function') {
            awake_function();
        } else {
            ELogger.error('The argument of "onAwake" is not a function');
        }
    }

    onUpdate(update_function, fps = 60) {
        if (typeof(update_function) === 'function') {
            let lastTime = 0;
            const interval = 1000 / fps;
    
            function loop(currentTime) {
                if (currentTime - lastTime >= interval) {
                    update_function();
                    lastTime = currentTime;
                }
                requestAnimationFrame(loop);
            }
    
            requestAnimationFrame(loop);
        } else {
            ELogger.error('The argument of "onUpdate" is not a function');
        }
    }
}

class EventBehaviour {
    check() {
        throw new Error("Method 'check()' must be implemented.");
    }
}

//  -----------  EVENTS  -----------


export class OnHover extends EventBehaviour {
    
    #element = null;

    constructor(DOMElement) {
        super();
        if(document.body.contains(DOMElement)) {
            this.#element = DOMElement;
        }
    }

    check() {
        return this.#element.matches(":hover");
    }
}

export class OnClick extends EventBehaviour {
    
    #clicked = null;

    constructor(DOMElement) {
        super();
        if(document.body.contains(DOMElement)) {
            DOMElement.addEventListener('click', () => {
                this.#clicked = true;
            });
        }
    }

    check() {
        if(!this.#clicked)
            return false;
        this.#clicked = false;
        return true;
    }
}

export class OnBackgroundColorChange extends EventBehaviour {

    #element = null;
    #previousColor = null;

    constructor(DOMElement) {
        super();
        this.#element = document.body.contains(DOMElement) ? DOMElement : null;
        this.#previousColor = this.#element ? this.#element.style.backgroundColor : null;
    }

    check() {
        if (this.element) {
            const currentColor = this.element.style.backgroundColor;
            if (currentColor !== this.#previousColor) {
                this.#previousColor = currentColor;
                return true;
            }
        }
        return false;
    }
}

export class OnBackgroundColor extends EventBehaviour {

    #element = null;
    #checkedColor = null;

    constructor(DOMElement, colorValue) {
        super();
        this.#element = document.body.contains(DOMElement) ? DOMElement : null;
        this.#checkedColor = colorValue;
    }

    check() {
        if (this.element) {
            return this.#element.style.backgroundColor === this.#checkedColor;
        }
        return false;
    }
}

export class OnTextColorChanged extends EventBehaviour {

    #element = null;
    #previousColor = null;

    constructor(DOMElement) {
        super();
        this.#element = document.body.contains(DOMElement) ? DOMElement : null;
        this.#previousColor = this.#element ? this.#element.style.color : null;
    }

    check() {
        if (this.element) {
            const currentColor = this.element.style.color;
            if (currentColor !== this.#previousColor) {
                this.#previousColor = currentColor;
                return true;
            }
        }
        return false;
    }
}

export class OnTextColor extends EventBehaviour {

    #element = null;
    #checkedColor = null;

    constructor(DOMElement, colorValue) {
        super();
        this.#element = document.body.contains(DOMElement) ? DOMElement : null;
        this.#checkedColor = colorValue;
    }

    check() {
        if (this.element) {
            return this.#element.style.color === this.#checkedColor;
        }
        return false;
    }
}

export class MousePos extends EventBehaviour {
    #lastPos = [];
    #currentPos = [];

    constructor() {
        super();
        this.currentPos = [-1, -1];
        document.body.addEventListener("mousemove", (e) => {
            this.#currentPos = [e.clientX, e.clientY];
        });
    }

    check() {
        return this.getPos();
    }

    changed() {
        if (this.#currentPos[0] === this.#lastPos[0] && this.#currentPos[1] === this.#lastPos[1]) return false;

        this.#lastPos = this.#currentPos;
        return this.#currentPos;
    }

    getX() {
        return this.#currentPos[0];
    }

    getY() {
        return this.#currentPos[1];
    }

    getPos() {
        return this.#currentPos;
    }
}

function addScrollEvent() {
    if (SCROLL_EVENT === null) {
        SCROLL_EVENT = document.addEventListener("scroll", (e) => {
            SCROLL_VALUE = [
                document.documentElement.scrollTop || document.body.scrollTop,
                document.documentElement.scrollLeft || document.body.scrollLeft
            ];
        });
    }
}

export class ScrollPos extends EventBehaviour {

    #lastScroll = [];

    constructor() {
        super();
        addScrollEvent();
        this.#lastScroll = SCROLL_VALUE;
    }

    check() {
        return this.changed();
    }

    changed() {
        if(SCROLL_VALUE[0] != this.#lastScroll[0] || SCROLL_VALUE[1] != this.#lastScroll[1]) {
            this.#lastScroll = SCROLL_VALUE;
            return this.#lastScroll;
        }

        return false;
    }

    getScrollX() {
        return SCROLL_VALUE[1];
    }

    getScrollY() {
        return SCROLL_VALUE[0];
    }

    getScroll() {
        return SCROLL_VALUE;
    }
}

export class TabInfo extends EventBehaviour {

    #hasFocus = true;

    constructor() {
        super();
        window.onfocus = (e) => {
            this.#hasFocus = true;
        };
        
        window.onblur = (e) => {
            this.#hasFocus = false;
        };
    }

    check() {
        return this.#hasFocus;
    }
}

export class PageInfo extends EventBehaviour {
    constructor() {
        super();
    }

    getSize() {

        const width = Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.body.clientWidth,
            document.documentElement.clientWidth
        );

        const height = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );

        return [width, height];

    }

    width() {
        return this.getSize[0];
    }

    height() {
        return this.getSize[1];
    }
}

export class WebInfo extends EventBehaviour {

    constructor() {
        super();
    }

    check() {
        return {
            "browser" : this.browser(),
            "date": this.dateTime()
        };
    }

    browser() {
        const userAgent = navigator.userAgent;

        if (userAgent.indexOf('Chrome') > -1) {
            if (userAgent.indexOf('Edg') > -1) {
                return 'Microsoft Edge';
            }
            if (userAgent.indexOf('OPR') > -1) {
                return 'Opera';
            }
            return 'Chrome';
        }

        if (userAgent.indexOf('Firefox') > -1) {
            return 'Firefox';
        }

        if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            return 'Safari';
        }

        if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
            return 'Internet Explorer';
        }

        return 'Unknown';
    }

    dateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        return {
            year: year,
            month: month,
            day: day,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            milliseconds: milliseconds
        };
    }

    date() {
        const dt = this.dateTime();

        return {
            year: dt.year,
            month: dt.month,
            day: dt.day
        };
    }

    time() {
        const dt = this.dateTime();

        return {
            hour: dt.hours,
            minutes: dt.minutes,
            seconds: dt.seconds,
            milliseconds: dt.milliseconds
        };
    }

}
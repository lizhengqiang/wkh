export type Handler = ((ctx: Context) => void)

function Next(ctx: Context) {
    let handlers = ctx.handlers;
    let n = ctx.handlerIndex(-1) + 1;
    if (n < handlers.length) {
        ctx.handlerIndex(n);
        handlers[n](ctx);
    }
}

export class Context {
    request: any;
    sender: any;
    sendResponse: (response: any) => void;

    handlers: Handler[];
    values: { [key: string]: any };
    currentHandlerIndex: number;


    constructor(handlers: Handler[] = [], values: { [p: string]: any } = {}, currentHandlerIndex: number = 0) {
        this.handlers = handlers;
        this.values = values;
        this.currentHandlerIndex = currentHandlerIndex;
    }

    next() {
        Next(this);
    }

    handlerIndex(n: number): number {
        if (n < 0 || n > this.handlers.length - 1) {
            return this.currentHandlerIndex
        }

        return this.currentHandlerIndex = n;
    }
}

export class Route {
    handlers: Handler[];

    constructor(handlers: Handler[] = []) {
        this.handlers = handlers;
    }

    join(...handlers: Handler[]) {
        this.handlers.push(...handlers);
    }
}

export class Router {
    m: { [key: string]: Route };

    constructor(m: { [p: string]: Route } = {}) {
        this.m = m;
    }

    handle(key: string, ...handlers: Handler[]) {
        if (this.m[key] == null) {
            this.m[key] = new Route([...handlers]);
        }
        this.m[key].join(...handlers);
    }

    serve(key: string, ctx: Context) {
        let route = this.m[key];
        if (route == null) {
            return
        }
        ctx.handlers = route.handlers;
        Next(ctx)
    }

    run() {

    }
}
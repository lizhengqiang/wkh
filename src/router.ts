export type Handler = ((ctx: Context) => Promise<any>)

async function Next(ctx: Context) {
    let handlers = ctx.handlers;
    let n = ctx.handlerIndex(-1) + 1;
    if (n < handlers.length) {
        ctx.handlerIndex(n);
        try {
            await handlers[n](ctx);
        } catch (err) {
            throw err;
        }
    }
}

export class Context {
    request: { path: string, [key: string]: any };
    sender: any;
    response: any;

    handlers: Handler[];
    values: { [key: string]: any };
    currentHandlerIndex: number;


    constructor(handlers: Handler[] = [], values: { [p: string]: any } = {}, currentHandlerIndex: number = 0) {
        this.handlers = handlers;
        this.values = values;
        this.currentHandlerIndex = currentHandlerIndex;
    }

    async next() {
        try {
            await Next(this);
        } catch (err) {
            throw err;
        }
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
    middleware: Handler[];
    routes: { [key: string]: Route };

    constructor(middleware: Handler[] = [], routes: { [p: string]: Route } = {}) {
        this.middleware = middleware;
        this.routes = routes;
    }

    use(...handlers: Handler[]) {
        this.middleware.push(...handlers);
    }

    handle(key: string, ...handlers: Handler[]) {
        if (this.routes[key] == null) {
            this.routes[key] = new Route([...handlers]);
        }
        this.routes[key].join(...handlers);
    }

    async serve(key: string, ctx: Context) {
        let route = this.routes[key];
        if (route == null) {
            return
        }
        ctx.handlers = [...this.middleware, ...route.handlers];
        try {
            await Next(ctx)
        } catch (err) {
            throw err;
        }
    }

    run() {
        chrome.runtime.onMessage.addListener(
            (request: any, sender: any, sendResponse: (response: any) => void) => {
                let context = new Context();
                context.request = request;
                context.sender = sender;
                context.response = {};
                this.serve(request.path, context).catch(function (err) {
                    console.log(err);
                    sendResponse(context.response);
                }).then(function () {
                    sendResponse(context.response)
                });
            }
        );
    }
}
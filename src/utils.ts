class Combination {
    list: string[];
    sum: number;

    constructor(list: string[] = [], sum: number = 0) {
        this.list = list;
        this.sum = sum;
    }
}

export function bestFeeding(limit: number, base: number): Combination[] {
    let cs: Combination[] = [];

    let naiveBestFeeding = (newBase: number, p: Combination) => {
        for (let i = newBase; i < limit; i++) {
            let sum = p.sum + i;
            if (sum > limit) {
                if (p.list.length == 0 || p.sum + base < limit) {
                    return
                }
                if (cs.length == 0 || cs[0].sum == p.sum) {
                    cs.push(new Combination(p.list, p.sum));
                } else if (cs[0].sum < p.sum) {
                    cs = [new Combination(p.list, p.sum)];
                }
                return
            }
            let slice = p.list.slice();
            slice.push(`${i | 0}.${base.toString().slice(2)}`);
            naiveBestFeeding(i, new Combination(slice, sum));
        }
    };
    naiveBestFeeding(base, new Combination());
    cs.sort(((a, b) => {
        if (a.list.length < b.list.length) {
            return -1;
        }
        if (a.list.length > b.list.length) {
            return 1;
        }
        return 0;
    }));
    return cs;
}

export function whiteList() {
    return new Promise((rs, rj) => {
        $.getJSON("http://mxz-upload-public.oss-cn-hangzhou.aliyuncs.com/wkh/whitelist.json", function (resp) {
            rs(resp)
        })
    })
}
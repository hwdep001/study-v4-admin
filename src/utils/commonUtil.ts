declare global {
    interface Date {
        yyMMdd(): string;
        yyyy_MM_dd_HH_mm_ss (): string;
    }

    interface Array<T> {
        pushArray(array: Array<T>): void;
        shuffleArray(): void;
    }

    interface String {
        isEmpty(): boolean;
        trimToNull(): string;
    }
}

/**
 * yyMMdd
 */
Date.prototype.yyMMdd = function(): string {
    var yy = this.getFullYear().toString().slice(2, 4);
    var MM = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [yy,
            (MM>9 ? '' : '0') + MM,
            (dd>9 ? '' : '0') + dd
            ].join('');
};

/**
 * yyyy-MM-dd HH:mm:ss
 */
Date.prototype.yyyy_MM_dd_HH_mm_ss = function(): string {
    var yyyy = this.getFullYear();
    var MM = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var HH = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();

    return [yyyy, "-",
            (MM>9 ? '' : '0') + MM, "-",
            (dd>9 ? '' : '0') + dd, " ",
            (HH>9 ? '' : '0') + HH, ":",
            (mm>9 ? '' : '0') + mm, ":",
            (ss>9 ? '' : '0') + ss
            ].join('');
};

Array.prototype.pushArray = function(array) {
    this.push.apply(this, array);
};

Array.prototype.shuffleArray = function() {
    let m = this.length, t, i;

    while (m) {
        i = Math.floor(Math.random() * m--);

        t = this[m];
        this[m] = this[i];
        this[i] = t;
    }
};

String.prototype.isEmpty = function() {
    return (this == null || this == undefined || this.trim() == "") ? true : false;
};

String.prototype.trimToNull = function() {
    let result = null;

    if(!this.isEmpty()) {
        result = this.trim();
        result = result.isEmpty() ? null : result;
    }

    return result;
};

export class CommonUtil {

    public static void(): void {};

    public static getActiveName(param: string): string {
        let result: string;
        switch(param) {
            case "ew":
                result = "EwPage";
                break;
            case "lw":
                result = "LwPage";
                break;
            case "setting":
                result = "SettingPage";
                break;
        }
    
        return result;
    }

    public static getQForSqlInSyntax(count: number): string {
        let result = "";

        for(let i=0; i<count; i++) {
            result += "?";

            if(i < count-1) {
                result += ",";
            }
        }

        return result;
    }
}
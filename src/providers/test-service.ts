import { Injectable } from '@angular/core';

import { Subject } from './../models/Subject';

@Injectable()
export class TestService {

    platform: string;

    subMap: Map<string, Subject>;

    constructor(
        
    ) {
        this.setSubMap();
    }

    isCordova(): boolean {
        if(this.platform == "android" || this.platform == "ios") {
            return true;
        } else {
            return false;
        }
    }

    setSubMap(): void {
        this.subMap = new Map<string, Subject>();
        this.subMap.set("sp", {id: "sp", name: "맞춤법",   num: 0});
        this.subMap.set("sl", {id: "sl", name: "표준어",   num: 1});
        this.subMap.set("lw", {id: "lw", name: "외래어",   num: 2});
        this.subMap.set("kw", {id: "kw", name: "어휘",     num: 3});
        this.subMap.set("cc", {id: "cc", name: "한자어",   num: 4});
        this.subMap.set("c4", {id: "c4", name: "한자성어", num: 5});
        this.subMap.set("ew", {id: "ew", name: "영단어",   num: 6});
    }
}
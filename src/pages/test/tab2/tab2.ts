import { Component } from '@angular/core';

import * as firebase from 'firebase';

import { Subject } from './../../../models/Subject';

@Component({
  selector: 'page-tab2',
  templateUrl: 'tab2.html'
})
export class Tab2Page {

  constructor(
  ) {

  }

  refreshSubs() {
    const subRef = firebase.firestore().collection("subs");
    let subMap = new Map<string, Subject>();
    subMap.set("sp", {id: "sp", name: "맞춤법",   num: 1});
    subMap.set("sl", {id: "sl", name: "표준어",   num: 2});
    subMap.set("lw", {id: "lw", name: "외래어",   num: 3});
    subMap.set("kr", {id: "kr", name: "어휘",     num: 4});
    subMap.set("cc", {id: "cc", name: "한자",   num: 5});
    subMap.set("c4", {id: "c4", name: "한자성어", num: 6});
    subMap.set("ew", {id: "ew", name: "영단어",   num: 7});

    subMap.forEach(sub => {
      const ob = {
        id: sub.id,
        name: sub.name,
        num: sub.num
      }
      subRef.doc(sub.id).set(ob);
    });
  }

}

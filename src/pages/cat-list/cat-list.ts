import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from '../../providers/common-service';

import { Subject } from '../../models/Subject';
import { Category } from './../../models/Category';

@Component({
  selector: 'page-catList',
  templateUrl: 'cat-list.html'
})
export class CatListPage {

  subsRef: firebase.firestore.CollectionReference;
  catsRef: firebase.firestore.CollectionReference;
  subId: string;
  sub: Subject;
  cats: Array<Category>;

  isEdit: boolean = false;

  constructor(
    public navCtrl: NavController,
    private param: NavParams,
    private cmn_: CommonService
  ) {
    this.initData();
  }

  initData(): void {
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    let pros = new Array<Promise<any>>();

    this.subId = this.param.get('id');
    this.subsRef = firebase.firestore().collection("subs");
    this.catsRef = this.subsRef.doc(this.subId).collection("cats");
    pros.push(this.getSub());
    pros.push(this.getCats());

    Promise.all(pros)
    .then(any => loader.dismiss())
    .catch(err => loader.dismiss());
  }

  getSub(): Promise<any> {
    return this.subsRef.doc(this.subId).get().then(doc => {
      if(doc.exists) {
        this.sub = doc.data();
      }
    });
  }

  getCats(): Promise<any> {
    let cats = new Array<Category>();

    return this.catsRef.orderBy("num").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let cat = doc.data();
        cat.id = doc.id;
        cats.push(cat);
      });
      this.cats = cats;
    });
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

import * as firebase from 'firebase/app';

import { CommonUtil } from '../../utils/commonUtil';
import { CommonService } from './../../providers/common-service';

import { ToastOptions } from 'ionic-angular/components/toast/toast-options';
import { Subject } from './../../models/Subject';
import { Category } from './../../models/Category';

@Component({
  selector: 'page-catList',
  templateUrl: 'cat-list.html'
})
export class CatListPage {

  private VERSION_UP: number = 1;
  
  isEdit: boolean = false;
  subsRef: firebase.firestore.CollectionReference;
  catsRef: firebase.firestore.CollectionReference;

  sub: Subject;
  cats: Array<Category>;
  cats_: Array<Category>;
  cats_trash: Array<Category>;

  constructor(
    public navCtrl: NavController,
    private param: NavParams,
    private toastCtrl: ToastController,
    private cmn_: CommonService
  ) {
    this.initData();
  }

  initData(): void {
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    let pros = new Array<Promise<any>>();

    const subId = this.param.get('id');
    this.subsRef = firebase.firestore().collection("subs");
    this.catsRef = this.subsRef.doc(subId).collection("cats");
    pros.push(this.getSub(subId));
    pros.push(this.getCats());

    Promise.all(pros)
    .then(any => loader.dismiss())
    .catch(err => loader.dismiss());
  }

  getSub(subId: string): Promise<any> {
    return this.subsRef.doc(subId).get().then(doc => {
      if(doc.exists) {
        let sub = new Subject();
        sub = doc.data();
        sub.id = doc.id;
        this.sub = sub;
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

  addCat(newCatName: string): void {
    if(newCatName.isEmpty()) {
        return;
    }

    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    const newRef = this.subsRef.doc(this.sub.id).collection("cats");

    newRef.where("name", "==", newCatName).get().then(querySnapshot => {
        if(querySnapshot.size > 0) {
          this.showToast("top", "이름이 중복되었습니다.", null);
        } else {
            return newRef.add({
                name: newCatName,
                num: this.cats.length+1,
                version: 0
            }).then( () => {
                return this.getCats();
            });
        }
    }).then(any => loader.dismiss())
    .catch(err => loader.dismiss());
  }

  clickCat(cat: Category): void {
    console.log("clickCat: " + cat);
    // this.navCtrl.push(LecListPage, {
    //   activeName: CommonUtil.getActiveName(this.sub.id), sub: this.sub, cat: cat});
  }

  //////////////////////////////////////////////////////////////////////////////

  startEdit() {
    this.isEdit = true;
    this.cats_trash = [];
    this.cats_ = this.cats.map(x => Object.assign({}, x));
  }

  cancelEdit() {
    this.isEdit = false;
    this.cats_trash = [];
  }

  //////////////////////////////////////////////////////////////////////////////

  trashCat(index: number, cat: Category) {
    this.cats_.splice(index, 1);
    this.cats_trash.push(cat);
  }

  saveEdit() {
    
  }

  //////////////////////////////////////////////////////////////////////////////

  showToast(position: string, message: string, cssClass: string, duration?: number): void {
    let options: ToastOptions = {
      message: message,
      position: position,
      duration: (duration == null) ? 2500 : duration
    }
    if(cssClass != null) {
      options.cssClass = cssClass;
    }

    this.toastCtrl.create(options).present();
  }
}

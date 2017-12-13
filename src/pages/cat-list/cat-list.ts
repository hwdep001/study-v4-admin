import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

import * as firebase from 'firebase/app';

import { CommonUtil } from '../../utils/commonUtil';
import { CommonService } from './../../providers/common-service';

import { ToastOptions } from 'ionic-angular/components/toast/toast-options';
import { Subject } from './../../models/Subject';
import { Category } from './../../models/Category';

import { LecListPage } from './../lec-list/lec-list';

@Component({
  selector: 'page-catList',
  templateUrl: 'cat-list.html'
})
export class CatListPage {

  private VERSION_UP: number = 1;
  
  isEdit: boolean = false;
  isOrder: boolean = false;
  subsRef: firebase.firestore.CollectionReference;
  catsRef: firebase.firestore.CollectionReference;

  sub: Subject;
  cats: Array<Category>;

  catsMap: Map<string, Category>;
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
      this.setCatsMap(cats);
    });
  }

  setCatsMap(cats: Array<Category>): void {
    let map = new Map<string, Category>();

    cats.forEach(cat => {
      map.set(cat.id, cat);
    });

    this.catsMap = map;
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
          this.presentToast("top", "이름이 중복되었습니다.", null);
        } else {
            return newRef.add({
                name: newCatName,
                num: this.cats.length+1,
                version: 0
            }).then( () => {
              this.presentToast("top", newCatName + " - 등록되었습니다.", null);
              return this.getCats();
            });
        }
    }).then(any => loader.dismiss())
    .catch(err => loader.dismiss());
  }

  clickCat(cat: Category): void {
    this.navCtrl.push(LecListPage, {
      activeName: CommonUtil.getActiveName(this.sub.id), sub: this.sub, cat: cat});
  }

  //////////////////////////////////////////////////////////////////////////////

  startEdit(): void {
    this.isEdit = true;
    this.cats_trash = [];
    this.cats_ = this.cats.map(x => Object.assign({}, x));
  }

  startOrder(): void {
    this.isOrder = true;
    this.cats_trash = [];
    this.cats_ = this.cats.map(x => Object.assign({}, x));
  }

  save(): void {
    this.cmn_.Alert.confirm("저장하시겠습니까?").then(yes => {
      const loader = this.cmn_.getLoader(null, null);
      loader.present();
  
      this.saveCats()
      .then(any => {
        this.getCats();
        this.isEdit = false;
        this.isOrder = false;
        loader.dismiss();
      }).catch(err => {
        console.log(err);
        loader.dismiss();
      });
    }).catch(no => null);
  }

  cancel(): void {
    this.cmn_.Alert.confirm("취소하시겠습니까?").then(yes => {
      if(this.isOrder) {
        this.isOrder = false;
      }
  
      if(this.isEdit) {
        this.isEdit = false;
        this.cats_trash = [];
      }
    }).catch(no => null);
  }

  //////////////////////////////////////////////////////////////////////////////

  trashCat(index: number, cat: Category): void {
    this.cats_.splice(index, 1);
    this.cats_trash.push(cat);
  }

  saveCats(): Promise<any> {
    let i: number = 1;
    let pros = new Array<Promise<any>>();

    for(let cat_ of this.cats_) {
      cat_.num = i;
      const cat = this.catsMap.get(cat_.id);

      if(cat.name != cat_.name && cat.num != cat_.num) {  // 둘 다 변경
        pros.push(this.updateCat(cat_, true, true));  
      } else if(cat.name != cat_.name) {                  // name만 변경  
        pros.push(this.updateCat(cat_, false, true)); 
      } else if(cat.num != cat_.num) {                    // num만 변경
        pros.push(this.updateCat(cat_, true, false)); 
      }

      i++;
    }

    for(let cat_trash of this.cats_trash) {
      pros.push(this.removeCat(cat_trash.id));
    }

    return Promise.all(pros);
  }

  updateCat(cat: Category, isNumChange: boolean, isNameChange: boolean): Promise<any> {
    let updateData: CustomObject = {
        version: cat.version + this.VERSION_UP
    }

    if(isNumChange) {
        updateData.num = cat.num;
    }

    if(isNameChange) {
        updateData.name = cat.name
    }

    return this.catsRef.doc(cat.id).update(updateData);
  }

  removeCat(catId: string): Promise<any> {
    let pros = new Array<Promise<any>>();
    
    this.subsRef.doc(this.sub.id).collection("cats").doc(catId)
    .collection("lecs").get().then(querySnapshot => {

        querySnapshot.forEach(lecDocSnapshot => {
            let subPros = new Array<Promise<any>>();

            // lecs collection delete
            lecDocSnapshot.ref.collection("words").get().then(querySnapshot => {
                querySnapshot.forEach(wordDocSnapshot => {
                  subPros.push(wordDocSnapshot.ref.delete());
                });
            });

            // lec document delete
            Promise.all(subPros).then( () => {
              pros.push(lecDocSnapshot.ref.delete());
            });
        });
    });

    return Promise.all(pros).then( () => {
        // cat document delete
        return this.catsRef.doc(catId).delete();
    });
  }
  
  reorderCats(indexes): void {
    let element = this.cats_[indexes.from];
    this.cats_.splice(indexes.from, 1);
    this.cats_.splice(indexes.to, 0, element);
  }

  //////////////////////////////////////////////////////////////////////////////

  presentToast(position: string, message: string, cssClass: string, duration?: number): void {
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

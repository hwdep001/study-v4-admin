import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonUtil } from '../../utils/commonUtil';
import { CommonService } from './../../providers/common-service';

import { Subject } from './../../models/Subject';
import { Category } from './../../models/Category';
import { Lecture } from './../../models/Lecture';

import { SpsllwListPage } from './../word-list/spsllw-list/spsllw-list';
import { KrListPage } from './../word-list/kr-list/kr-list';
import { CcListPage } from './../word-list/cc-list/cc-list';
import { C4ListPage } from './../word-list/c4-list/c4-list';
import { EwListPage } from './../word-list/ew-list/ew-list';

@Component({
  selector: 'page-lecList',
  templateUrl: 'lec-list.html'
})
export class LecListPage {

  private VERSION_UP: number = 1;
  
  isEdit: boolean = false;
  isOrder: boolean = false;
  lecsRef: firebase.firestore.CollectionReference;

  sub: Subject;
  cat: Category;
  lecs: Array<Lecture>;

  lecsMap: Map<string, Category>;
  lecs_: Array<Category>;
  lecs_trash: Array<Category>;

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

    this.sub = this.param.get('sub');
    this.cat = this.param.get('cat');
    this.lecsRef = firebase.firestore().collection("subs").doc(this.sub.id)
                    .collection("cats").doc(this.cat.id).collection("lecs");

    this.getLecs()
    .then(any => loader.dismiss())
    .catch(err => loader.dismiss());
  }

  getLecs(): Promise<any> {
    let lecs = new Array<Lecture>();

    return this.lecsRef.orderBy("num").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let lec = doc.data();
        lec.id = doc.id;
        lecs.push(lec);
      });
      this.lecs = lecs;
      this.setLecsMap(lecs);
    });
  }

  setLecsMap(lecs: Array<Lecture>): void {
    let map = new Map<string, Lecture>();

    lecs.forEach(lec => {
      map.set(lec.id, lec);
    });

    this.lecsMap = map;
  }

  addLec(newLecName: string): void {
    if(newLecName.isEmpty()) {
        return;
    }

    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    this.lecsRef.where("name", "==", newLecName).get().then(querySnapshot => {
        if(querySnapshot.size > 0) {
          this.cmn_.Toast.present("top", "이름이 중복되었습니다.", "toast-fail");
        } else {
            return this.lecsRef.add({
                name: newLecName,
                num: this.lecs.length+1,
                version: 0
            }).then( () => {
              this.cmn_.Toast.present("top", newLecName + " - 등록되었습니다.", "toast-success");
              return this.updateCatVersion();
            });
        }
    }).then(any => {
      this.getLecs()
      .then(any => loader.dismiss())
      .catch(err => loader.dismiss());
    })
    .catch(err => loader.dismiss());
  }

  updateCatVersion(): Promise<any> {
    const version = this.cat.version + this.VERSION_UP;
    return this.lecsRef.parent.update({version: version}).then(() => {
        this.cat.version = version;
    });
  }

  clickLec(lec: Lecture): void {
    const option = {
      activeName: CommonUtil.getActiveName(this.sub.id), 
      sub: this.sub, 
      cat: this.cat, 
      lec: lec
    }

    switch(this.sub.id) {
      case "sp":
      case "sl":
      case "lw":
        this.navCtrl.push(SpsllwListPage, option);
        break;
      case "kr":
        this.navCtrl.push(KrListPage, option);
        break;
      case "cc":
        this.navCtrl.push(CcListPage, option);
        break;
      case "c4":
        this.navCtrl.push(C4ListPage, option);
        break;
      case "ew": 
        this.navCtrl.push(EwListPage, option);
        break;
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  startEdit(): void {
    this.isEdit = true;
    this.lecs_trash = [];
    this.lecs_ = this.lecs.map(x => Object.assign({}, x));
  }

  startOrder(): void {
    this.isOrder = true;
    this.lecs_trash = [];
    this.lecs_ = this.lecs.map(x => Object.assign({}, x));
  }

  save(): void {
    this.cmn_.Alert.confirm("저장하시겠습니까?").then(yes => {

      if(!this.checkSave()) {
        this.cmn_.Alert.alert("이름은 필수 입력 사항입니다.");
        return;
      }

      const loader = this.cmn_.getLoader(null, null);
      loader.present();
  
      this.saveLecs()
      .then(any => {
        this.getLecs();
        this.isEdit = false;
        this.isOrder = false;
        loader.dismiss();
      }).catch(err => {
        console.log(err);
        loader.dismiss();
      });
    }).catch(no => null);
  }

  checkSave(): boolean {
    let successFlag = true;

    for(let lec_ of this.lecs_) {
      if(lec_.name.isEmpty()) {
        successFlag = false;
        break;
      }
    }

    return successFlag;
  }

  cancel(): void {
    this.cmn_.Alert.confirm("취소하시겠습니까?").then(yes => {
      if(this.isOrder) {
        this.isOrder = false;
      }
  
      if(this.isEdit) {
        this.isEdit = false;
        this.lecs_trash = [];
      }
    }).catch(no => null);
  }

  //////////////////////////////////////////////////////////////////////////////

  trashLec(index: number, lec: Lecture): void {
    this.lecs_.splice(index, 1);
    this.lecs_trash.push(lec);
  }

  saveLecs(): Promise<any> {
    let i: number = 1;
    let pros = new Array<Promise<any>>();

    for(let lec_ of this.lecs_) {
      lec_.num = i;
      const lec = this.lecsMap.get(lec_.id);

      if(lec.name != lec_.name && lec.num != lec_.num) {  // 둘 다 변경
        pros.push(this.updateLec(lec_, true, true));  
      } else if(lec.name != lec_.name) {                  // name만 변경  
        pros.push(this.updateLec(lec_, false, true)); 
      } else if(lec.num != lec_.num) {                    // num만 변경
        pros.push(this.updateLec(lec_, true, false)); 
      }

      i++;
    }

    for(let lec_trash of this.lecs_trash) {
      pros.push(this.removeLec(lec_trash.id));
    }

    return Promise.all(pros).then(any => {
      if(pros.length > 0) {
        this.updateCatVersion();
      }
    });
  }

  updateLec(lec: Lecture, isNumChange: boolean, isNameChange: boolean): Promise<any> {
    let updateData: CustomObject = {
        version: lec.version + this.VERSION_UP
    }

    if(isNumChange) {
        updateData.num = lec.num;
    }

    if(isNameChange) {
        updateData.name = lec.name
    }

    return this.lecsRef.doc(lec.id).update(updateData);
  }

  removeLec(lecId: string): Promise<any> {
    let pros = new Array<Promise<any>>();

    // word documents delete
    this.lecsRef.doc(lecId).collection("words").get().then(querySnapshot => {
      querySnapshot.forEach(wordDocSnapshot => {
        pros.push(wordDocSnapshot.ref.delete());
      });
    });

    return Promise.all(pros).then( () => {
        // lec document delete
        return this.lecsRef.doc(lecId).delete();
    });
  }
  
  reorderLecs(indexes): void {
    let element = this.lecs_[indexes.from];
    this.lecs_.splice(indexes.from, 1);
    this.lecs_.splice(indexes.to, 0, element);
  }
}

import { EwWord } from './../../../models/EwWord';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

import * as firebase from 'firebase/app';

import { CommonUtil } from './../../../utils/commonUtil';
import { CommonService } from './../../../providers/common-service';

import { ToastOptions } from 'ionic-angular/components/toast/toast-options';
import { Subject } from './../../../models/Subject';
import { Category } from './../../../models/Category';
import { Lecture } from './../../../models/Lecture';
import { Word } from '../../../models/Word';

@Component({
  selector: 'page-ewList',
  templateUrl: 'ew-list.html'
})
export class EwListPage {

  private VERSION_UP: number = 1;
  
  isEdit: boolean = false;
  isOrder: boolean = false;
  wordsRef: firebase.firestore.CollectionReference;

  sub: Subject;
  cat: Category;
  lec: Lecture;
  words: Array<Word>;

  wordsMap: Map<string, Word>;
  words_: Array<Word>;
  words_trash: Array<Word>;

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

    this.sub = this.param.get('sub');
    this.cat = this.param.get('cat');
    this.lec = this.param.get('lec');
    this.wordsRef = firebase.firestore().collection("subs").doc(this.sub.id)
                    .collection("cats").doc(this.cat.id)
                    .collection("lecs").doc(this.lec.id).collection("words");

    this.getWords()
    .then(any => loader.dismiss())
    .catch(err => loader.dismiss());
  }

  getWords(): Promise<any> {
    let words = new Array<Word>();

    return this.wordsRef.orderBy("num").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let word = doc.data();
        word.id = doc.id;
        words.push(word);
      });
      this.words = words;
      this.setWordsMap(words);
    });
  }

  setWordsMap(words: Array<Word>): void {
    let map = new Map<string, Word>();

    words.forEach(lec => {
      map.set(lec.id, lec);
    });

    this.wordsMap = map;
  }

  addWord(que, me1, me2, me3, me4, me5, me6): void {
    if(que.isEmpty()) {
        return;
    }

    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    this.wordsRef.where("que", "==", que).get().then(querySnapshot => {
        if(querySnapshot.size > 0) {
          this.presentToast("top", "단어가 중복되었습니다.", null);
        } else {
          let w = Word.getWordByEw(new EwWord(que, me1, me2, me3, me4, me5, me6));
          return this.wordsRef.add({
            num: this.words.length+1,
            que: w.que,
            me1: w.me1, me2: w.me2, me3: w.me3, me4: w.me4, me5: w.me5, me6: w.me6,
            me7: w.me7, me8: w.me8, me9: w.me9, me10: w.me10, me11: w.me11,
            me12: w.me12, me13: w.me13, syn: w.syn, ant: w.ant,
        }).then( () => {
            this.presentToast("top", que + " - 등록되었습니다.", null);
            return this.updateLecVersion();
          });
        }
    }).then(any => {
      this.getWords()
      .then(any => loader.dismiss())
      .catch(err => loader.dismiss());
    })
    .catch(err => loader.dismiss());
  }

  updateLecVersion(): Promise<any> {
    const version = this.lec.version + this.VERSION_UP;
    return this.wordsRef.parent.update({version: version}).then(() => {
        this.lec.version = version;
        return this.updateCatVersion();
    });
  }

  updateCatVersion(): Promise<any> {
    const version = this.cat.version + this.VERSION_UP;
    return this.wordsRef.parent.parent.parent.update({version: version}).then(() => {
        this.cat.version = version;
    });
  }

  // //////////////////////////////////////////////////////////////////////////////

  // startEdit(): void {
  //   this.isEdit = true;
  //   this.lecs_trash = [];
  //   this.lecs_ = this.lecs.map(x => Object.assign({}, x));
  // }

  // startOrder(): void {
  //   this.isOrder = true;
  //   this.lecs_trash = [];
  //   this.lecs_ = this.lecs.map(x => Object.assign({}, x));
  // }

  // save(): void {
  //   this.cmn_.Alert.confirm("저장하시겠습니까?").then(yes => {
  //     const loader = this.cmn_.getLoader(null, null);
  //     loader.present();
  
  //     this.saveLecs()
  //     .then(any => {
  //       this.getLecs();
  //       this.isEdit = false;
  //       this.isOrder = false;
  //       loader.dismiss();
  //     }).catch(err => {
  //       console.log(err);
  //       loader.dismiss();
  //     });
  //   }).catch(no => null);
  // }

  // cancel(): void {
  //   this.cmn_.Alert.confirm("취소하시겠습니까?").then(yes => {
  //     if(this.isOrder) {
  //       this.isOrder = false;
  //     }
  
  //     if(this.isEdit) {
  //       this.isEdit = false;
  //       this.lecs_trash = [];
  //     }
  //   }).catch(no => null);
  // }

  // //////////////////////////////////////////////////////////////////////////////

  // trashLec(index: number, lec: Lecture): void {
  //   this.lecs_.splice(index, 1);
  //   this.lecs_trash.push(lec);
  // }

  // saveLecs(): Promise<any> {
  //   let i: number = 1;
  //   let pros = new Array<Promise<any>>();

  //   for(let lec_ of this.lecs_) {
  //     lec_.num = i;
  //     const lec = this.lecsMap.get(lec_.id);

  //     if(lec.name != lec_.name && lec.num != lec_.num) {  // 둘 다 변경
  //       pros.push(this.updateLec(lec_, true, true));  
  //     } else if(lec.name != lec_.name) {                  // name만 변경  
  //       pros.push(this.updateLec(lec_, false, true)); 
  //     } else if(lec.num != lec_.num) {                    // num만 변경
  //       pros.push(this.updateLec(lec_, true, false)); 
  //     }

  //     i++;
  //   }

  //   for(let lec_trash of this.lecs_trash) {
  //     pros.push(this.removeLec(lec_trash.id));
  //   }

  //   return Promise.all(pros).then(any => {
  //     if(pros.length > 0) {
  //       this.updateCatVersion();
  //     }
  //   });
  // }

  // updateLec(lec: Lecture, isNumChange: boolean, isNameChange: boolean): Promise<any> {
  //   let updateData: CustomObject = {
  //       version: lec.version + this.VERSION_UP
  //   }

  //   if(isNumChange) {
  //       updateData.num = lec.num;
  //   }

  //   if(isNameChange) {
  //       updateData.name = lec.name
  //   }

  //   return this.lecsRef.doc(lec.id).update(updateData);
  // }

  // removeLec(lecId: string): Promise<any> {
  //   let pros = new Array<Promise<any>>();

  //   // word documents delete
  //   this.lecsRef.doc(lecId).collection("words").get().then(querySnapshot => {
  //     querySnapshot.forEach(wordDocSnapshot => {
  //       pros.push(wordDocSnapshot.ref.delete());
  //     });
  //   });

  //   return Promise.all(pros).then( () => {
  //       // lec document delete
  //       return this.lecsRef.doc(lecId).delete();
  //   });
  // }
  
  // reorderLecs(indexes): void {
  //   let element = this.lecs_[indexes.from];
  //   this.lecs_.splice(indexes.from, 1);
  //   this.lecs_.splice(indexes.to, 0, element);
  // }

  // //////////////////////////////////////////////////////////////////////////////

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

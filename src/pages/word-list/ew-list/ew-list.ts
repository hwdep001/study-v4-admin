import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

import * as firebase from 'firebase/app';

import { CommonService } from './../../../providers/common-service';
import { FileService } from './../../../providers/file-service';

import { ToastOptions } from 'ionic-angular/components/toast/toast-options';
import { Subject } from './../../../models/Subject';
import { Category } from './../../../models/Category';
import { Lecture } from './../../../models/Lecture';
import { Word } from './../../../models/Word';
import { EwWord } from './../../../models/EwWord';

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
    private cmn_: CommonService,
    private file_: FileService
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
            me12: w.me12, me13: w.me13, syn: w.syn, ant: w.ant
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

  //////////////////////////////////////////////////////////////////////////////

  startEdit(): void {
    this.isEdit = true;
    this.words_trash = [];
    this.words_ = this.words.map(x => Object.assign({}, x));
  }

  startOrder(): void {
    this.isOrder = true;
    this.words_trash = [];
    this.words_ = this.words.map(x => Object.assign({}, x));
  }

  save(): void {
    this.cmn_.Alert.confirm("저장하시겠습니까?").then(yes => {

      if(!this.checkSave()) {
        this.cmn_.Alert.alert("이름은 필수 입력 사항입니다.");
        return;
      }

      const loader = this.cmn_.getLoader(null, null);
      loader.present();
  
      this.saveWords()
      .then(any => {
        this.getWords().then(any => {
          loader.dismiss();
          this.isEdit = false;
          this.isOrder = false;
        }).catch(err => loader.dismiss());
        
      }).catch(err => {
        console.log(err);
        loader.dismiss();
      });
    }).catch(no => null);
  }

  checkSave(): boolean {
    let successFlag = true;

    for(let word_ of this.words_) {
      if(word_.que.isEmpty()) {
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
        this.words_trash = [];
      }
    }).catch(no => null);
  }

  download() {
    const fileName = this.cat.name + "_" + this.lec.name + ".xlsx";
    let datas = new Array<Array<any>>();

    this.words.forEach(word => {
      datas.push(this.wordToData(word));
    });

    this.file_.export(fileName, datas);
  }

  async onFileChange(evt: any) {
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
            
    if(dt.files.length == 1) {
      const datas = await this.file_.uploadExcel(dt.files[0]);
      datas.forEach(data => {
        this.words_.push(this.dataToWord(data));
      })
    } else {
      // this.words_ = [];
      // this.fileName = null;
    }   
  }

  //////////////////////////////////////////////////////////////////////////////

  trashWord(index: number, word: Word): void {
    this.words_.splice(index, 1);
    this.words_trash.push(word);
  }

  saveWords(): Promise<any> {
    let i: number = 1;
    let pros = new Array<Promise<any>>();

    for(let word_ of this.words_) {
      
      word_.num = i;
      word_.que = word_.que == null ? word_.que : word_.que.trimToNull();
      word_.me1  = word_.me1  == null ? word_.me1  : word_.me1.trimToNull();
      word_.me2  = word_.me2  == null ? word_.me2  : word_.me2.trimToNull();
      word_.me3  = word_.me3  == null ? word_.me3  : word_.me3.trimToNull();
      word_.me4  = word_.me4  == null ? word_.me4  : word_.me4.trimToNull();
      word_.me5  = word_.me5  == null ? word_.me5  : word_.me5.trimToNull();
      word_.me6  = word_.me6  == null ? word_.me6  : word_.me6.trimToNull();
      word_.me7  = word_.me7  == null ? word_.me7  : word_.me7.trimToNull();
      word_.me8  = word_.me8  == null ? word_.me8  : word_.me8.trimToNull();
      word_.me9  = word_.me9  == null ? word_.me9  : word_.me9.trimToNull();
      word_.me10 = word_.me10 == null ? word_.me10 : word_.me10.trimToNull();
      word_.me11 = word_.me11 == null ? word_.me11 : word_.me11.trimToNull();
      word_.me12 = word_.me12 == null ? word_.me12 : word_.me12.trimToNull();
      word_.me13 = word_.me13 == null ? word_.me13 : word_.me13.trimToNull();
      word_.syn = word_.syn == null ? word_.syn : word_.syn.trimToNull();
      word_.ant = word_.ant == null ? word_.ant : word_.ant.trimToNull();
      
      const wordObject: object = {
        num: word_.num,
        que: word_.que,
        me1: word_.me1, 
        me2: word_.me2, 
        me3: word_.me3, 
        me4: word_.me4, 
        me5: word_.me5, 
        me6: word_.me6,
        me7: word_.me7, 
        me8: word_.me8, 
        me9: word_.me9, 
        me10: word_.me10, 
        me11: word_.me11,
        me12: word_.me12, 
        me13: word_.me13, 
        syn: word_.syn, 
        ant: word_.ant
      };
      
      if(word_.id == null) {
        pros.push(this.wordsRef.add(wordObject));
      } else {
        const word = this.wordsMap.get(word_.id);
        if(!Word.equals(word, word_)) {
          pros.push(this.wordsRef.doc(word.id).update(wordObject));
        }
      }

      i++;
    }

    for(let word_trash of this.words_trash) {
      pros.push(this.removeWord(word_trash.id));
    }

    return Promise.all(pros).then(any => {
      if(pros.length > 0) {
        this.updateLecVersion();
      }
    });
  }

  removeWord(wordId: string): Promise<any> {
    return this.wordsRef.doc(wordId).delete();
  }
  
  reorderWords(indexes): void {
    let element = this.words_[indexes.from];
    this.words_.splice(indexes.from, 1);
    this.words_.splice(indexes.to, 0, element);
  }

  //////////////////////////////////////////////////////////////////////////////

  dataToWord(data: Array<any>): Word {
    let word = new Word();

    word.que = data[0] == undefined? null: data[0];
    word.me1 = data[1] == undefined? null: data[1];
    word.me2 = data[2] == undefined? null: data[2];
    word.me3 = data[3] == undefined? null: data[3];
    word.me4 = data[4] == undefined? null: data[4];
    word.me5 = data[5] == undefined? null: data[5];
    word.me6 = data[6] == undefined? null: data[6];
    word.me7 = null;
    word.me8 = null;
    word.me9 = null;
    word.me10 = null;
    word.me11 = null;
    word.me12 = null;
    word.me13 = null;
    word.syn = null;
    word.ant = null;

    return word;
  }

  wordToData(word: Word): Array<any> {
    let data = new Array<any>();

    data.push(word.que);
    data.push(word.me1);
    data.push(word.me2);
    data.push(word.me3);
    data.push(word.me4);
    data.push(word.me5);
    data.push(word.me6);

    return data;
  }

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

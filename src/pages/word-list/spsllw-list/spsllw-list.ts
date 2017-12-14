import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../../providers/common-service';
import { FileService } from './../../../providers/file-service';
import { WordUtil } from './../../../utils/wordUtil';

import { Subject } from './../../../models/Subject';
import { Category } from './../../../models/Category';
import { Lecture } from './../../../models/Lecture';
import { Word } from './../../../models/Word';

@Component({
  selector: 'page-spsllwList',
  templateUrl: 'spsllw-list.html'
})
export class SpsllwListPage {

  private VERSION_UP: number = 1;
  
  isEdit: boolean = false;
  isOrder: boolean = false;
  wordsRef: firebase.firestore.CollectionReference;

  sub: Subject;
  cat: Category;
  lec: Lecture;
  words: Array<Word>;
  newWord: Word = new Word();

  wordsMap: Map<string, Word>;
  words_: Array<Word>;
  words_trash: Array<Word>;

  constructor(
    public navCtrl: NavController,
    private param: NavParams,
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
        let word: Word = WordUtil.object2Word(doc.data());
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

  addWord(): void {
    if(this.newWord.que.isEmpty()) {
        return;
    }

    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    this.wordsRef.where("que", "==", this.newWord.que).get().then(querySnapshot => {
        if(querySnapshot.size > 0) {
          this.cmn_.Toast.present("top", "단어가 중복되었습니다.", "toast-fail");
        } else {
          this.newWord.num = this.words.length+1;

          return this.wordsRef.add(WordUtil.word2Object(this.newWord)).then( () => {
            this.cmn_.Toast.present("top", this.newWord.que + " - 등록되었습니다.", "toast-success");
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
        this.cmn_.Alert.alert("question - 필수 입력 사항입니다.");
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
    let datas = WordUtil.word2ExcelData(this.sub.id, this.words);

    this.file_.export(fileName, datas);
  }

  async onFileChange(evt: any) {
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
            
    if(dt.files.length == 1) {
      const datas = await this.file_.uploadExcel(dt.files[0]);
      this.words_.pushArray(WordUtil.excelData2Word(this.sub.id, datas));
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
      const wordObject: object = WordUtil.word2Object(word_);
      
      if(word_.id == null) {
        pros.push(this.wordsRef.add(wordObject));
      } else {
        const word = this.wordsMap.get(word_.id);
        if(!WordUtil.equals(word, wordObject)) {
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
}

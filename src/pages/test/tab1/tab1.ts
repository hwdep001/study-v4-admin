import { Component } from '@angular/core';

import * as firebase from 'firebase';

import { CommonService } from './../../../providers/common-service';
import { FileService } from './../../../providers/file-service';
import { WordUtil } from './../../../utils/wordUtil';

import { Word } from './../../../models/Word';

@Component({
  selector: 'page-tab1',
  templateUrl: 'tab1.html'
})
export class Tab1Page {

  constructor(
    private file_: FileService,
    private cmn_: CommonService
  ) {

  }


  ///////////////////////////////////////////////////////////////////////////////////
  /// SP
  ///////////////////////////////////////////////////////////////////////////////////

  async splitFileBySp(evt: any) {
    
    const subId = "sp";
    const catName = "2018 선재국어";
    let lecName = "맞춤법 DAY #";
    const ext = ".xlsx";
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
    let words = new Array<Array<Word>>();

    if(dt.files.length == 1) {
      const upData = await this.file_.uploadJson(dt.files[0]);
      let aa; // [][]
      let beforeLec = 0;

      for(let i=0; i<upData.length; i++) {
        const a = upData[i];  // []
        const currLec = a['day'];

        if(beforeLec != currLec) {
          if(i > 0) {
            words.push(this.excelData2WordOfSpSlLw(aa));
          }
          aa = new Array<Array<any>>();
          beforeLec = currLec;
        }

        aa.push(a);
        if(i == upData.length -1) {
          words.push(this.excelData2WordOfSpSlLw(aa));
        }
      }

      for(let i=0; i<words.length; i++) {
        const fileName = catName + "_" + lecName.replace("#", (i+1)+"") + ext;
        this.download(subId, fileName, words[i]);
      }
    }
  }

  private excelData2WordOfSpSlLw(datas: Array<Array<any>>): Array<Word> {
    let words = new Array<Word>();
    let word: Word;

    datas.forEach(data => {
      word = WordUtil.getNullWord();
      word.que  = this.convertData(data['question']);
      word.me1  = this.convertData(data['choice1']);
      word.me2  = this.convertData(data['choice2']);
      word.me3  = this.convertData(data['answer']);
      if(word.que != null) {
          words.push(word);
      }
    });

    return words;
  }

  createCatLecBySp() {
    
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    const subId = "sp";
    const catName = "2018 선재국어";
    let lecNames = [
      "DAY 1 - 한글 맞춤법: 가~담",
      "DAY 2 - 한글 맞춤법: 당~봉",
      "DAY 3 - 한글 맞춤법: 부~으",
      "DAY 4 - 한글 맞춤법: 으~간",
      "DAY 5 - 한글 맞춤법: 개~여",
      "DAY 6 - 한글 맞춤법: 운~채",
    ]
    let lecSize = 6;

    const catsRef = firebase.firestore().collection("subs").doc(subId).collection("cats");
    catsRef.get().then(querySnapshot => {
      const catsLength: number = querySnapshot.size;

      catsRef.add({
        name: catName,
        num: catsLength + 1,
        version: 1
      }).then(doc => {

        let pros = new Array<Promise<any>>();

        for(let i=1; i<=lecSize; i++) {
          const lec: object = {
            name: lecNames[i-1],
            num: i,
            version: 0
          }

          pros.push(doc.collection("lecs").add(lec));
        }

        Promise.all(pros)
        .then(any => loader.dismiss())
        .catch(err => loader.dismiss())
      
      }).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }
  
  ///////////////////////////////////////////////////////////////////////////////////
  /// SL
  ///////////////////////////////////////////////////////////////////////////////////

  async splitFileBySl(evt: any) {
    
    const subId = "sl";
    const catName = "2018 선재국어";
    let lecName = "표준어 DAY #";
    const ext = ".xlsx";
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
    let words = new Array<Array<Word>>();

    if(dt.files.length == 1) {
      const upData = await this.file_.uploadJson(dt.files[0]);
      let aa; // [][]
      let beforeLec = 0;

      for(let i=0; i<upData.length; i++) {
        const a = upData[i];  // []
        const currLec = a['day'];

        if(beforeLec != currLec) {
          if(i > 0) {
            words.push(this.excelData2WordOfSpSlLw(aa));
          }
          aa = new Array<Array<any>>();
          beforeLec = currLec;
        }

        aa.push(a);
        if(i == upData.length -1) {
          words.push(this.excelData2WordOfSpSlLw(aa));
        }
      }

      for(let i=0; i<words.length; i++) {
        const fileName = catName + "_" + lecName.replace("#", (i+1)+"") + ext;
        this.download(subId, fileName, words[i]);
      }
    }
  }

  createCatLecBySl() {
    
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    const subId = "sl";
    const catName = "2018 선재국어";
    let lecNames = [
      "DAY 1 - 표준어: 가~고",
      "DAY 2 - 표준어: 곡~깍",
      "DAY 3 - 표준어: 깍~너",
      "DAY 4 - 표준어: 넉~덮",
      "DAY 5 - 표준어: 도~망",
      "DAY 6 - 표준어: 망~법",
      "DAY 7 - 표준어: 베~생",
      "DAY 8 - 표준어: 생~아",
      "DAY 9 - 표준어: 아~여",
      "DAY 10 - 표준어: 연~이",
      "DAY 11 - 표준어: 익~짭",
      "DAY 12 - 표준어: 짱~파",
      "DAY 13 - 표준어: 파~희",
    ]
    let lecSize = 13;

    const catsRef = firebase.firestore().collection("subs").doc(subId).collection("cats");
    catsRef.get().then(querySnapshot => {
      const catsLength: number = querySnapshot.size;

      catsRef.add({
        name: catName,
        num: catsLength + 1,
        version: 1
      }).then(doc => {

        let pros = new Array<Promise<any>>();

        for(let i=1; i<=lecSize; i++) {
          const lec: object = {
            name: lecNames[i-1],
            num: i,
            version: 0
          }

          pros.push(doc.collection("lecs").add(lec));
        }

        Promise.all(pros)
        .then(any => loader.dismiss())
        .catch(err => loader.dismiss())
      
      }).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }

  ///////////////////////////////////////////////////////////////////////////////////
  /// LW
  ///////////////////////////////////////////////////////////////////////////////////

  async splitFileByLw(evt: any) {
    
    const subId = "lw";
    const catName = "2018 선재국어";
    let lecName = "외래어 DAY #";
    const ext = ".xlsx";
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
    let words = new Array<Array<Word>>();

    if(dt.files.length == 1) {
      const upData = await this.file_.uploadJson(dt.files[0]);
      let aa; // [][]
      let beforeLec = 0;

      for(let i=0; i<upData.length; i++) {
        const a = upData[i];  // []
        const currLec = a['day'];

        if(beforeLec != currLec) {
          if(i > 0) {
            words.push(this.excelData2WordOfSpSlLw(aa));
          }
          aa = new Array<Array<any>>();
          beforeLec = currLec;
        }

        aa.push(a);
        if(i == upData.length -1) {
          words.push(this.excelData2WordOfSpSlLw(aa));
        }
      }

      for(let i=0; i<words.length; i++) {
        const fileName = catName + "_" + lecName.replace("#", (i+1)+"") + ext;
        this.download(subId, fileName, words[i]);
      }
    }
  }

  createCatLecByLw() {
    
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    const subId = "lw";
    const catName = "2018 선재국어";
    let lecNames = [
      "DAY 1 - 외래어: 가~데",
      "DAY 2 - 외래어: 데~로",
      "DAY 3 - 외래어: 로~바",
      "DAY 4 - 외래어: 바~사",
      "DAY 5 - 외래어: 사~스",
      "DAY 6 - 외래어: 스~알",
      "DAY 7 - 외래어: 알~점",
      "DAY 8 - 외래어: 제~커",
      "DAY 9 - 외래어: 컨~클",
      "DAY 10 - 외래어: 클~펑",
      "DAY 11 - 외래어: 페~훌",
    ]
    let lecSize = 11;

    const catsRef = firebase.firestore().collection("subs").doc(subId).collection("cats");
    catsRef.get().then(querySnapshot => {
      const catsLength: number = querySnapshot.size;

      catsRef.add({
        name: catName,
        num: catsLength + 1,
        version: 1
      }).then(doc => {

        let pros = new Array<Promise<any>>();

        for(let i=1; i<=lecSize; i++) {
          const lec: object = {
            name: lecNames[i-1],
            num: i,
            version: 0
          }

          pros.push(doc.collection("lecs").add(lec));
        }

        Promise.all(pros)
        .then(any => loader.dismiss())
        .catch(err => loader.dismiss())
      
      }).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }

  ///////////////////////////////////////////////////////////////////////////////////
  /// KR
  ///////////////////////////////////////////////////////////////////////////////////

  async splitFileByKr(evt: any) {
    
    const subId = "kr";
    const catName = "2018 선재국어";
    let lecName = "어휘 DAY #";
    const ext = ".xlsx";
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
    let words = new Array<Array<Word>>();

    if(dt.files.length == 1) {
      const upData = await this.file_.uploadJson(dt.files[0]);
      let aa; // [][]
      let beforeLec = 0;

      for(let i=0; i<upData.length; i++) {
        const a = upData[i];  // []
        const currLec = a['day'];

        if(beforeLec != currLec) {
          if(i > 0) {
            words.push(this.excelData2WordOfKr(aa));
          }
          aa = new Array<Array<any>>();
          beforeLec = currLec;
        }

        aa.push(a);
        if(i == upData.length -1) {
          words.push(this.excelData2WordOfKr(aa));
        }
      }

      for(let i=0; i<words.length; i++) {
        const fileName = catName + "_" + lecName.replace("#", (i+1)+"") + ext;
        this.download(subId, fileName, words[i]);
      }
    }
  }

  private excelData2WordOfKr(datas: Array<Array<any>>): Array<Word> {
    let words = new Array<Word>();
    let word: Word;

    datas.forEach(data => {
      word = WordUtil.getNullWord();
      word.que  = this.convertData(data['meaning1']);
      word.me1  = this.convertData(data['meaning2']);
      word.me2  = this.convertData(data['meaning3']);
      word.me3  = this.convertData(data['meaning4']);
      word.me4  = this.convertData(data['meaning5']);
      word.me5  = this.convertData(data['meaning6']);
      word.me6  = this.convertData(data['meaning7']);
      word.me7  = this.convertData(data['word']);
      word.me8  = this.convertData(data['example1']);
      word.me9  = this.convertData(data['example2']);
      word.me10 = this.convertData(data['example3']);
      word.me11 = this.convertData(data['example4']);
      word.me12 = this.convertData(data['example5']);
      word.me13 = this.convertData(data['example6']);
      if(word.que != null) {
          words.push(word);
      }
    });

    return words;
  }

  createCatLecByKr() {
    
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    const subId = "kr";
    const catName = "2018 선재국어";
    let lecNames = [
      "DAY 1 - 단위: ㄱ",
      "DAY 2 - 단위: ㄱ~ㄷ",
      "DAY 3 - 단위: ㄷ~ㅁ",
      "DAY 4 - 단위: ㅁ~ㅂ",
      "DAY 5 - 단위: ㅅ~ㅈ",
      "DAY 6 - 단위: ㅈ~ㅋ",
      "DAY 7 - 단위: ㅋ~ㅍ",
      "DAY 8 - 단위/나이: ㅍ~이립",
      "DAY 9 - 나이: 이모~종심",
      "DAY 10 - 나이/신체: 희수~나룻",
      "DAY 11 - 사람의 신체: 단전~잔허리",
      "DAY 11 - 사람의 신체/사람: 장딴지~감바리",
      "DAY 12 - 사람: 강원도 포수~궐공",
      "DAY 14 - 사람: 깎은서방님~된서방",
      "DAY 15 - 사람: 두루뭉수리~모도리",
      "DAY 16 - 사람: 모리배~밥주머니",
      "DAY 17 - 사람: 방망이꾼~시골고라리",
      "DAY 18 - 사람: 시러베아들~얼간이",
      "DAY 19 - 사람: 얼렁쇠~자치동갑",
      "DAY 20 - 사람: 책상물림~호사가",
      "DAY 21 - 사람: 홀앗이~넝마주이",
      "DAY 22 - 사람: 더부살이~삐리",
      "DAY 23 - 길: 가풀막~노루목",
      "DAY 24 - 길: 도린곁~후미",
      "DAY 25 - 날씨: 갈마바람~명지바람",
      "DAY 26 - 날씨: 살바람~흔들바람",
      "DAY 27 - 날씨: 개부심~억수",
      "DAY 28 - 날씨: 여우비~숫눈",
      "DAY 29 - 날씨: 자국눈~강추위",
      "DAY 30 - 날씨: 강추위~햇무리", 
    ]
    let lecSize = 30;

    const catsRef = firebase.firestore().collection("subs").doc(subId).collection("cats");
    catsRef.get().then(querySnapshot => {
      const catsLength: number = querySnapshot.size;

      catsRef.add({
        name: catName,
        num: catsLength + 1,
        version: 1
      }).then(doc => {

        let pros = new Array<Promise<any>>();

        for(let i=1; i<=lecSize; i++) {
          const lec: object = {
            name: lecNames[i-1],
            num: i,
            version: 0
          }

          pros.push(doc.collection("lecs").add(lec));
        }

        Promise.all(pros)
        .then(any => loader.dismiss())
        .catch(err => loader.dismiss())
      
      }).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }

  ///////////////////////////////////////////////////////////////////////////////////
  /// CC
  ///////////////////////////////////////////////////////////////////////////////////

  async splitFileByCc(evt: any) {
    
    const subId = "cc";
    const catName = "2018 선재국어";
    let lecName = "한자 DAY #";
    const ext = ".xlsx";
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
    let words = new Array<Array<Word>>();

    if(dt.files.length == 1) {
      const upData = await this.file_.uploadJson(dt.files[0]);
      let aa; // [][]
      let beforeLec = 0;

      for(let i=0; i<upData.length; i++) {
        const a = upData[i];  // []
        const currLec = a['day'];

        if(beforeLec != currLec) {
          if(i > 0) {
            words.push(this.excelData2WordOfCc(aa));
          }
          aa = new Array<Array<any>>();
          beforeLec = currLec;
        }

        aa.push(a);
        if(i == upData.length -1) {
          words.push(this.excelData2WordOfCc(aa));
        }
      }

      for(let i=0; i<words.length; i++) {
        const fileName = catName + "_" + lecName.replace("#", (i+1)+"") + ext;
        this.download(subId, fileName, words[i]);
      }
    }
  }

  private excelData2WordOfCc(datas: Array<Array<any>>): Array<Word> {
    let words = new Array<Word>();
    let word: Word;

    datas.forEach(data => {
      word = WordUtil.getNullWord();
      word.que  = this.convertData(data['word']);
      word.me1  = this.convertData(data['content']);
      word.me2  = this.convertData(data['content1']);
      word.me3  = this.convertData(data['content2']);
      word.me4  = this.convertData(data['content3']);
      word.me5  = this.convertData(data['content4']);
      word.me6  = this.convertData(data['meaning1']);
      word.me7  = this.convertData(data['meaning2']);
      word.me8  = this.convertData(data['meaning3']);
      word.me9  = this.convertData(data['meaning4']);
      word.me10 = this.convertData(data['example1']);
      word.me11 = this.convertData(data['example2']);
      word.me12 = this.convertData(data['example3']);
      word.me13 = this.convertData(data['example4']);
      word.syn = this.convertData(data['synonym']);
      word.ant = this.convertData(data['antonym']);
      if(word.que != null) {
          words.push(word);
      }
    });

    return words;
  }

  createCatLecByCc() {
    
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    const subId = "cc";
    const catName = "2018 선재국어";
    let lecNames = [
      "DAY 1 - 가~강",
      "DAY 2 - 강~결",
      "DAY 3 - 결~고",
      "DAY 4 - 고~괘",
      "DAY 5 - 괴~근",
      "DAY 6 - 근~낙",
      "DAY 7 - 난~능",
      "DAY 8 - 능~독",
      "DAY 9 - 독~맹",
      "DAY 10 - 맹~문",
      "DAY 11 - 문~반",
      "DAY 11 - 발~복",
      "DAY 12 - 복~비",
      "DAY 14 - 비~상",
      "DAY 15 - 상~소",
      "DAY 16 - 소~슬",
      "DAY 17 - 습~안",
      "DAY 18 - 알~예",
      "DAY 19 - 오~유",
      "DAY 20 - 유~입",
      "DAY 21 - 입~적",
      "DAY 22 - 전~조",
      "DAY 23 - 조~지",
      "DAY 24 - 지~참",
      "DAY 25 - 참~촉",
      "DAY 26 - 총~탈",
      "DAY 27 - 탐~패",
      "DAY 28 - 패~하",
      "DAY 29 - 학~혜",
      "DAY 30 - 호~힐", 
    ]
    let lecSize = 30;

    const catsRef = firebase.firestore().collection("subs").doc(subId).collection("cats");
    catsRef.get().then(querySnapshot => {
      const catsLength: number = querySnapshot.size;

      catsRef.add({
        name: catName,
        num: catsLength + 1,
        version: 1
      }).then(doc => {

        let pros = new Array<Promise<any>>();

        for(let i=1; i<=lecSize; i++) {
          const lec: object = {
            name: lecNames[i-1],
            num: i,
            version: 0
          }

          pros.push(doc.collection("lecs").add(lec));
        }

        Promise.all(pros)
        .then(any => loader.dismiss())
        .catch(err => loader.dismiss())
      
      }).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }

  ///////////////////////////////////////////////////////////////////////////////////
  /// C4
  ///////////////////////////////////////////////////////////////////////////////////

  async splitFileByC4(evt: any) {
    
    const subId = "c4";
    const catName = "2018 선재국어";
    let lecName = "한자성어 DAY #";
    const ext = ".xlsx";
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
    let words = new Array<Array<Word>>();

    if(dt.files.length == 1) {
      const upData = await this.file_.uploadJson(dt.files[0]);
      let aa; // [][]
      let beforeLec = 0;

      for(let i=0; i<upData.length; i++) {
        const a = upData[i];  // []
        const currLec = a['day'];

        if(beforeLec != currLec) {
          if(i > 0) {
            words.push(this.excelData2WordOfC4(aa));
          }
          aa = new Array<Array<any>>();
          beforeLec = currLec;
        }

        aa.push(a);
        if(i == upData.length -1) {
          words.push(this.excelData2WordOfC4(aa));
        }
      }

      for(let i=0; i<words.length; i++) {
        const fileName = catName + "_" + lecName.replace("#", (i+1)+"") + ext;
        this.download(subId, fileName, words[i]);
      }
    }
  }

  private excelData2WordOfC4(datas: Array<Array<any>>): Array<Word> {
    let words = new Array<Word>();
    let word: Word;

    datas.forEach(data => {
      word = WordUtil.getNullWord();
      word.que  = this.convertData(data['chengyu']);
      word.me1  = this.convertData(data['content']);
      word.me2  = this.convertData(data['content1']);
      word.me3  = this.convertData(data['content2']);
      word.me4  = this.convertData(data['content3']);
      word.me5  = this.convertData(data['content4']);
      word.me6  = this.convertData(data['content5']);
      word.me7  = this.convertData(data['content6']);
      word.me8  = this.convertData(data['description']);
      word.me9  = this.convertData(data['description_synonym']);
      word.me10 = this.convertData(data['description_antonym']);
      if(word.que != null) {
          words.push(word);
      }
    });

    return words;
  }

  createCatLecByC4() {
    
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    const subId = "c4";
    const catName = "2018 선재국어";
    let lecNames = [
       "DAY 1 - 가~개",
       "DAY 2 - 개~경",
       "DAY 3 - 경~공",
       "DAY 4 - 공~군",
       "DAY 5 - 권~남",
       "DAY 6 - 남~당",
       "DAY 7 - 대~두",
       "DAY 8 - 득~망",
       "DAY 9 - 맥~문",
      "DAY 10 - 문~배",
      "DAY 11 - 백~분",
      "DAY 11 - 분~사",
      "DAY 12 - 사~상",
      "DAY 14 - 새~수",
      "DAY 15 - 수~안",
      "DAY 16 - 안~여",
      "DAY 17 - 여~온",
      "DAY 18 - 와~원",
      "DAY 19 - 월~이",
      "DAY 20 - 이~일",
      "DAY 21 - 일~자",
      "DAY 22 - 장~정",
      "DAY 23 - 정~주",
      "DAY 24 - 죽~천",
      "DAY 25 - 천~초",
      "DAY 26 - 초~탁",
      "DAY 27 - 태~풍",
      "DAY 28 - 풍~현",
      "DAY 29 - 혈~혼",
      "DAY 30 - 홍~희", 
    ]
    let lecSize = 30;

    const catsRef = firebase.firestore().collection("subs").doc(subId).collection("cats");
    catsRef.get().then(querySnapshot => {
      const catsLength: number = querySnapshot.size;

      catsRef.add({
        name: catName,
        num: catsLength + 1,
        version: 1
      }).then(doc => {

        let pros = new Array<Promise<any>>();

        for(let i=1; i<=lecSize; i++) {
          const lec: object = {
            name: lecNames[i-1],
            num: i,
            version: 0
          }

          pros.push(doc.collection("lecs").add(lec));
        }

        Promise.all(pros)
        .then(any => loader.dismiss())
        .catch(err => loader.dismiss())
      
      }).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }

  ///////////////////////////////////////////////////////////////////////////////////
  /// EW
  ///////////////////////////////////////////////////////////////////////////////////

  async splitFileByEw(evt: any) {
    
    const subId = "ew";
    const catName = "2018 기적의 영단어";
    let lecName = "DAY #";
    const ext = ".xlsx";
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
    let words = new Array<Array<Word>>();

    if(dt.files.length == 1) {
      const upData = await this.file_.uploadJson(dt.files[0]);
      let aa; // [][]
      let beforeLec = 0;

      for(let i=0; i<upData.length; i++) {
        const a = upData[i];  // []
        const currLec = a['day'];

        if(beforeLec != currLec) {
          if(i > 0) {
            words.push(this.excelData2WordOfEw(aa));
          }
          aa = new Array<Array<any>>();
          beforeLec = currLec;
        }

        aa.push(a);
        if(i == upData.length -1) {
          words.push(this.excelData2WordOfEw(aa));
        }
      }

      for(let i=0; i<words.length; i++) {
        const fileName = catName + "_" + lecName.replace("#", (i+1)+"") + ext;
        this.download(subId, fileName, words[i]);
      }
    }
  }

  private excelData2WordOfEw(datas: Array<Array<any>>): Array<Word> {
    let words = new Array<Word>();
    let word: Word;

    datas.forEach(data => {
      word = WordUtil.getNullWord();
      word.que  = this.convertData(data['word']);
      word.me1  = this.convertData(data['meaning_type1']);
      word.me2  = this.convertData(data['meaning_value1']);
      word.me3  = this.convertData(data['meaning_type2']);
      word.me4  = this.convertData(data['meaning_value2']);
      word.me5  = this.convertData(data['example_phrase']);
      word.me6  = this.convertData(data['example_meaning']);
      if(word.que != null) {
          words.push(word);
      }
    });

    return words;
  }

  createCatLecByEw() {

    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    const subId = "ew";
    const catName = "2018 기적의 영단어";
    let lecName = "DAY #";
    let lecSize = 100;

    const catsRef = firebase.firestore().collection("subs").doc(subId).collection("cats");
    catsRef.get().then(querySnapshot => {
      const catsLength: number = querySnapshot.size;

      catsRef.add({
        name: catName,
        num: catsLength + 1,
        version: 1
      }).then(doc => {

        let pros = new Array<Promise<any>>();

        for(let i=1; i<=lecSize; i++) {
          const lec: object = {
            name: lecName.replace("#", ""+i),
            num: i,
            version: 0
          }

          pros.push(doc.collection("lecs").add(lec));
        }

        Promise.all(pros)
        .then(any => loader.dismiss())
        .catch(err => loader.dismiss())
      
      }).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }

  ///////////////////////////////////////////////////////////////////////////////////

  download(subId: string, fileName: string, words: Array<Word>): void {
    let datas = WordUtil.word2ExcelData(subId, words);
    this.file_.export(fileName, datas);
  }

  private convertData(data): string {
    let result: string = data;

    if(data == null || data == undefined) {
      result = null;
    } else if(result.isEmpty()) {
      result = result.trim();
    } else if(result.startsWith("-") 
              || result.startsWith("+")
              || result.startsWith("=")) {
      result = " " + result;
    }

    return result;
  } 

}

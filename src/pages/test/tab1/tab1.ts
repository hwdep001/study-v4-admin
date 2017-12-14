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

  async splitFileByEw(evt: any) {
    
    const subId = "ew";
    const catName = "2018 기적의 영단어";
    let lecName = "DAY #";
    const ext = ".xlsx";
    
    const dt: DataTransfer = <DataTransfer>(evt.target);
    let words = new Array<Array<Word>>();

    if(dt.files.length == 1) {
      const upData = await this.file_.uploadExcel(dt.files[0]);
      let aa; // [][]
      let beforeLec = 0;

      for(let i=0; i<upData.length; i++) {
        const a = upData[i];  // []
        if(beforeLec != a[1]) {
          if(i > 0) {
            words.push(this.excelData2WordOfEw(aa));
          }
          aa = new Array<Array<any>>();
          beforeLec = a[1];
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

  createCatLec() {

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

  async splitFileByLSJ(evt: any) {
    
    // const dt: DataTransfer = <DataTransfer>(evt.target);
            
    // if(dt.files.length == 1) {
    //   const datas = await this.file_.uploadExcel(dt.files[0]);
    //   this.words_.pushArray(WordUtil.excelData2Word(this.sub.id, datas));
    // } else {
    //   // this.words_ = [];
    //   // this.fileName = null;
    // }   
  }

  download(subId: string, fileName: string, words: Array<Word>): void {
    let datas = WordUtil.word2ExcelData(subId, words);
    this.file_.export(fileName, datas);
  }

  ///////////////////////////////////////////////////////////////////////////////////
  
  private excelData2WordOfEw(datas: Array<Array<any>>): Array<Word> {
    let words = new Array<Word>();
    let word: Word;

    datas.forEach(data => {
      word = WordUtil.getNullWord();
      word.que = data[3] == undefined? null: data[3];
      word.me1 = data[4] == undefined? null: data[4];
      word.me2 = data[5] == undefined? null: data[5];
      word.me3 = data[6] == undefined? null: data[6];
      word.me4 = data[7] == undefined? null: data[7];
      word.me5 = data[8] == undefined? null: data[8];
      word.me6 = data[9] == undefined? null: data[9];
      if(word.que != null) {
          words.push(word);
      }
    });

    return words;
  }

}

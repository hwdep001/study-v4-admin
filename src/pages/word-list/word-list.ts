// import { Component } from '@angular/core';
// import { NavParams } from 'ionic-angular';

// import { DBHelper } from './../../providers/db-helper';
// import { TestService } from './../../providers/test-service';

// import { Word } from './../../models/Word';
// import { WordSearch } from './../../models/WordSearch';

// @Component({
//   selector: 'page-wordList',
//   templateUrl: 'word-list.html'
// })
// export class WordListPage {

//   words: Array<Word>;
//   ws: WordSearch;
//   title: string;

//   constructor(
//     private param: NavParams,
//     private dbHelper: DBHelper,
//     private test_: TestService
//   ) {
//     this.initData();
//   }

//   initData(): void {
//     this.ws = this.param.get("wordSearch");
//     this.setTitle();
//     this.getWords();
//   }

//   setTitle(): void {
//     if(this.ws.lecIds.length > 1) {
//       this.title = this.ws.cat.name;
//     } else {
//       this.title = this.ws.lec.name;
//     }
//   }

//   getWords(): void {
//     if(this.dbHelper.isCordova) {
//       this.dbHelper.selectBySearchForWord(this.ws.lecIds, 
//           this.ws.levIds, this.ws.count, false).then(items => {

//         this.words = items;
//       });
//     } else {
//       this.words = this.test_.selectAllWordByLecId(this.ws.lecIds);
//     }
//   }

// }
// sp, sl, lw
// question text not null, 
// choice1 text not null, 
// choice2 text not null, 
// answer text not null, 

// kr
// meaning1 text not null,
// meaning2 text, 
// meaning3 text, 
// meaning4 text, 
// meaning5 text, 
// meaning6 text, 
// meaning7 text, 
// word text not null, 
// example1 text, 
// example2 text, 
// example3 text, 
// example4 text, 
// example5 text, 
// example6 text

// cc
// word text not null, 
// content text not null, 
// content1 text, 
// content2 text, 
// content3 text, 
// content4 text, 
// meaning1 text not null, 
// meaning2 text, 
// meaning3 text, 
// meaning4 text, 
// example1 text, 
// example2 text, 
// example3 text, 
// example4 text, 
// synonym text, 
// antonym text


// c4
// chengyu text not null, 
// content text not null, 
// content1 text not null, 
// content2 text not null, 
// content3 text not null, 
// content4 text, 
// content5 text, 
// content6 text, 
// description text not null, 
// description_synonym text, 
// description_antonym text

// ew
// word
// meaning_type1
// meaning_value1
// meaning_type2
// meaning_value2
// example_phrase
// example_meaning
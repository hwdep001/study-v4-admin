import { Word } from './../models/Word';

export class WordUtil {

    public static word2Object(word: Word): object {
        let result = this.getNullObject();
        Object.keys(word).map(key => {

            if(key == "num") {
                result[key] = word[key];
            } else {
                result[key] = this.isEmpty(word[key]);
            }
        });
        return result;
    }

    public static object2Word(data: any): Word {
        let result = this.getNullWord();
        Object.keys(data).map(key => result[key] = data[key]);
        return result;
    }

    public static equals(a: Word, b: any) {
        if(a == null || b == null) return false;
        if(a.num != b.num) return false;
        if(a.que != b.que) return false;
        if(a.me1 != b.me1) return false;
        if(a.me2 != b.me2) return false;
        if(a.me3 != b.me3) return false;
        if(a.me4 != b.me4) return false;
        if(a.me5 != b.me5) return false;
        if(a.me6 != b.me6) return false;
        if(a.me7 != b.me7) return false;
        if(a.me8 != b.me8) return false;
        if(a.me9 != b.me9) return false;
        if(a.me10 != b.me10) return false;
        if(a.me11 != b.me11) return false;
        if(a.me12 != b.me12) return false;
        if(a.me13 != b.me13) return false;
        if(a.syn != b.syn) return false;
        if(a.ant != b.ant) return false;
        return true;
    }

    private static getNullWord(): Word {
        let word = new Word(); 
        word.num = null;
        word.que = null;
        word.me1 = null;
        word.me2 = null;
        word.me3 = null;
        word.me4 = null;
        word.me5 = null;
        word.me6 = null;
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

    private static getNullObject(): object {
        let result = {};
        const nullWord = this.getNullWord();
        Object.keys(nullWord).map(key => result[key] = nullWord[key]);
        return result;
    }

    private static isEmpty(data: any): string {
        let result: string = data;

        if(result != null) {
            result = result.isEmpty() ? null : result;
        }

        return result;
    }


    /////////////////////////////////////////////////////////////////////

    public static excelData2Word(subId: string, datas: Array<Array<any>>): Array<Word> {
        let result: Array<Word>;
        
        switch(subId) {
            case "ew":
                result = this.excelData2WordOfEw(datas);
                break;
        }
    
        return result;
    }

    private static excelData2WordOfEw(datas: Array<Array<any>>): Array<Word> {
        let words = new Array<Word>();
        let word: Word;
        let headerFlag = true;

        datas.forEach(data => {
            if(!headerFlag) {
                word = this.getNullWord();
                word.que = data[0] == undefined? null: data[0];
                word.me1 = data[1] == undefined? null: data[1];
                word.me2 = data[2] == undefined? null: data[2];
                word.me3 = data[3] == undefined? null: data[3];
                word.me4 = data[4] == undefined? null: data[4];
                word.me5 = data[5] == undefined? null: data[5];
                word.me6 = data[6] == undefined? null: data[6];
                words.push(word);
            } else {
                headerFlag = false;
            }
        });

        return words;
    }

    //////////////////////////////////////////////////////////////////////////////

    public static word2ExcelData(subId: string, words: Array<Word>): Array<Array<any>> {
        let result: Array<Array<any>>;
        
        switch(subId) {
            case "ew":
                result = this.word2ExcelDataOfEw(words);
                break;
        }
    
        return result;
    }

    private static word2ExcelDataOfEw(words: Array<Word>): Array<Array<any>> {
        let datas = new Array<Array<any>>();
        let data: Array<any>;
        let header = new Array<any>();
        header.push("word");
        header.push("meaning_type1");
        header.push("meaning_value1");
        header.push("meaning_type2");
        header.push("meaning_value2");
        header.push("example_phrase");
        header.push("example_meaning");
        datas.push(header);

        words.forEach(word => {
            data = new Array<any>();
            
            data.push(word.que);
            data.push(word.me1);
            data.push(word.me2);
            data.push(word.me3);
            data.push(word.me4);
            data.push(word.me5);
            data.push(word.me6);
            datas.push(data);
        });

        return datas;
    }
}
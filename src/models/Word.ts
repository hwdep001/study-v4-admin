import { EwWord } from './EwWord';
export class Word {
    id?: string;
    num?: number;

    que?: string;
    me1?: string;
    me2?: string;
    me3?: string;
    me4?: string;
    me5?: string;
    me6?: string;
    me7?: string;
    me8?: string;
    me9?: string;
    me10?: string;
    me11?: string;
    me12?: string;
    me13?: string;
    syn?: string;
    ant?: string;

    public static getWordByEw(ew: EwWord): Word {
        let w = new Word();
        w.num = ew.num;
        
        w.que = ew.word;
        w.me1 = ew.meaning_type1;
        w.me2 = ew.meaning_value1;
        w.me3 = ew.meaning_type2;
        w.me4 = ew.meaning_value2;
        w.me5 = ew.example_phrase;
        w.me6 = ew.example_meaning;
        w.me7 = null;
        w.me8 = null;
        w.me9 = null;
        w.me10 = null;
        w.me11 = null;
        w.me12 = null;
        w.me13 = null;
        w.syn = null;
        w.ant = null;

        return w;
    }
}
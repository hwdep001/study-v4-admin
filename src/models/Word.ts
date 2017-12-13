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

    public static equals(a: Word, b: Word) {
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
}
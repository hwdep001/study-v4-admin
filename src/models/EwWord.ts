export class EwWord {
    word?: string;
    meaning_type1?: string;
    meaning_value1?: string;
    meaning_type2?: string;
    meaning_value2?: string;
    example_phrase?: string;
    example_meaning?: string;

    id?: string;
    num?: number;

    constructor(
        word: string, 
        meaning_type1: string, 
        meaning_value1: string, 
        meaning_type2: string, 
        meaning_value2: string, 
        example_phrase: string, 
        example_meaning: string) {

        this.word = word.trimToNull();
        this.meaning_type1 = meaning_type1.trimToNull();
        this.meaning_value1 = meaning_value1.trimToNull();
        this.meaning_type2 = meaning_type2.trimToNull();
        this.meaning_value2 = meaning_value2.trimToNull();
        this.example_phrase = example_phrase.trimToNull();
        this.example_meaning = example_meaning.trimToNull();
    }
}
import { Component } from '@angular/core';

import { Tab1Page } from './tab1/tab1';
import { Tab2Page } from './tab2/tab2';

@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  tab1Root: any = Tab1Page;
  tab2Root: any = Tab2Page;

  constructor() {
  }

}

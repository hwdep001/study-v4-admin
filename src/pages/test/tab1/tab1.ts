import { Component } from '@angular/core';

import * as firebase from 'firebase';

import { CommonService } from './../../../providers/common-service';

@Component({
  selector: 'page-tab1',
  templateUrl: 'tab1.html'
})
export class Tab1Page {

  constructor(
    private cmn_: CommonService
  ) {
  }

  
}

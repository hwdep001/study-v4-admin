import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../providers/common-service';

import { User } from '../../models/User';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  user: User;

  constructor(
    public navCtrl: NavController,
    private cmn_: CommonService
  ) {
    this.user = cmn_.user;
  }

  signOut() {
    firebase.auth().signOut();
  }

}

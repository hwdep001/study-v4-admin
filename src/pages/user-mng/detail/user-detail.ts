import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

import * as firebase from 'firebase/app';

import { CommonService } from './../../../providers/common-service';
import { CommonUtil } from '../../../utils/commonUtil';

import { User } from './../../../models/User';

import { UserPhotoPage } from './../photo/user-photo';

@Component({
  selector: 'page-userDetail',
  templateUrl: 'user-detail.html'
})
export class UserDetailPage {

  userRef: firebase.firestore.DocumentReference;
  user: User = new User();

  constructor(
    public navCtrl: NavController,
    private param: NavParams,
    private alertCtrl: AlertController,
    private cmn_: CommonService,
  ) {
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    const uid = this.param.get('uid');
    this.userRef = firebase.firestore().collection("users").doc(uid);
    this.getUser().then(any => loader.dismiss()).catch(err => loader.dismiss());
  }

  getUser(): Promise<any> {
    return this.userRef.get().then(doc => {
      if(doc.exists) {
        this.user = CommonUtil.object2User(doc.data());
      }
    });
  }

  clickSignOutBtn(): void {
    firebase.auth().signOut();
  }

  showUserPhoto(photoURL: string): void {
    this.navCtrl.push(UserPhotoPage, {photoURL: photoURL});
  }

  changeAuth(): void {
    this.presentRadioAlert(null, "인증 상태", this.user.isAuth).then(data => {

      if(this.user.isAuth == data) {
        return;
      }
      
      const loader = this.cmn_.getLoader(null, null);
      loader.present();

      this.userRef.update({isAuth: data}).then(any => {
        this.cmn_.Toast.present("top", "수정하였습니다.", "toast-success");
        this.getUser().then(any => loader.dismiss()).catch(err => loader.dismiss());
      }).catch(err => loader.dismiss());
    });
  }

  changeDel(): void {
    this.presentRadioAlert(null, "isDel", this.user.isDel).then(data => {
      
      if(this.user.isDel == data) {
        return;
      }
      
      const loader = this.cmn_.getLoader(null, null);
      loader.present();

      this.userRef.update({isDel: data}).then(any => {
        this.cmn_.Toast.present("top", "수정하였습니다.", "toast-success");
        this.getUser().then(any => loader.dismiss()).catch(err => loader.dismiss());
      }).catch(err => loader.dismiss());
    });
  }

  presentRadioAlert(message: string, title: string, defaultValue: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let radio = this.alertCtrl.create({
        title: title,
        message: message,
        inputs: [
          {
            type: 'radio',
            label: '승인',
            value: 'true',
            checked: defaultValue ? true : false
          },
          {
            type: 'radio',
            label: '대기',
            value: 'false',
            checked: defaultValue ? false : true
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              reject();
            }
          },
          {
            text: 'Select',
            handler: data => {
              resolve(data == "true" ? true: false);
            }
          }
        ]
      });
      radio.present();
    });
  }
}

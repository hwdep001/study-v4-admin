import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';

import { CommonService } from './../../providers/common-service';

import { User } from './../../models/User';

import { UserPhotoPage } from './photo/user-photo';
import { UserDetailPage } from './detail/user-detail';

@Component({
  selector: 'page-userMng',
  templateUrl: 'user-mng.html'
})
export class UserMngPage {

  userRef: firebase.firestore.CollectionReference;
  
  users: Array<User>;
  loadedUsers: Array<User>;

  searchClicked: boolean = false;

  constructor(
    public navCtrl: NavController,
    private cmn_: CommonService
  ) {
    const loader = this.cmn_.getLoader(null, null);
    loader.present();

    this.userRef = firebase.firestore().collection("users");
    this.getUsers().then(any => loader.dismiss()).catch(err => loader.dismiss());
  }

  getUsers(): Promise<any> {
    return this.userRef.orderBy("displayName").get().then(querySnapshot => {
      let users = new Array<any>();
      querySnapshot.forEach(doc => {
        users.push(doc.data());
      });

      this.loadedUsers = users;
      this.initializeUsers();
    });
  }

  initializeUsers(): void {
    this.users = this.loadedUsers;
  }

  search(ev: any): void {
    // Reset items back to all of the items
    this.initializeUsers();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.users = this.users.filter((item) => {
        return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1 
          || item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  clearSearch(ev: any): void {
    ev.target.value = null;
  }

  cancelSearch(): void {
    this.searchClicked = false;
    this.initializeUsers();
  }

  showUserPhoto(photoURL: string): void {
    this.navCtrl.push(UserPhotoPage, {photoURL: photoURL});
  }

  showUserInfo(uid: string): void {
    this.navCtrl.push(UserDetailPage, {uid: uid});
  }

  deleteUser(uid: string): void {
    this.cmn_.Alert.confirm(`사용자(${uid})를 삭제하시겠습니까?`, "사용자 삭제")
    .then(any => {
      const loader = this.cmn_.getLoader(null, null);
      loader.present();

      this.userRef.doc(uid).delete().then(any => {
        this.cmn_.Toast.present("top", `사용자(${uid})를 삭제하였습니다.`, "toast-success");
        this.getUsers().then(any => loader.dismiss()).catch(err => loader.dismiss());
      }).catch(err => loader.dismiss());
    });
  }

}

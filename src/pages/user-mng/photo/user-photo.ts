import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-userPhoto',
  templateUrl: 'user-photo.html'
})
export class UserPhotoPage {

  photoURL: string;

  constructor(
    public navCtrl: NavController,
    private param: NavParams,
  ) {
    this.photoURL = this.param.get('photoURL');
  }

  closePhoto(): void {
    this.navCtrl.pop();
  }
}

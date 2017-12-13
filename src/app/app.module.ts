import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite'
import { MyApp } from './app.component';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// environments
import { environment } from './../environments/environment';

// providers
import { CommonService } from './../providers/common-service';
import { FileService } from './../providers/file-service';
import { TestService } from './../providers/test-service';

// pages
import { SigninPage } from './../pages/signin/signin';
import { HomePage } from './../pages/home/home';
import { TestPage } from './../pages/test/test';
  import { Tab1Page } from './../pages/test/tab1/tab1';
import { CatListPage } from './../pages/cat-list/cat-list';
import { LecListPage } from './../pages/lec-list/lec-list';
import { EwListPage } from './../pages/word-list/ew-list/ew-list';
import { SettingPage } from './../pages/setting/setting';

  
@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    HomePage,
    TestPage,
      Tab1Page,
    CatListPage,
    LecListPage,
    EwListPage,
    SettingPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'top'}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    HomePage,
    TestPage,
      Tab1Page,
    CatListPage,
    LecListPage,
    EwListPage,
    SettingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonService,
    FileService,
    TestService
  ]
})
export class AppModule {}

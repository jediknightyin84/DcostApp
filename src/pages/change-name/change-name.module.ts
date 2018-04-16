import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeNamePage } from './change-name';

@NgModule({
  declarations: [
    ChangeNamePage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeNamePage),
  ],
})
export class ChangeNamePageModule {}

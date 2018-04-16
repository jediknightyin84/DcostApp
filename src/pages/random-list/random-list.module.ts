import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RandomListPage } from './random-list';

@NgModule({
  declarations: [
    RandomListPage,
  ],
  imports: [
    IonicPageModule.forChild(RandomListPage),
  ],
})
export class RandomListPageModule {}

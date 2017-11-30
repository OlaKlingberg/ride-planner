import { NgModule } from '@angular/core';

import { AlertComponent } from '../alert/alert.component';
import { AlertModule } from '../alert/alert.module';
import { DeviceSizeModule } from '../device-size/device-size.module';
import { FooterComponent } from '../footer/footer.component';
import { FooterModule } from '../footer/footer.module';
import { HeaderComponent } from '../header/header.component';
import { HeaderModule } from '../header/header.module';
import { NavComponent } from '../nav/nav.component';
import { NavModule } from '../nav/nav.module';

@NgModule({
  imports: [
    AlertModule,
    DeviceSizeModule,
    FooterModule,
    HeaderModule,
    NavModule
  ],
  declarations: [],
  exports: [
    AlertComponent,
    FooterComponent,
    HeaderComponent,
    NavComponent
  ]
})
export class PageElementsModule {
}

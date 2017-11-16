import { NgModule } from '@angular/core';
import { HeaderModule } from '../header/header.module';
import { NavModule } from '../nav/nav.module';
import { HeaderComponent } from '../header/header.component';
import { NavComponent } from '../nav/nav.component';
import { AlertModule } from '../alert/alert.module';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { FooterModule } from '../footer/footer.module';
import { DeviceSizeModule } from '../device-size/device-size.module';

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

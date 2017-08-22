import { NgModule } from '@angular/core';
import { ProtectedComponent } from './protected.component';
import { ProtectedRoutingModule } from './protected-routing.module';

@NgModule({
  imports: [
      ProtectedRoutingModule
  ],
  declarations: [
    ProtectedComponent
  ],
  exports: [],
  providers: [],
})
export class ProtectedModule {
}
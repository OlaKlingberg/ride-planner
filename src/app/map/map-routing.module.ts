import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: MapComponent
    }
  ])],
  exports: []
})
export class MapRoutingModule { }

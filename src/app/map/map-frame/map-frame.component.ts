import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  templateUrl: './map-frame.component.html',
  styleUrls: ['./map-frame.component.scss']
})
export class MapFrameComponent  {
  url: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('map');
  }
}

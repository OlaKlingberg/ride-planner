import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

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

import { Component } from '@angular/core';
import { LoaderService } from '../loader.service';
import { MatSnackBar } from '@angular/material';
import { HttpEventType } from '@angular/common/http';

@Component({
  templateUrl: './load.component.html'
})
export class LoadComponent {
  imgPreview: any[] = [];
  files: File[] = [];
  file: File;

  constructor(public snackBar: MatSnackBar, public loaderService: LoaderService) {}
 
  load(files: File[]) {
    if (files.length === 0) return;
    this.file = files[0];
  }

  upload() {
    this.loaderService.load(this.file).subscribe(event => {
      if(event.type === HttpEventType.Response) {
        console.log(event.body);
      }
    });
  }
}


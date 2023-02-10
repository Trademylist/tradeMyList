import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
export interface FileHandle {
  file: File,
  url: SafeUrl
}

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  constructor(private sanitizer: DomSanitizer) { }
  @HostBinding('class.fileover') fileOver: boolean;
  @Output() fileDropped = new EventEmitter<any>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {

    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    let files: FileHandle[] = [];
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      const file = evt.dataTransfer.files[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push({ file, url });
    }
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }

    // evt.preventDefault();
    // evt.stopPropagation();
    // this.fileOver = false;
    // let files = evt.dataTransfer.files;
    // if (files.length > 0) {
    //   this.fileDropped.emit(files);
    // }
  }
}

import { Component, OnInit, EventEmitter, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls:['./dialog.component.scss']
})
export class DialogComponent {

  @Input() title="";
  @Input() message="";
  onOk = new EventEmitter();
  onCancel = new EventEmitter();
  private backdrop: HTMLElement;
  style: any;

  constructor( @Inject(DOCUMENT) private document: Document) { }

  okClicked() {
    this.onOk.emit();
  }

  cancelClicked() {
    this.onCancel.emit();
  }

  show(title:string, message:string) {
    this.title = title;
    this.message = message;
    this.document.body.classList.add('modal-open');
    this.style = { 'display': 'block' };
    this.showBackdrop();
  }

  hide() {
    this.document.body.classList.remove('modal-open');
    this.style = { 'display': 'none' };
    this.hideBackdrop();
  }

  showBackdrop() {
    this.backdrop = this.document.createElement('div');
    this.backdrop.classList.add('modal-backdrop');
    this.backdrop.classList.add('show');
    this.document.body.appendChild(this.backdrop);
  }

  hideBackdrop() {
    this.backdrop.remove();
  }

}
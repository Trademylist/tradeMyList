import { DialogComponent } from './dialog.component';

export class DialogService {

  title="Confirm";
  message="Are you sure?";
  public registeredDialog: DialogComponent;

  register(dialog: DialogComponent) {
    console.log(dialog);
    this.registeredDialog = dialog;
  }

  show(title=this.title, message=this.message) {
    return new Promise((resolve, reject) => {

     
      this.registeredDialog.show(title, message);
      this.registeredDialog.onOk.subscribe(() => {
        this.registeredDialog.hide();
        resolve();
      });
      this.registeredDialog.onCancel.subscribe(() => {
        this.registeredDialog.hide();
        reject();
      });

    });
  }

}
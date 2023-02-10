import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-commercial-product',
  templateUrl: './add-commercial-product.component.html',
  styleUrls: ['./add-commercial-product.component.scss']
})
export class AddCommercialProductComponent implements OnInit {

  coverImage: any[] = [];
  additionalImages: any[] = [];
  constructor() {
    window.scroll(0,0);
   }

  ngOnInit(): void {
  }



  /**
   * on file drop handler
   */
  onCoverImageFileDropped($event) {
    this.prepareCoverImageFilesList($event);
  }
  onAdditionalImagesFileDropped($event) {
    this.prepareAdditionalImagesFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileCoverImageBrowseHandler(files) {
    this.prepareCoverImageFilesList(files);
  }
  fileAdditionalImagesBrowseHandler(files) {
    this.prepareAdditionalImagesFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteCoverImageFile(index: number) {
    this.coverImage.splice(index, 1);
  }

  deleteAdditionalImagesFile(index: number) {
    this.additionalImages.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.additionalImages.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.additionalImages[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.additionalImages[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareCoverImageFilesList(files: Array<any>) {
    this.coverImage = [];
    let item = files[0];
    item.process = 0;
    this.coverImage.push(item);
    // for (const item of files) {
    //   console.log(item);
    //   item.progress = 0;
    //   this.coverImage.push(item);
    // }
    this.uploadFilesSimulator(0);
  }

  prepareAdditionalImagesFilesList(files: Array<any>) {

    for (const item of files) {
      console.log(item);
      item.progress = 0;
      this.additionalImages.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}

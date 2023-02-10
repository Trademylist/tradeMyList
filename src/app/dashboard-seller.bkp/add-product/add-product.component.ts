import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css"],
})
export class AddProductComponent implements OnInit {
  constructor() {}

  ngOnInit() {
   
  //   const
  //   range = (document.getElementById('range') as HTMLTextAreaElement).value,
  //   rangeV = ( document.getElementById('rangeV') as HTMLTextAreaElement).value,
  //   setValue = ()=>{
  //     const
  //       newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
  //       newPosition = 10 - (newValue * 0.2);
  //     rangeV.innerHTML = `<span>${range.value}</span>`;
  //     rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
  //   };
  // document.addEventListener("DOMContentLoaded", setValue);
  // range.addEventListener('input', setValue);





  }
}
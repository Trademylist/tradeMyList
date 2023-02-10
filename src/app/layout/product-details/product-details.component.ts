import { Component, OnInit } from '@angular/core';
 
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

 
export class ProductDetailsComponent implements OnInit {
  selectedHero:[];
   HEROES = [
    { id: 11, name: 'Dr Nice', imgurl:'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { id: 12, name: 'Narco',  imgurl:'https://images.pexels.com/photos/2834653/pexels-photo-2834653.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'  },
    { id: 13, name: 'Bombasto',  imgurl:'https://images.pexels.com/photos/326259/pexels-photo-326259.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    { id: 14, name: 'Bombasto',  imgurl:'https://images.pexels.com/photos/3399938/pexels-photo-3399938.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { id: 15, name: 'Bombasto',  imgurl:'https://images.pexels.com/photos/1393996/pexels-photo-1393996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' }
  ];
  constructor() { }

  onselectFruit(item){
    this.selectedHero = item
  }
  
  ngOnInit() {
  }

}

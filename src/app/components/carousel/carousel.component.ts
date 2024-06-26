import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  template: `
   <div class="carousel">
      <img [src]="images()[currentIndex()]" alt="Carousel image">
      <button (click)="prev()">Previous</button>
      <button (click)="next()">Next</button>
    </div>
  `,
  styles: [
    `
      .carousel {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      img {
        max-width: 100%;
        //height: auto;
      }
      button {
        margin: 10px;
      }
    `,
  ],
})
export class CarouselComponent {
  images = input<string[]>([]);
  currentIndex = signal(0);

  prev() {
    this.currentIndex.set(this.currentIndex() > 0 ? this.currentIndex() - 1 : this.images().length - 1);
  }

  next() {
    this.currentIndex.set((this.currentIndex() + 1) % this.images().length);
  }
}

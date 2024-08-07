import { NgOptimizedImage } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgOptimizedImage],
  template: `
    <div class="carousel">
      <img
        [ngSrc]="images()[currentIndex()] || 'assets/default-post.jpg'"
        width="500"
        height="500"
        onerror="this.src='assets/default-post.jpg'"
        alt="Carousel image"
        priority
      />
      @if (images().length > 1) {
      <button
        class="btn-prev"
        mat-icon-button
        aria-label="Previous"
        [disabled]="currentIndex() == 0"
        (click)="prev()"
      >
        <mat-icon>arrow_back_ios</mat-icon>
      </button>
      <button
        class="btn-next"
        mat-icon-button
        aria-label="Next"
        [disabled]="currentIndex() == images().length - 1"
        (click)="next()"
      >
        <mat-icon>arrow_forward_ios</mat-icon>
      </button>
      }
    </div>
  `,
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent {
  images = input<string[]>([]);
  currentIndex = signal(0);

  prev() {
    this.currentIndex.set(
      this.currentIndex() > 0
        ? this.currentIndex() - 1
        : this.images().length - 1
    );
  }

  next() {
    this.currentIndex.set((this.currentIndex() + 1) % this.images().length);
  }
}

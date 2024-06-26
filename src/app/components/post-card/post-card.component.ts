import { Component, OnInit, input, signal } from '@angular/core';
import { Post } from '../../models/Post';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [MatCardModule, MatDivider, CarouselComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnInit{
  post = input<Post>();
  images = signal<string[]>([]);

  ngOnInit(): void {
    this.images.set(
      this.post()?.postAttachments.map((attch) => attch.url) || []
    );
  }
}

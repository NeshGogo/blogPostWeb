import { Component, input } from '@angular/core';
import { Post } from '../../models/Post';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [MatCardModule, MatDivider],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {
  post = input<Post>();
}

import { Component, OnInit, signal } from '@angular/core';
import { Post } from '../models/Post';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatGridListModule, MatDividerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  posts =  signal<Post[]>([]);

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.postService.getAll(true).subscribe((data) => {
      this.posts.set(data);
      this.postService.posts.set(data);
    });
  }
}

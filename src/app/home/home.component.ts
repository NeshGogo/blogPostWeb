import { Component, OnInit, signal } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../models/Post';
import { PostCardComponent } from '../components/post-card/post-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  posts = signal<Post[]>([]);

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.postService.getAll().subscribe((data) => {
      this.postService.posts.set(data);
      this.posts = this.postService.posts;
    });
  }

  handleLike(id: string){
    this.posts.update(posts => {
      const index = posts.findIndex(p => p.id === id);
      posts[index].liked = !posts[index].liked;
      return posts;
    });
  }
}

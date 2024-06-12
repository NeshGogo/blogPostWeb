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
  posts = signal<Post[]>([
    {
      id: 'qwewq12321',
      userId: '232112',
      user: {
        id: '2112312',
        name: 'test name',
        userName: 'neshtest',
        userImageUrl: 'assets/logo.png',
        email: 'neshgogo@test.com',
      },
      postAttachments: [
        {
          postId: 'qwewq12321',
          url: 'assets/logo.png',
          name: 'test',
          contentType: 'image/png',
        },
      ],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      dateCreated: new Date(),
    },
  ]);

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.postService.getAll().subscribe((data) => {
      this.posts.set(data);
      this.postService.posts.set(data);
    });
  }
}

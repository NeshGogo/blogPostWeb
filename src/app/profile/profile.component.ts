import { Component, OnInit, signal } from '@angular/core';
import { Post } from '../models/Post';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User';
import { NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostDetailComponent } from '../components/dialog-post-detail/dialog-post-detail.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatGridListModule,
    MatDividerModule,
    NgOptimizedImage,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  posts = signal<Post[]>([]);
  user = signal<User | null>(null);
  isAuthUserProfile = signal(true);

  constructor(
    private postService: PostService,
    private auth: AuthService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.user = this.auth.user;
  }

  fetchData(): void {
    this.postService.getAll(true).subscribe((data) => {
      this.postService.posts.set(data);
      this.posts = this.postService.posts;
    });
  }

  openPost(id: string){
    this.matDialog.open(DialogPostDetailComponent, {
      data: {
        id
      }
    });
  }
}

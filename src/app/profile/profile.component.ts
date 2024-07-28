import { Component, Input, OnInit, signal } from '@angular/core';
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
import { FollowService } from '../services/follow.service';
import { UserFollowing } from '../models/UserFollowing';

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
  @Input()
  set id(userId: string) {
    if(this.auth.user()?.id === userId){
      this.user = this.auth.user;
    }
  }
  posts = signal<Post[]>([]);
  user = signal<User | null>(null);
  isAuthUserProfile = signal(true);
  following = signal<UserFollowing[]>([]);
  followers = signal<UserFollowing[]>([]);

  constructor(
    private postService: PostService,
    private auth: AuthService,
    private matDialog: MatDialog,
    private followService: FollowService,
  ) {}

  ngOnInit(): void {
    this.fetchData();
    //this.user = this.auth.user;
    this.fetchFollowers();
    this.fetchFollowing();
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

  fetchFollowing(){
    this.followService.getFollowing().subscribe(following => {
      this.following.set(following);
    });
  }

  fetchFollowers(){
    this.followService.getFollowing(false).subscribe(following => {
      this.followers.set(following);
    });
  }
}

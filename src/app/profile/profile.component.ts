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
import { UserService } from '../services/user.service';

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
export class ProfileComponent {
  @Input()
  set id(userId: string) {
    this.isAuthUserProfile.set(userId === this.auth.user()?.id);
    this.userService.getUserById(userId).subscribe((user) => {
      this.user.set(user);
      this.init();
    });
  }
  posts = signal<Post[]>([]);
  user = signal<User | null>(null);
  isAuthUserProfile = signal(false);
  following = signal<UserFollowing[]>([]);
  followers = signal<UserFollowing[]>([]);
  isFollowing = signal(false);

  constructor(
    private postService: PostService,
    private auth: AuthService,
    private matDialog: MatDialog,
    private followService: FollowService,
    private userService: UserService
  ) {}

  init() {
    this.fetchData();
    this.fetchFollowers();
    this.fetchFollowing();
  }

  fetchData(): void {
    this.postService.getAll(false, false, this.user()?.id).subscribe((data) => {
      this.postService.posts.set(data);
      this.posts = this.postService.posts;
    });
  }

  openPost(id: string) {
    this.matDialog.open(DialogPostDetailComponent, {
      data: {
        id,
      },
    });
  }

  fetchFollowing() {
    this.followService.getFollowing(<string>this.user()?.id).subscribe((following) => {
      this.following.set(following);
    });
  }

  fetchFollowers() {
    this.followService.getFollowing(<string>this.user()?.id, false).subscribe((following) => {
      this.followers.set(following);
      this.isFollowing.set(following.some(
        (p) => p.userId === this.auth.user()?.id
      ));
    });
  }

  follow() {
    this.followService
      .addFollowing(<string>this.user()?.id)
      .subscribe((followUser) => {
        this.followers.update((values) => [followUser, ...values]);
      });
    this.isFollowing.set(true);
  }

  unfollow() {
    this.followService
      .removeFollowing(<string>this.user()?.id)
      .subscribe(() => {
        this.followers.update((values) => {
          const index = values.findIndex(
            (val: UserFollowing) => val.userId === this.user()?.id
          );
          values.splice(index, 1);
          return values;
        });
      });
      this.isFollowing.set(false);
  }
}

import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContainer,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { Post } from '../../models/Post';
import { PostService } from '../../services/post.service';
import { CarouselComponent } from '../carousel/carousel.component';
import { MatCardModule } from '@angular/material/card';
import { CommentComponent } from '../comment/comment.component';
import { Comment, CommentForCreation } from '../../models/Comment';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-post-detail',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogContent,
    CarouselComponent,
    MatCardModule,
    MatDialogContainer,
    CommentComponent,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-post-detail.component.html',
  styleUrl: './dialog-post-detail.component.scss',
})
export class DialogPostDetailComponent implements OnInit {
  private readonly data = inject<{ id: string }>(MAT_DIALOG_DATA);
  private readonly postService = inject(PostService);
  private readonly snackBar = inject(MatSnackBar);
  post = signal<Post | null>(null);
  images = signal<string[]>([]);
  comments = signal<Comment[]>([]);
  commentForm = new FormControl('');
  onLiked = output();
  onComment = output();

  ngOnInit(): void {
    this.fetchPost();
    this.fetchComments();
  }

  fetchPost() {
    this.postService.getById(this.data.id).subscribe((post) => {
      this.post.set(post);
      this.images.set(
        this.post()?.postAttachments.map((attch) => attch.url) || []
      );
    });
  }

  fetchComments() {
    this.postService.getComments(this.data.id).subscribe((comments) => {
      this.comments.set(comments);
    });
  }

  addComment() {
    if (this.commentForm.invalid) return;
    const body: CommentForCreation = {
      content: <string>this.commentForm.value,
    };
    this.postService
      .addComment(<string>this.post()?.id, body)
      .subscribe((comment) => {
        this.commentForm.reset();
        this.comments.update((comments) => [comment, ...comments]);
        this.snackBar.open('Comment added✔️', undefined, {
          duration: 5000,
        });
        this.post.update((post) => {
          (<Post>post).amountOfComments++;
          return post;
        });
        this.onComment.emit();
      });
  }

  handleLike() {
    this.postService.addOrRemoveLike(<string>this.post()?.id).subscribe(() => {
      this.post.update((post) => {
        const value = <Post>post;
        value.liked = !value.liked;
        if (value.liked) {
          value.amountOfLikes++;
        } else {
          value.amountOfLikes--;
        }
        return value;
      });
      this.onLiked.emit();
    });
  }
}

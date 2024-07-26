import { Component, inject, input, OnInit, signal } from '@angular/core';
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
import { Comment } from '../../models/Comment';
import { MatDividerModule } from '@angular/material/divider';

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
  ],
  templateUrl: './dialog-post-detail.component.html',
  styleUrl: './dialog-post-detail.component.scss',
})
export class DialogPostDetailComponent implements OnInit {
  private readonly data = inject<{ id: string }>(MAT_DIALOG_DATA);
  private readonly postService = inject(PostService);
  post = signal<Post | null>(null);
  images = signal<string[]>([]);
  comments = signal<Comment[]>([]);

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

  fetchComments(){
    this.postService.getComments(this.data.id).subscribe(comments => {
      this.comments.set(comments);
    });
  }
}

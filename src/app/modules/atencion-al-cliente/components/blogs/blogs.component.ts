import { Component, OnInit } from '@angular/core';
import { ClienteExternoService } from '../../services/cliente-externo.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  blog: any = {};
  spinner: boolean = true;

  constructor (private clienteExternoService: ClienteExternoService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const blogId = +params['id'];
      if (blogId) {
        this.loadBlog(blogId);
      } else {
        console.error('Blog ID is required');
      }
    });
  }

  loadBlog(blogId: number): void {
    this.clienteExternoService.getBlog(blogId).subscribe({
      next: (result: any) => {
        this.blog = result;
        setTimeout(() => {
          this.spinner = false;
        }, 800);
      },
      error: (error) => {
        console.error('Error loading the blog:', error);
      }
    });
  }

}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
})
export class ViewComponent {}

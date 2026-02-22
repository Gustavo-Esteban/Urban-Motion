import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'um-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent {
  products = [
    { name: 'Camiseta Essential Preta', price: 'R$ 89,90', bg: '#1a1a1a', sizes: ['P', 'M', 'G', 'GG'] },
    { name: 'Camiseta Essential Branca', price: 'R$ 89,90', bg: '#e5e5e5', sizes: ['P', 'M', 'G', 'GG'] },
    { name: 'Camiseta Oversized Motion', price: 'R$ 109,90', bg: '#888', sizes: ['P', 'M', 'G', 'GG'] },
    { name: 'Camiseta Gráfico Urbano', price: 'R$ 99,90', bg: '#222', sizes: ['P', 'M', 'G'] },
    { name: 'Camiseta Minimal Logo', price: 'R$ 79,90', bg: '#d0d0d0', sizes: ['M', 'G', 'GG'] },
    { name: 'Camiseta Street Block', price: 'R$ 109,90', bg: '#555', sizes: ['P', 'M', 'G', 'GG'] },
  ];
}


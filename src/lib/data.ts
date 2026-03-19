// Category is now free-text (typed by the user in admin panel)

export interface Artwork {
  id: number | string;
  title: string;
  medium: string;
  year: number;
  size: string;
  category: string;
  aspectRatio: number;
  image_url?: string;
  description?: string;
}

export const ARTWORKS: Artwork[] = [
  { id:1, title:"Stillness Before Rain", medium:"Oil on Canvas", year:2024, size:"90×120cm", category:"oil", aspectRatio: 0.75 },
  { id:2, title:"The Amber Hour", medium:"Oil on Canvas", year:2024, size:"60×80cm", category:"oil", aspectRatio: 1.2 },
  { id:3, title:"River Memory", medium:"Watercolour", year:2023, size:"50×70cm", category:"watercolour", aspectRatio: 0.85 },
  { id:4, title:"Portrait of Silence", medium:"Charcoal", year:2023, size:"40×60cm", category:"charcoal", aspectRatio: 0.65 },
  { id:5, title:"Crimson Reverie", medium:"Oil on Canvas", year:2024, size:"100×130cm", category:"oil", aspectRatio: 1.4 },
  { id:6, title:"Monsoon Light", medium:"Watercolour", year:2024, size:"45×65cm", category:"watercolour", aspectRatio: 0.7 },
  { id:7, title:"The Forgotten Garden", medium:"Oil on Canvas", year:2022, size:"80×100cm", category:"oil", aspectRatio: 1.1 },
  { id:8, title:"Dust and Gold", medium:"Charcoal & Pastel", year:2023, size:"60×80cm", category:"charcoal", aspectRatio: 0.9 },
];

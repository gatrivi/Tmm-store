import { type MenuItemType } from './menu';

export const magdalenaData: MenuItemType[] = [
  {
    id: "facturas",
    name: "Facturas Artesanales",
    category: "extras",
    description: "Variedad de manteca y grasa, horneadas hoy. El clásico de las mañanas.",
    images: [],
    options: [
      { id: "unidad", label: "Unidad", price: 1000, available: true }
    ]
  },
  {
    id: "empanadas",
    name: "Empanadas Caseras",
    category: "extras",
    description: "Carne cortada a cuchillo, Pollo o Jamón y Queso. Masa artesanal.",
    images: [],
    options: [
      { id: "unidad", label: "Unidad", price: 2000, available: true }
    ]
  },
  {
    id: "sandwich-milanesa",
    name: "Sándwich de Milanesa",
    category: "extras",
    description: "Milanesa de carne premium, jamón cocido y queso dambo en pan francés crocante.",
    images: [],
    options: [
      { id: "completo", label: "Completo", price: 9000, available: true, features: ["Jamón", "Queso"] }
    ]
  },
  {
    id: "coca-600",
    name: "Coca-Cola (600ml)",
    category: "extras",
    description: "Línea original, bien fría.",
    images: [],
    options: [
      { id: "unidad", label: "600ml", price: 2000, available: true }
    ]
  }
];

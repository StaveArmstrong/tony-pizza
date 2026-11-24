import margherita from '../assets/margherita.png'
import bufalina from '../assets/bufalina.png'
import pepperoni from '../assets/napoletana.png'

export const imageMap = { margherita, bufalina, pepperoni }

export function getMenuImage(name) {
  const key = name.toLowerCase().trim()
  return imageMap[key] || null
}

// Fakes a "size-reactive" photo using zoom, since we only have one photo per pizza
export function getSizeScale(sizeLabel = '') {
  const s = sizeLabel.toLowerCase()
  if (s.includes('small')) return 0.82
  if (s.includes('large')) return 1.18
  return 1 // medium / regular
}

export const categoryLabels = { pizza: 'Pizzas', side: 'Sides', drink: 'Drinks', dessert: 'Desserts' }
export const categoryOrder = ['pizza', 'side', 'drink', 'dessert']
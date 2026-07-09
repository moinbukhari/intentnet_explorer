export interface RetroModel {
  id: string
  name: string
  icon: string
  catchphrase: string
  loadingLine: string
}

export const MODELS: RetroModel[] = [
  {
    id: 'yahoogpt',
    name: 'YahooGPT-2001',
    icon: '🟪',
    catchphrase: 'Do you... YahooGPT?!',
    loadingLine: 'YahooGPT-2001 is yodeling through the web directory...',
  },
  {
    id: 'jeeves',
    name: 'Ask Jeeves 3.5',
    icon: '🎩',
    catchphrase: 'Your answer shall be fetched presently, sir.',
    loadingLine: 'Jeeves 3.5 is consulting the library, do hold the line...',
  },
  {
    id: 'clippy',
    name: 'Clippy 4o',
    icon: '📎',
    catchphrase: 'It looks like you’re searching for something!',
    loadingLine: 'Clippy 4o is bouncing excitedly at your query...',
  },
]

export const DEFAULT_MODEL = 'yahoogpt'

export function getModel(id: string | undefined): RetroModel {
  return MODELS.find((m) => m.id === id) ?? MODELS[0]
}

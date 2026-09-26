import { config } from './config.js'
import type { AdhesionInput } from './types.js'

export function waLink(message: string): string {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function adhesionMessage(a: AdhesionInput): string {
  return [
    'Bonjour MDIJ, je souhaite adhérer au mouvement.',
    '',
    `Nom & prénoms : ${a.nom}`,
    `Téléphone / WhatsApp : ${a.telephone}`,
    `Quartier / Commune : ${a.quartier}`,
    `Je souhaite : ${a.souhait}`,
  ].join('\n')
}

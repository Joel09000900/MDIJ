import { MESSAGE_CONTACT, waLink } from '../content'

export default function WhatsAppFloat() {
  return (
    <a className="wa-float" href={waLink(MESSAGE_CONTACT)} target="_blank" rel="noreferrer" aria-label="Écrire au MDIJ sur WhatsApp">
      💬
    </a>
  )
}

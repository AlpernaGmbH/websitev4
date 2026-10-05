import type { Metadata } from 'next'
import { RechtlichSeite } from '@/components/RechtlichSeite'
import { datenschutz } from '@/lib/rechtliches'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Alperna GmbH',
  description: 'Datenschutzerklärung der Alperna GmbH für die Website alperna.ch.',
  alternates: { canonical: '/datenschutz' },
}

export default function DatenschutzSeite() {
  return <RechtlichSeite {...datenschutz} />
}

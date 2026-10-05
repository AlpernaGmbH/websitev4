import type { Metadata } from 'next'
import { RechtlichSeite } from '@/components/RechtlichSeite'
import { impressum } from '@/lib/rechtliches'

export const metadata: Metadata = {
  title: 'Impressum | Alperna GmbH, Speicher AR',
  description: 'Impressum der Alperna GmbH, Röhrenbrugg 7, 9042 Speicher AR. UID CHE-132.724.195, Kontakt kontakt@alperna.ch.',
  alternates: { canonical: '/impressum' },
}

export default function ImpressumSeite() {
  return <RechtlichSeite {...impressum} />
}

import { FoerderConsultant } from '../components/FoerderConsultant'
import { FoerderFinder } from '../components/FoerderFinder'
import { PageLayout } from '../components/PageLayout'

export function FoerderungPage() {
  return (
    <PageLayout>
      <FoerderFinder />
      <FoerderConsultant />
    </PageLayout>
  )
}

import ScanGate from './ScanGate'

interface Props {
  params: Promise<{ eventId: string }>
}

export default async function ScanPage({ params }: Props) {
  const { eventId } = await params
  return <ScanGate eventId={eventId} />
}

// src/pages/VideoSection.tsx
type Props = {
  callId: string | null
  url: string | null
}

export default function VideoSection({ callId, url }: Props) {
  if (!url) return null

  return (
    <section className="video">
      <div className="video-shell">
        <iframe
          src={url}
          allow="camera *; microphone *; fullscreen; display-capture *;"
          referrerPolicy="no-referrer"
          title={callId ? `Call ${callId}` : 'Video'}
        />
      </div>
    </section>
  )
}
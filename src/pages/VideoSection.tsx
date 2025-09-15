type Props = {
  callId: string | null
  url: string | null
}

export default function VideoSection({ url }: Props) {
  if (!url) return null

  return (
    <section className="video">
      <div className="video-full">
        <iframe src={url} allow="camera; microphone; fullscreen" />
      </div>
    </section>
  )
}
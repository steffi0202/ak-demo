type Props = {
  callId?: string | null
  url?: string | null
  onClose: () => void
}

export default function VideoSection({ callId, url, onClose }: Props) {
  return (
    <section className={`card video ${url ? '' : 'hidden'}`}>
      <div className="card-header">
        <h2>{callId ? `Call ${callId}` : 'Call'}</h2>
        <button className="btn btn-outline" onClick={onClose}>Schließen</button>
      </div>
      <div className="video-frame">
        {url ? (
          <iframe
            src={url}
            allow="camera; microphone; fullscreen; display-capture; clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        ) : null}
      </div>
    </section>
  )
}
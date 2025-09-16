import { useEffect } from 'react';

type Props = {
  callId: string | null;
  url: string | null;
  onClose?: () => void;   // <-- neu
};

export default function VideoSection({ callId, url, onClose }: Props) {
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (typeof event.data === 'string') {
        console.log('iFrame Event:', event.data);
        if (event.data === 'CALL_CLOSED') {
          // Wenn der Call beendet wurde, Parent informieren
          if (onClose) onClose();
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onClose]);

  if (!url) return null;

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
  );
}
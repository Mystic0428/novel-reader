// src/ui/cover.jsx — spine-style vertical-title cover
function Cover({ book, size = 'md' }) {
  const dims = size === 'xl' ? { w: 150, h: 225 }
    : size === 'lg' ? { w: 120, h: 160 }
    : size === 'sm' ? { w: 44, h: 60 }
    : { w: 90, h: 120 };
  const [imgUrl, setImgUrl] = React.useState(null);

  React.useEffect(() => {
    let revoke = null;
    if (book.coverBlob) {
      const u = URL.createObjectURL(book.coverBlob);
      setImgUrl(u);
      revoke = u;
    } else {
      setImgUrl(null);
    }
    return () => { if (revoke) URL.revokeObjectURL(revoke); };
  }, [book.coverBlob]);

  if (imgUrl) {
    return (
      <img src={imgUrl} alt={book.title} style={{
        width: dims.w, height: dims.h, objectFit: 'cover',
        borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'block',
      }}/>
    );
  }

  // Fallback: color-block cover with vertical title
  const titleSize = Math.max(10, dims.w * 0.18);
  return (
    <div style={{
      width: dims.w, height: dims.h,
      background: book.accent || '#8C3A2E',
      borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: 10, color: '#F5EDE0', fontFamily: 'var(--serif)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 7, letterSpacing: '0.2em', opacity: 0.65, fontFamily: 'var(--ui)' }}>CLASSIC</div>
      <div style={{
        writingMode: 'vertical-rl', textOrientation: 'upright',
        letterSpacing: '0.12em', fontWeight: 500,
        alignSelf: 'flex-end', lineHeight: 1.1,
        fontSize: titleSize,
      }}>{book.title}</div>
      <div style={{ fontSize: 6.5, letterSpacing: '0.2em', opacity: 0.7, fontFamily: 'var(--ui)' }}>{book.author || ''}</div>
      <div style={{
        position: 'absolute', inset: 5,
        border: '0.5px solid rgba(245,237,224,0.3)', pointerEvents: 'none',
      }}/>
    </div>
  );
}
window.Cover = Cover;

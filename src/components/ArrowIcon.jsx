export default function ArrowIcon({ size = 'clamp(1rem,1.5vw,2rem)', dir = 'right' }) {
  const isLeft = dir === 'left'
  return (
    <svg width={size} height={size} viewBox="0 0 102 102" fill="none">
      {isLeft ? (
        <>
          <line x1="101.8" y1="50.2" x2="1.8"   y2="50.2" stroke="currentColor" strokeWidth="4" />
          <line x1="36.6"  y1="15.2" x2="1.2"   y2="50.6" stroke="currentColor" strokeWidth="4" />
          <line x1="36.6"  y1="85.2" x2="1.2"   y2="49.9" stroke="currentColor" strokeWidth="4" />
        </>
      ) : (
        <>
          <line x1="0.2"  y1="50.2" x2="100.2" y2="50.2" stroke="currentColor" strokeWidth="4" />
          <line x1="65.4" y1="15.2" x2="100.8" y2="50.6" stroke="currentColor" strokeWidth="4" />
          <line x1="65.4" y1="85.2" x2="100.8" y2="49.9" stroke="currentColor" strokeWidth="4" />
        </>
      )}
    </svg>
  )
}

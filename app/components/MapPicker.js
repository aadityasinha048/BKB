'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, Navigation, X, Check, Loader2, AlertCircle } from 'lucide-react';

// ─── Reverse geocode coords → address string via Nominatim ───────────────────
async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) throw new Error('Geocode failed');
    const data = await res.json();
    return {
      display: data.display_name || '',
      road: data.address?.road || data.address?.neighbourhood || '',
      city: data.address?.city || data.address?.town || data.address?.village || data.address?.county || '',
      state: data.address?.state || '',
      postcode: data.address?.postcode || '',
      district: data.address?.county || data.address?.state_district || '',
    };
  } catch {
    return null;
  }
}

// ─── Forward geocode search term → results ────────────────────────────────────
async function forwardGeocode(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=in`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// ─── Main MapPicker Component ─────────────────────────────────────────────────
export default function MapPicker({ onConfirm, onClose, initialLat, initialLng }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const leafletRef = useRef(null);

  const defaultLat = initialLat || 25.5941;  // Patna, Bihar
  const defaultLng = initialLng || 85.1376;

  const [coords, setCoords] = useState({ lat: defaultLat, lng: defaultLng });
  const [address, setAddress] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // ── Reverse geocode whenever coords change ──
  const doReverseGeocode = useCallback(async (lat, lng) => {
    setGeocoding(true);
    setAddress(null);
    const result = await reverseGeocode(lat, lng);
    setAddress(result);
    setGeocoding(false);
  }, []);

  // ── Move marker on map ──
  const moveMarker = useCallback((lat, lng, L) => {
    const map = mapInstanceRef.current;
    if (!map || !L) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const newMarker = L.marker([lat, lng], {
        draggable: true,
        icon: L.divIcon({
          className: '',
          html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:linear-gradient(135deg,#C85A08,#E07030);transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 18px rgba(200,90,8,0.45);display:flex;align-items:center;justify-content:center;"><div style="width:10px;height:10px;border-radius:50%;background:#fff;transform:rotate(45deg);"></div></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        }),
      }).addTo(map);

      newMarker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        const lat2 = Math.round(pos.lat * 1e6) / 1e6;
        const lng2 = Math.round(pos.lng * 1e6) / 1e6;
        setCoords({ lat: lat2, lng: lng2 });
        doReverseGeocode(lat2, lng2);
      });

      markerRef.current = newMarker;
    }

    map.setView([lat, lng], map.getZoom() < 13 ? 15 : map.getZoom());
  }, [doReverseGeocode]);

  // ── Initialize Leaflet map ──
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      const Lx = L.default || L;
      leafletRef.current = Lx;

      const map = Lx.map(mapRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      Lx.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      map.on('click', (e) => {
        const lat = Math.round(e.latlng.lat * 1e6) / 1e6;
        const lng = Math.round(e.latlng.lng * 1e6) / 1e6;
        setCoords({ lat, lng });
        moveMarker(lat, lng, Lx);
        doReverseGeocode(lat, lng);
      });

      moveMarker(defaultLat, defaultLng, Lx);
      doReverseGeocode(defaultLat, defaultLng);
    }

    init();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── GPS locate ──
  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 1e6) / 1e6;
        const lng = Math.round(pos.coords.longitude * 1e6) / 1e6;
        setCoords({ lat, lng });
        moveMarker(lat, lng, leafletRef.current);
        doReverseGeocode(lat, lng);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setLocError('Location permission denied. Please allow access in your browser settings.');
        else setLocError('Could not detect your location. Try clicking on the map instead.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ── Search ──
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setShowResults(false);
    const results = await forwardGeocode(searchQuery + ', Bihar, India');
    setSearchResults(results);
    setShowResults(true);
    setSearching(false);
  };

  const handleSelectResult = (result) => {
    const lat = Math.round(parseFloat(result.lat) * 1e6) / 1e6;
    const lng = Math.round(parseFloat(result.lon) * 1e6) / 1e6;
    setCoords({ lat, lng });
    moveMarker(lat, lng, leafletRef.current);
    doReverseGeocode(lat, lng);
    setShowResults(false);
    setSearchQuery(result.display_name.split(',')[0]);
  };

  // ── Confirm ──
  const handleConfirm = () => {
    onConfirm({
      lat: coords.lat,
      lng: coords.lng,
      address: address?.display || '',
      road: address?.road || '',
      city: address?.city || '',
      district: address?.district || '',
      state: address?.state || '',
      pincode: address?.postcode || '',
    });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,6,3,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 720, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>

        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #FFF4EC, #FFFCF8)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FFF4EC', border: '2px solid #FFE8D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="#C85A08" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1410' }}>Pin Your Location on Map</div>
              <div style={{ fontSize: 11, color: '#8C7B6E' }}>Click the map, drag the pin, search address, or use GPS</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #E8DDD4', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#6B5C50" />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '12px 22px', borderBottom: '1px solid #F0E8E0', flexShrink: 0, position: 'relative' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={15} color="#8C7B6E" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); if (!e.target.value) setShowResults(false); }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search village, town, landmark, district..."
                style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1.5px solid #E8DDD4', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', color: '#1A1410', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#C85A08'}
                onBlur={e => e.target.style.borderColor = '#E8DDD4'}
              />
            </div>
            <button onClick={handleSearch} disabled={searching} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: searching ? '#E8DDD4' : '#C85A08', color: '#fff', fontSize: 13, fontWeight: 700, cursor: searching ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              {searching ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} />}
              {searching ? 'Searching...' : 'Search'}
            </button>
            <button onClick={handleLocate} disabled={locating} title="Use my current GPS location" style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #1A5C38', background: locating ? '#EAF5F0' : '#fff', color: '#1A5C38', fontSize: 13, fontWeight: 700, cursor: locating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              {locating ? <Loader2 size={14} color="#1A5C38" style={{ animation: 'spin 1s linear infinite' }} /> : <Navigation size={14} color="#1A5C38" />}
              {locating ? 'Locating...' : 'My Location'}
            </button>
          </div>

          {/* Search results dropdown */}
          {showResults && (
            <div style={{ position: 'absolute', top: 'calc(100% - 4px)', left: 22, right: 22, background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden' }}>
              {searchResults.length > 0 ? searchResults.map((r, i) => (
                <button key={i} onClick={() => handleSelectResult(r)} style={{ width: '100%', padding: '11px 14px', border: 'none', background: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', borderBottom: i < searchResults.length - 1 ? '1px solid #F0E8E0' : 'none', display: 'flex', alignItems: 'flex-start', gap: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFF4EC'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <MapPin size={14} color="#C85A08" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: '#1A1410', lineHeight: 1.4 }}>{r.display_name}</span>
                </button>
              )) : (
                <div style={{ padding: '14px 16px', fontSize: 13, color: '#8C7B6E', textAlign: 'center' }}>No results found. Try a different search term.</div>
              )}
            </div>
          )}
        </div>

        {/* Map */}
        <div style={{ flex: 1, minHeight: 340, position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: 340 }} />
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,20,16,0.75)', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 600, pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 500 }}>
            Click map to drop pin &nbsp;·&nbsp; Drag pin to adjust
          </div>
        </div>

        {/* Location error */}
        {locError && (
          <div style={{ padding: '10px 22px', background: '#FDECEA', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#D32F2F', fontWeight: 600, flexShrink: 0 }}>
            <AlertCircle size={14} /> {locError}
          </div>
        )}

        {/* Address Preview + Confirm */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid #E8DDD4', background: '#FFFCF8', flexShrink: 0 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={11} color="#C85A08" /> Detected Address
            </div>
            {geocoding ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8C7B6E' }}>
                <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Detecting address from map...
              </div>
            ) : address ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1410', lineHeight: 1.6 }}>
                  {[address.road, address.city, address.district, address.state].filter(Boolean).join(', ')}
                  {address.postcode && ` - ${address.postcode}`}
                </div>
                <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 3, fontFamily: 'monospace' }}>
                  {coords.lat}° N, {coords.lng}° E
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: '#C8BFB8', fontStyle: 'italic' }}>Click anywhere on the map to detect your address</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: '1.5px solid #E8DDD4', background: '#fff', color: '#6B5C50', cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
            <button onClick={handleConfirm} style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', background: '#C85A08', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(200,90,8,0.3)' }}>
              <Check size={15} /> Use This Location
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .leaflet-container { font-family: inherit; }
        .leaflet-control-attribution { font-size: 10px !important; }
      `}</style>
    </div>
  );
}

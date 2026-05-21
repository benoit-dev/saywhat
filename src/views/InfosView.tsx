import { Copyable } from "../components/Copyable";

export function InfosView() {
  return (
    <section className="view">
      <div className="view-title">Infos pratiques</div>
      <div className="view-desc">Adresse, codes, wifi · à garder sous la main</div>

      <div className="info-hero">
        <div className="info-hero-label">📍 Adresse</div>
        <div className="info-hero-value">
          80 Ch. du Faon
          <br />
          Matawinie, QC J0K 2B0
        </div>
        <a
          className="info-link"
          href="https://maps.google.com/?q=80+Ch+du+Faon+Matawinie+QC+J0K+2B0"
          target="_blank"
          rel="noreferrer"
        >
          Ouvrir dans Maps →
        </a>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-label">↘ Check-in</div>
          <div className="info-value">dès 16h00</div>
          <div className="info-sub">Vendredi 22 mai</div>
        </div>
        <div className="info-card">
          <div className="info-label">↗ Check-out</div>
          <div className="info-value">11h00</div>
          <div className="info-sub">Dimanche 24 mai</div>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <Copyable value="2020" label="Code serrure">
            <div className="info-label">🔐 Serrure</div>
            <div className="info-value code">2020</div>
          </Copyable>
        </div>
        <div className="info-card">
          <Copyable value="2003" label="Code alarme">
            <div className="info-label">🚨 Alarme</div>
            <div className="info-value code">2003</div>
          </Copyable>
        </div>
      </div>

      <div className="info-card full" style={{ marginBottom: 10 }}>
        <div className="info-label">📶 Wifi</div>
        <div className="info-pair">
          <Copyable value="Nordea" label="Nom du wifi">
            <div className="info-sub">Réseau</div>
            <div className="info-value">Nordea</div>
          </Copyable>
          <Copyable value="Nordea80" label="Mot de passe wifi">
            <div className="info-sub">Mot de passe</div>
            <div className="info-value code" style={{ fontSize: 18 }}>
              Nordea80
            </div>
          </Copyable>
        </div>
      </div>

      <div className="info-card full" style={{ marginTop: 10 }}>
        <div className="info-label">☀ Météo prévue</div>
        <div className="weather-grid">
          <div className="weather-day">
            <div className="wd-name">Ven 22</div>
            <div className="wd-temp">18°</div>
            <div className="wd-cond">☀ 10%</div>
          </div>
          <div className="weather-day">
            <div className="wd-name">Sam 23</div>
            <div className="wd-temp">18°</div>
            <div className="wd-cond">☀ 10%</div>
          </div>
          <div className="weather-day rain">
            <div className="wd-name">Dim 24</div>
            <div className="wd-temp">11°</div>
            <div className="wd-cond">🌧 45%</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 12, lineHeight: 1.5, fontWeight: 500 }}>
          Nuits encore{" "}
          <strong style={{ color: "var(--ink)", fontWeight: 700 }}>fraîches (5–8°)</strong>{" "}
          · pluie probable dimanche → départ light tôt = good call
        </div>
      </div>
    </section>
  );
}

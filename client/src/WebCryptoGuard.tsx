import React from "react";

const WebCryptoGuard: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const hasSubtle = !!(
    (globalThis as any).crypto &&
    (((globalThis as any).crypto as Crypto).subtle || (globalThis as any).crypto.webkitSubtle)
  );

  if (hasSubtle) return children as React.ReactElement;

  // Friendly message when Web Crypto isn't available (insecure context / IP instead of localhost)
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      boxSizing: 'border-box',
      fontFamily: 'monospace',
      background: '#111',
      color: '#f8d7da'
    }}>
      <div style={{maxWidth:800}}>
        <h1 style={{color:'#ff6b6b'}}>Web Crypto API indisponible</h1>
        <p>
          L'API Web Crypto (window.crypto.subtle) n'est pas disponible dans ce contexte.
          Le chiffrement côté client requiert un contexte sécurisé (HTTPS) ou l'utilisation de <code>localhost</code>.
        </p>
        <h3>Solutions rapides</h3>
        <ul>
          <li>Ouvrir l'app sur <code>http://localhost:3000</code> (ou l'URL affichée par npm start).</li>
          <li>Ou démarrer le client en HTTPS (PowerShell) :
            <pre style={{background:'#222',padding:8}}> $env:HTTPS='true'; npm start</pre>
            (Le navigateur demandera probablement d'accepter un certificat auto-signé.)
          </li>
          <li>Ou configurer un nom d'hôte local (ex: <code>local.chat-e2ee.test</code>) avec HTTPS valable.</li>
        </ul>
        <p>
          Pour continuer en développement immédiatement, ouvre l'app via <code>localhost</code> plutôt que via une adresse IP.
        </p>
      </div>
    </div>
  );
};

export default WebCryptoGuard;

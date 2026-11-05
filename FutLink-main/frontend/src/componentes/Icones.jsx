// Ícones em SVG (estilo "linha"), todos herdam a cor do texto (currentColor).
// Para criar um ícone novo basta chamar fazerIcone(<desenho>, tamanhoPadrao).
function fazerIcone(desenho, tamanhoPadrao = 18) {
  return function Icone({ tamanho = tamanhoPadrao, ...props }) {
    return (
      <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        {desenho}
      </svg>
    );
  };
}

// --- ícones que já existiam (mantidos) ---
export const IconeChat = fazerIcone(<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />, 16);
export const IconeOlho = fazerIcone(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>, 16);
export const IconeTime = fazerIcone(<><circle cx="12" cy="12" r="10" /><path d="M12 2a15 15 0 0 0 0 20M12 2a15 15 0 0 1 0 20M2 12h20" /></>);
export const IconeTaca = fazerIcone(<><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M7 5H4a1 1 0 0 0-1 1 5 5 0 0 0 4 5M17 5h3a1 1 0 0 1 1 1 5 5 0 0 1-4 5" /></>);

// --- ícones novos ---
export const IconeBola = fazerIcone(<><circle cx="12" cy="12" r="10" /><path d="m12 7 4.2 3-1.6 5H9.4l-1.6-5L12 7z" /><path d="M12 2v5M16.2 10l5-1.6M14.6 15l3 4M9.4 15l-3 4M7.8 10l-5-1.6" /></>, 22);
export const IconeBusca = fazerIcone(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>);
export const IconeAjuda = fazerIcone(<><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5M12 17.5h.01" /></>, 16);
export const IconeUsuario = fazerIcone(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>);
export const IconeSair = fazerIcone(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>);
export const IconeCamera = fazerIcone(<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>);
export const IconeUpload = fazerIcone(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></>);
export const IconeArquivo = fazerIcone(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>);
export const IconeCheck = fazerIcone(<path d="M20 6 9 17l-5-5" />);
export const IconeRelogio = fazerIcone(<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>);
export const IconeAlerta = fazerIcone(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>);
export const IconeEscudo = fazerIcone(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>);
export const IconeVideo = fazerIcone(<><rect x="2" y="5" width="20" height="14" rx="3" /><path d="m10 9 5 3-5 3z" /></>);
export const IconeEstrela = fazerIcone(<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />);
export const IconeSeta = fazerIcone(<path d="M5 12h14M13 6l6 6-6 6" />);
export const IconeMapa = fazerIcone(<><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>, 16);
export const IconeEmail = fazerIcone(<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>, 16);
export const IconeMais = fazerIcone(<path d="M12 5v14M5 12h14" />);
export const IconeLixeira = fazerIcone(<><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>);
export const IconeUsuarios = fazerIcone(<><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M17 4a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3" /></>);
export const IconeCadeado = fazerIcone(<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>);

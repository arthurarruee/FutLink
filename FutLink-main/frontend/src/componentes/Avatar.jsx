import { useEffect, useState } from 'react';
import { carregarFoto } from '../servicos/arquivos';

// Mostra a foto do usuário; se ele não tem foto, mostra as iniciais do nome.
// Uso: <Avatar usuarioId={12} nome="João Silva" tamanho={48} />
export default function Avatar({ usuarioId, nome = '', tamanho = 44, className = '' }) {
  const [url, setUrl] = useState(null);
  const [versao, setVersao] = useState(0); // aumenta quando a foto é trocada, para recarregar

  useEffect(() => {
    const aoTrocar = (evento) => {
      if (evento.detail === String(usuarioId)) setVersao((v) => v + 1);
    };
    window.addEventListener('futlink:foto', aoTrocar);
    return () => window.removeEventListener('futlink:foto', aoTrocar);
  }, [usuarioId]);

  useEffect(() => {
    let ativo = true;
    setUrl(null);
    if (usuarioId) {
      carregarFoto(usuarioId).then((endereco) => {
        if (ativo) setUrl(endereco);
      });
    }
    return () => {
      ativo = false;
    };
  }, [usuarioId, versao]);

  const iniciais = nome.split(' ').filter(Boolean).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase() || '?';
  const estilo = { width: tamanho, height: tamanho, fontSize: Math.max(11, tamanho * 0.36) };

  return url ? (
    <img src={url} alt={`Foto de ${nome || 'usuário'}`} className={`avatar ${className}`} style={estilo} />
  ) : (
    <span className={`avatar avatar-iniciais ${className}`} style={estilo} aria-label={nome ? `Iniciais de ${nome}` : undefined}>
      {iniciais}
    </span>
  );
}

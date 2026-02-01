import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtist, getArtistAlbums } from '../../services/spotifyService';
import '../../styles/ArtistDetail.css';

function ArtistDetail() {
  // Chame todos os hooks React no início da função
  const params = useParams();
  const navigate = useNavigate();
  
  const artistId = params.id || params.artistId;
  
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Se o artistId estiver indefinido, redirecionar
    if (!artistId) {
      setError("ID do artista não encontrado na URL");
      setTimeout(() => navigate('/top-artists'), 2000);
      setLoading(false);
      return;
    }

    // Validar formato do ID do Spotify (base62)
    const validSpotifyId = /^[0-9A-Za-z]{22}$/;
    if (!validSpotifyId.test(artistId)) {
      setError(`ID do artista inválido: ${artistId}`);
      setLoading(false);
      return;
    }

    const fetchArtistAndAlbums = async () => {
      try {
        const [artistData, albumsData] = await Promise.all([
          getArtist(artistId),
          getArtistAlbums(artistId, 50),
        ]);
        
        
        // Remover duplicados
        const uniqueAlbums = [];
        const albumNames = new Set();
        
        if (albumsData.items && Array.isArray(albumsData.items)) {
          albumsData.items.forEach(album => {
            if (!albumNames.has(album.name.toLowerCase())) {
              albumNames.add(album.name.toLowerCase());
              uniqueAlbums.push(album);
            }
          });
        }
        
        setAlbums(uniqueAlbums);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        
        if (error.message.includes("expirada") || error.message.includes("login")) {
          localStorage.removeItem('access_token');
          setError("Sessão expirada. Redirecionando para login...");
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.message.includes("inválido")) {
          setError(error.message);
        } else {
          setError("Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtistAndAlbums();
  }, [artistId, navigate]);

  if (loading) {
    return <div className="loading-spinner">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Não foi possível carregar os dados do artista</h2>
        <p className="error-message">{error}</p>
        <button 
          className="back-button" 
          onClick={() => navigate('/top-artists')}
        >
          Voltar para artistas
        </button>
      </div>
    );
  }

  return (
    <div className="artist-detail-container">
      {/* Cabeçalho com nome do artista */}
      {artist && (
        <div className="artist-header" 
             style={{backgroundImage: artist.images && artist.images.length > 0 ? 
               `url(${artist.images[0].url})` : 'none'}}>
          <div className="artist-header-overlay">
            <div className="artist-header-content">
              <h1>{artist.name}</h1>
            </div>
          </div>
        </div>
      )}
      
      {/* Grid de álbuns simplificado */}
      <div className="albums-grid">
        {albums && albums.length > 0 ? (
          albums.map(album => (
            <div className="album-card" key={album.id}>
              {/* Imagem do álbum */}
              {album.images && album.images.length > 0 ? (
                <img 
                  src={album.images[0].url} 
                  alt={`${album.name} cover`} 
                  className="album-image" 
                />
              ) : (
                <div className="album-image-placeholder">Sem imagem</div>
              )}
              
              <div className="album-info">
                {/* Nome do álbum */}
                <h3 className="album-name">{album.name || "Título desconhecido"}</h3>
                
                {/* Data de lançamento */}
                <p className="album-year">
                  {album.release_date ? new Date(album.release_date).getFullYear() : "Ano desconhecido"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-albums">Nenhum álbum encontrado</p>
        )}
      </div>
    </div>
  );
}

export default ArtistDetail;
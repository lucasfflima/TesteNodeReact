// Componente que exibe detalhes de um artista e seus álbuns
// Uso o useParams para pegar o ID do artista da URL
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// import './ArtistDetail.css';

function ArtistDetail() {
  const { artistId } = useParams(); // Pego o ID do artista da URL
  // Estados para armazenar os dados que vêm da API
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar dados do artista e seus álbuns
    const fetchArtistAndAlbums = async () => {
      try {
        // Pego o token de acesso do localStorage
        const token = localStorage.getItem('access_token');
        
        //busco os detalhes do artista
        const artistResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const artistData = await artistResponse.json();
        setArtist(artistData);
        
        //busco os álbuns do artista
        // Limitei a 50 álbuns para não sobrecarregar
        const albumsResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&limit=50`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const albumsData = await albumsResponse.json();
        
        // Esse trecho remove os álbuns com nomes duplicados
        // Spotify costuma retornar várias versões do mesmo álbum (deluxe, remasterizado, etc)
        const uniqueAlbums = [];
        const albumNames = new Set();
        
        albumsData.items.forEach(album => {
          if (!albumNames.has(album.name.toLowerCase())) {
            albumNames.add(album.name.toLowerCase());
            uniqueAlbums.push(album);
          }
        });
        
        setAlbums(uniqueAlbums);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      } finally {
        // Termino o loading independente de sucesso ou erro
        setLoading(false);
      }
    };

    fetchArtistAndAlbums();
  }, [artistId]); // Executa quando o ID do artista mudar

  // Mostro um spinner enquanto carrega os dados
  if (loading) {
    return <div className="loading-spinner">Carregando informações do artista...</div>;
  }

  return (
    <div className="artist-detail-container">
      {/* Cabeçalho com detalhes do artista */}
      {artist && (
        <>
          {/* Uso a imagem do artista como background com overlay */}
          <div className="artist-header" 
               style={{backgroundImage: `url(${artist.images?.[0]?.url})`}}>
            <div className="artist-header-overlay">
              <div className="artist-header-content">
                <h1>{artist.name}</h1>
                {/* Estatísticas do artista: seguidores e popularidade */}
                <div className="artist-stats">
                  <div className="stat">
                    <span className="stat-value">{artist.followers?.total.toLocaleString()}</span>
                    <span className="stat-label">seguidores</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{artist.popularity}%</span>
                    <span className="stat-label">popularidade</span>
                  </div>
                </div>
                {/* Tags com os gêneros musicais do artista */}
                <div className="artist-genres">
                  {artist.genres.map(genre => (
                    <span key={genre} className="genre-tag">{genre}</span>
                  ))}
                </div>
                {/* Link para o perfil do Spotify */}
                <a 
                  href={artist.external_urls?.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="spotify-link"
                >
                  Abrir no Spotify
                </a>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Grid de álbuns do artista */}
      <div className="albums-grid">
        {albums.map(album => (
          <a 
            href={album.external_urls.spotify} 
            target="_blank" 
            rel="noopener noreferrer"
            className="album-card"
            key={album.id}
          >
            {/* Imagem do álbum ou placeholder caso não tenha */}
            {album.images && album.images.length > 0 ? (
              <img src={album.images[0].url} alt={album.name} className="album-image" />
            ) : (
              <div className="album-image-placeholder"></div>
            )}
            {/* Informações do álbum: nome, ano e número de faixas */}
            <div className="album-info">
              <h3 className="album-name">{album.name}</h3>
              <p className="album-year">{new Date(album.release_date).getFullYear()}</p>
              <p className="album-tracks">{album.total_tracks} tracks</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default ArtistDetail;
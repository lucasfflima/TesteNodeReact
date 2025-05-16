// Importações básicas que estou utilizando
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import './TopArtists.css';

function TopArtists() {
  // Estados para gerenciar os dados e a interface
  const [artists, setArtists] = useState([]); // Lista de artistas que vem da API
  const [timeRange, setTimeRange] = useState('medium_term'); // Por padrão mostro os últimos 6 meses
  const [loading, setLoading] = useState(true); // Controle de carregamento

  useEffect(() => {
    // Função para buscar os artistas da API do Spotify
    const fetchTopArtists = async () => {
      setLoading(true); // Ativo o loading enquanto busco os dados
      try {
        // Pego o token que salvei no localStorage durante o login
        const token = localStorage.getItem('access_token');
        // Faço a requisição para a API do Spotify
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=20`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const data = await response.json();
        // Atualizo o estado com os artistas ou array vazio se não vier nada
        setArtists(data.items || []);
      } catch (error) {
        console.error('Error fetching top artists:', error);
      } finally {
        // Desativo o loading quando terminar, mesmo se der erro
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [timeRange]); // Executo sempre que o período de tempo mudar

  // Interface do componente
  return (
    <div className="top-artists-container">
      <h1>Seus Artistas Favoritos</h1>
      
      {/* Botões para trocar o período de tempo */}
      <div className="time-range-selector">
        {/* Destaco o botão ativo com classe 'active' */}
        <button 
          className={`time-btn ${timeRange === 'short_term' ? 'active' : ''}`}
          onClick={() => setTimeRange('short_term')}
        >
          Últimas 4 Semanas
        </button>
        <button 
          className={`time-btn ${timeRange === 'medium_term' ? 'active' : ''}`}
          onClick={() => setTimeRange('medium_term')}
        >
          Últimos 6 Meses
        </button>
        <button 
          className={`time-btn ${timeRange === 'long_term' ? 'active' : ''}`}
          onClick={() => setTimeRange('long_term')}
        >
          Todo Tempo
        </button>
      </div>
      
      {/* Mostro loading ou a lista de artistas baseado no estado */}
      {loading ? (
        <div className="loading-spinner">Carregando artistas...</div>
      ) : (
        <div className="artists-grid">
          {/* Mapeio cada artista para um card */}
          {artists.map((artist, index) => (
            <Link to={`/artist/${artist.id}`} className="artist-card" key={artist.id}>
              <div className="artist-rank">{index + 1}</div>
              <div className="artist-image-container">
                {/* Verifico se tem imagem antes de tentar exibir */}
                {artist.images && artist.images.length > 0 ? (
                  <img 
                    src={artist.images[0].url} 
                    alt={artist.name} 
                    className="artist-image" 
                  />
                ) : (
                  <div className="artist-image-placeholder"></div>
                )}
              </div>
              <div className="artist-info">
                <h3 className="artist-name">{artist.name}</h3>
                <p className="artist-genres">
                  {/* Mostro só os 2 primeiros gêneros para não poluir o card */}
                  {artist.genres.slice(0, 2).join(', ')}
                </p>
                <p className="artist-popularity">
                  Popularidade: {artist.popularity}%
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopArtists;
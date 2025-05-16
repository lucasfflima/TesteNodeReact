import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getValidToken } from '../../utils/auth';
import '../../styles/TopArtists.css';

function TopArtists() {
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Quantidade de artistas por página
  const LIMIT = 20;
  
  // Referência para o elemento de observação do infinite scroll
  const observer = useRef();
  
  // Referência para o último elemento da lista
  const lastArtistRef = useCallback(node => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreArtists();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);
  
  // Função para carregar mais artistas
  const loadMoreArtists = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    
    fetchTopArtists(newOffset);
  };
  
  // Função para buscar artistas
  const fetchTopArtists = async (currentOffset = 0) => {
    try {
      const token = await getValidToken();
      
      const response = await fetch(
        `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${LIMIT}&offset=${currentOffset}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar artistas: ${response.status}`);
      }

      const data = await response.json();
      
      if (currentOffset === 0) {
        setArtists(data.items);
      } else {
        // Verifica se há novos itens antes de adicionar
        if (data.items.length === 0) {
          setHasMore(false);
        } else {
          setArtists(prevArtists => [...prevArtists, ...data.items]);
        }
      }
      
      // Verifica se chegamos ao final dos resultados
      setHasMore(data.total > currentOffset + data.items.length);
      
    } catch (error) {
      console.error('Erro ao buscar top artistas:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Efeito para buscar artistas no carregamento inicial e na troca de timeRange
  useEffect(() => {
    setArtists([]);
    setOffset(0);
    setHasMore(true);
    setLoading(true);
    
    fetchTopArtists(0);
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setArtists([]);
    setOffset(0);
    setHasMore(true);
    setLoading(true);
  };

  if (loading && artists.length === 0) {
    return <div className="loading">Carregando seus artistas favoritos...</div>;
  }

  return (
    <div className="top-artists-container">
      <h1>Top Artistas</h1>
      
      <div className="time-filter">
        <button 
          className={timeRange === 'short_term' ? 'active' : ''}
          onClick={() => handleTimeRangeChange('short_term')}
        >
          Últimas 4 Semanas
        </button>
        <button 
          className={timeRange === 'medium_term' ? 'active' : ''}
          onClick={() => handleTimeRangeChange('medium_term')}
        >
          Últimos 6 Meses
        </button>
        <button 
          className={timeRange === 'long_term' ? 'active' : ''}
          onClick={() => handleTimeRangeChange('long_term')}
        >
          Todo o Tempo
        </button>
      </div>

      <div className="artists-grid">
        {artists.length > 0 ? (
          artists.map((artist, index) => (
            <Link 
              // Adiciona referência ao último elemento para o infinite scroll
              ref={index === artists.length - 1 ? lastArtistRef : null}
              to={`/artist/${artist.id}`} 
              key={artist.id} 
              className="artist-card"
            >
              {artist.images && artist.images.length > 0 ? (
                <img 
                  src={artist.images[0].url} 
                  alt={artist.name} 
                  className="artist-image"
                />
              ) : (
                <div className="artist-image-placeholder"></div>
              )}
              <div className="artist-info">
                <h3>{artist.name}</h3>
                <p>{artist.followers.total.toLocaleString()} seguidores</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-artists">
            <p>Nenhum dado de artista disponível para este período.</p>
            <p>Tente outro intervalo de tempo ou ouça mais músicas no Spotify!</p>
          </div>
        )}
      </div>
      
      {loadingMore && (
        <div className="loading-more">
          Carregando mais artistas...
        </div>
      )}
      
      {!hasMore && artists.length > 0 && (
        <div className="no-more-artists">
          <p>Não há mais artistas para carregar.</p>
        </div>
      )}
    </div>
  );
}

export default TopArtists;
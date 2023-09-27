import { useEffect, useState, useContext } from 'react'

import styles from './styles.module.css'
import { Photo } from '../../models/Photo'
import { searchPhotos } from '../../services/PhotoService'
import { PacmanLoader } from 'react-spinners'
import ResultCard from '../../components/ResultCard'
import searchIcon from '../../assets/img/search.png'
import { UserContext } from '../../context/UserContext'

const Home = () => {
  const [loading, isLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [newSearch, isNewSearch] = useState(false)
  const [option, setOption] = useState('relevant')
  const [landscapeFilter, setLandscapeFilter] = useState('landscape')
  const [portraitFilter, setPortraitFilter] = useState('portraid')

  const { lastResult, setLastResult, query, setQuery } = useContext(UserContext)

  const searchResults = async () => {
    if (query.trim()) {
      console.log('Entrou')
      isLoading(true)
      setLastResult({
        photos: [],
        totalPages: 0,
      })
      const searchResult = await searchPhotos(query, option, page, {
        portrait: portraitFilter,
        landscape: landscapeFilter,
      })
      console.log(searchResult)
      setLastResult(searchResult)
      isLoading(false)
    }
  }

  useEffect(() => {
    console.log('Entrou no useEffect 1')
    searchResults()
  }, [page, option])

  useEffect(() => {
    if (newSearch) {
      console.log('Entrou no useEffect 2')
      setPage(1)
      searchResults()
      isNewSearch(false)
    }
  }, [newSearch, option])

  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type='text'
          className={styles.searchInput}
        />
        <button
          onClick={() => isNewSearch(true)}
          className={styles.searchButton}
        >
          Pesquisar
        </button>

        <div>
          <label htmlFor="option">Ordenar por: </label>
          <select
            id="option"
            onChange={(e) => setOption(e.target.value)}
            value={option}
          >
            <option value="relevant">Mais Relevantes</option>
            <option value="latest">Mais Recentes</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={portraitFilter}
              onChange={() => setPortraitFilter('portraid')}
            />
            Retrato
          </label>
          <label>
            <input
              type="checkbox"
              checked={landscapeFilter}
              onChange={() => setLandscapeFilter(!landscapeFilter)}
            />
            Paisagem
          </label>
        </div>

        <button
          onClick={() => isNewSearch(true)}
          className={styles.responsiveSearchButton}
        >
          <img src={searchIcon} alt='Pesquisar' />
        </button>
      </div>

      <PacmanLoader color='#fff' loading={loading} />

      {!loading && lastResult.photos.length > 0 && (
        <>
          <div className={styles.resultsArea}>
            {lastResult.photos.map((p: Photo) => (
              <ResultCard key={p.id} photo={p} />
            ))}
          </div>

          <div>
            {page > 1 && (
              <button
                className={styles.pageButton}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </button>
            )}
            <span className={styles.currentPageLabel}>
              Página {page} de {lastResult.totalPages}
            </span>
            {page < lastResult.totalPages && (
              <button
                className={styles.pageButton}
                onClick={() => setPage(page + 1)}
              >
                Próxima
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Home

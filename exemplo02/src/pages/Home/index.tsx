import { useEffect, useState, useContext, SetStateAction } from 'react'

import styles from './styles.module.css'
import { Photo } from '../../models/Photo'
import { searchPhotos } from '../../services/PhotoService'
import { PacmanLoader } from 'react-spinners'
import ResultCard from '../../components/ResultCard'
import searchIcon from '../../assets/img/search.png'
import { UserContext } from '../../context/UserContext'
import { Orientation } from 'unsplash-js'

const Home = () => {
  const [loading, isLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [newSearch, isNewSearch] = useState(false)
  const [option, setOption] = useState('relevant')
  const [orientation, setOrientation] = useState<Orientation>('landscape')


  const { lastResult, setLastResult, query, setQuery } = useContext(UserContext)

  const searchResults = async () => {
    if (query.trim()) {
      console.log('Entrou')
      isLoading(true)
      setLastResult({
        photos: [],
        totalPages: 0,
      })
      const searchResult = await searchPhotos(query, option, page, orientation)
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
  }, [newSearch, option, orientation])

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
          <label className={styles.option}>Ordenar por:</label>
          <select className={styles.optionButton}
            id="option" onChange={(e) => setOption(e.target.value)} value={option}>
            <option className={styles.optionButton} value="relevant">Mais Relevantes</option>
            <option className={styles.optionButton} value="latest">Mais Recentes</option>
          </select>
        </div>
        <div>
          <label className={styles.option}>Filtrar por:</label>
          <select   className={styles.optionButton}  id="orientation" onChange={(e) => setOrientation(e.target.value as 'landscape' | 'portrait')} value={orientation}>
            <option className={styles.optionButton} value="landscape">Paisagem</option>
            <option className={styles.optionButton} value="portrait">Retrato</option>
          </select>
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

import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import ScaleLoader from 'react-spinners/ScaleLoader';
import toast, { Toaster } from 'react-hot-toast';
import { fetchImages } from 'api';
import { imgPerPage } from 'api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import css from './App.module.css';

export const App = () => {
  const [searchText, setSearchText] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalImg, setTotalImg] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    if (searchText === '') {
      return;
    }

    async function update() {
      setIsLoading(true);
      try {
        const imgPixabay = await fetchImages(searchText, page);

        if (imgPixabay.totalHits > 0) {
          setImages(prevImg => [...prevImg, ...imgPixabay.hits]);

          if (page === 1) {
            toast.success(`We found ${imgPixabay.totalHits} images!`);
          }

          if (totalImg >= imgPixabay.totalHits) {
            setError(true);
            toast.error(
              "We're sorry, but you've reached the end of search results."
            );
          }
        } else {
          toast.error(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          setError(true);
        }
      } catch {
        toast.error('Photo not found. Please try it again.');
        setError(true);
      }
      setIsLoading(false);
    }
    update();
  }, [page, searchText, totalImg]);

  function onSubmit(event) {
    event.preventDefault();
    setSearchText(event.target.elements.input.value.trim());
    setPage(1);
    setImages([]);
    setTotalImg(imgPerPage);
    setError(null);
  }

  const nextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const countTotalImg = () => {
    setTotalImg(prevTotalImg => prevTotalImg + imgPerPage);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const handleImgClick = activeImg => {
    setActiveImg(activeImg);
    openModal();
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Searchbar onSubmit={onSubmit} />

      {showModal && (
        <Modal activeImg={activeImg} closeModal={closeModal}></Modal>
      )}
      {error && <div className={css.error}>{error}</div>}
      {images.length > 0 && (
        <ImageGallery handleImgClick={handleImgClick} images={images} />
      )}

      <div className={css.loader}>
        <ScaleLoader
          color="#3737d7"
          loading={isLoading}
          height={70}
          margin={6}
          radius={9}
          width={6}
        />
      </div>
      {!isLoading && !error && images.length > 0 && (
        <Button countTotalImg={countTotalImg} nextPage={nextPage} />
      )}
    </>
  );
};

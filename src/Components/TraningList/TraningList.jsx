import React, { useState } from "react";
import { TraningItem } from "../TraningItem/TraningItem";
import styles from "./TraningList.module.css"; // Импорт модульных стилей
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';

export function TraningList({ userTranings, loadUser }) {
  // Состояния для контроля порядка сортировки, фильтра и текущей страницы
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Количество элементов на странице
  const itemsPerPage = 10;

  // Функция для сортировки тренировок по дате
  const sortTranings = (tranings, order) => {
    return tranings.slice().sort((a, b) => {
      const dateA = new Date(a.created_date);
      const dateB = new Date(b.created_date);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  // Обработчик изменения порядка сортировки
  const handleSortOrderChange = () => {
    setSortOrder(prevOrder => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  // Обработчик изменения текста фильтра
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setCurrentPage(0); // Сброс текущей страницы при изменении фильтра
  };

  // Фильтрация и сортировка тренировок
  const filteredTranings = userTranings.filter(traning =>
    traning.title.toLowerCase().includes(filterText.toLowerCase())
  );
  const sortedTranings = sortTranings(filteredTranings, sortOrder);

  // Пагинация
  const offset = currentPage * itemsPerPage;
  const paginatedTranings = sortedTranings.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sortedTranings.length / itemsPerPage);

  // Обработчик страницы пагинации
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <button className={styles.sortButton} onClick={handleSortOrderChange}>
          <FontAwesomeIcon icon={sortOrder === 'desc' ? faArrowUp : faArrowDown} />
        </button>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={filterText}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
      </div>
      <div className={styles.trainingListContainer}>
        {paginatedTranings.map((traning) => (
          <div key={traning.id} className={styles.trainingItemWrapper}>
            <TraningItem traning={traning} loadUser={loadUser} />
          </div>
        ))}
      </div>
      {paginatedTranings.length ? <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={styles.pagination}
        activeClassName={styles.activePage}
        pageClassName={styles.page}
        previousLabel="Предыдущая"
        nextLabel="Следующая"
        nextClassName={styles.next}
        previousClassName={styles.previous}
      /> : ""}

    </main>
  );
}

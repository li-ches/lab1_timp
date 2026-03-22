import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Loader from '../components/Loader';
import ErrorBlock from '../components/ErrorBlock';

function Remove() {
  const { id } = useParams();
  const nav = useNavigate();
  const { current, loading, err, loadOne, deleteItem, clearErr } = useApp();

  const [deleting, setDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetch() {
      await loadOne(id);
      if (err === 'Запись не найдена') {
        setNotFound(true);
      }
    }
    fetch();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    const ok = await deleteItem(id);
    setDeleting(false);
    if (ok) nav('/list');
  }

  if (loading && !current) {
    return <Loader text="Загрузка данных..." />;
  }

  if (notFound || (err && !current)) {
    return (
      <div className="page">
        <ErrorBlock 
          msg={notFound ? 'Запись не найдена' : err} 
          onClose={() => {
            clearErr();
            nav('/list');
          }} 
        />
      </div>
    );
  }

  if (!current) {
    return null;
  }

  return (
    <div className="page remove">
      <div className="back">
        <Link to="/list">← Назад</Link>
      </div>

      <div className="remove-card">
        <div className="warning">
          <span className="icon">⚠</span>
          <h2>Удаление</h2>
        </div>

        <p className="message">
          Удалить эту запись?<br />
          <strong>Отменить нельзя</strong>
        </p>

        {err && <ErrorBlock msg={err} onClose={clearErr} />}

        <div className="preview">
          <div className="head">
            <h3>{current.name}</h3>
            <span className={'type ' + current.type}>
              {current.type}
            </span>
          </div>
          <div className="info">
            <p><strong>Протокол:</strong> {current.protocol}</p>
            <p><strong>Статус:</strong> {current.status}</p>
            <p><strong>Дата:</strong> {current.date}</p>
          </div>
        </div>

        <div className="remove-actions">
          <button 
            onClick={handleDelete} 
            className="btn danger"
            disabled={deleting}
          >
            {deleting ? 'Удаление...' : 'Да, удалить'}
          </button>
          <Link to={'/item/' + id} className="btn cancel">
            Отмена
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Remove;
import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/requests';

const AppContext = createContext();

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp должен использоваться внутри AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  function clearErr() {
    setErr('');
  }

  async function loadAll() {
    setLoading(true);
    setErr('');
    try {
      const res = await api.getAll();
      setItems(res.data);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          setErr('Данные не найдены');
        } else {
          setErr('Ошибка сервера ' + e.response.status);
        }
      } else if (e.request) {
        setErr('Сервер не отвечает, запустите json-server');
      } else {
        setErr('Неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadOne(id) {
    setLoading(true);
    setErr('');
    try {
      const res = await api.getOne(id);
      setCurrent(res.data);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setErr('Запись не найдена');
      } else {
        setErr('Ошибка загрузки');
      }
    } finally {
      setLoading(false);
    }
  }

  async function addItem(data) {
    setLoading(true);
    setErr('');
    try {
      const newId = items.length > 0 
        ? Math.max(...items.map(x => Number(x.id))) + 1 
        : 1;
      const toSend = { ...data, id: newId };
      const res = await api.create(toSend);
      setItems(prev => [...prev, res.data]);
      return true;
    } catch (e) {
      setErr('Не удалось добавить');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function changeItem(id, data) {
    setLoading(true);
    setErr('');
    try {
      const res = await api.update(id, data);
      const numId = Number(id);
      setItems(prev => prev.map(x => Number(x.id) === numId ? res.data : x));
      return true;
    } catch (e) {
      setErr('Не удалось обновить');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id) {
    setLoading(true);
    setErr('');
    try {
      await api.remove(id);
      const numId = Number(id);
      setItems(prev => prev.filter(x => Number(x.id) !== numId));
      return true;
    } catch (e) {
      setErr('Не удалось удалить');
      return false;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    items,
    current,
    loading,
    err,
    loadAll,
    loadOne,
    addItem,
    changeItem,
    deleteItem,
    clearErr,
    setCurrent
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
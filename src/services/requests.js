import axios from 'axios';

const url = 'http://localhost:5000/attacks';

function getAll() {
  return axios.get(url);
}

function getOne(id) {
  return axios.get(url + '/' + id);
}

function create(data) {
  return axios.post(url, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}

function update(id, data) {
  return axios.put(url + '/' + id, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}

function remove(id) {
  return axios.delete(url + '/' + id);
}

export { getAll, getOne, create, update, remove };
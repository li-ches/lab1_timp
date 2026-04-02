import axios from 'axios';

const url = 'http://localhost:5000/attacks';

function getAll() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.get(url));
    }, 5000);
  });
}

function getOne(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.get(url + '/' + id));
    }, 5000);
  });
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
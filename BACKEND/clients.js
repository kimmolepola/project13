let main;
const clients = {};

const addClientUnique = (id, socket) => {
  if (clients[id]) {
    return false;
  }
  clients[id] = socket;
  return true;
};

const removeClient = (id) => {
  delete clients[id];
};

const getClients = () => clients;

const setMain = (x) => {
  main = x;
};

const getMain = () => main;

module.exports = {
  addClientUnique,
  removeClient,
  getClients,
  setMain,
  getMain,
};

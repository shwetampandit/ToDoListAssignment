import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

function updateLocalStorage(items, folders) {
  const data = {
    items: items,
    folders: folders,
  };
  localStorage.setItem("items", JSON.stringify(data));
}

export const todoStore = new Vuex.Store({
  actions: {
    fetchData({ commit }) {
      const data = JSON.parse(localStorage.getItem("items")) || [];
      commit("setItems", data);
      let folders = JSON.parse(localStorage.getItem("folders")) || [];

      if (folders.length === 0) {
        commit("resetFolders"); // Reset folders array
        folders = []; // Update the local variable as well
      }

      commit("setFolders", folders);

    },
  },

  state: {
    items: JSON.parse(localStorage.getItem("items")) || [],
    folders: [],
  },
  getters: {
    items: (state) => {
      return state.items;
    },
    completedItems: (state) => {
      return state.items.filter((item) => item.completed);
    },
    totalItems: (state) => {
      return state.items.length;
    },
    totalCompletedItems: (state, getters) => {
      return getters.completedItems.length;
    },
    folders: (state) => {
      return state.folders;
    },
  },
  mutations: {
    resetFolders(state) {
      state.folders = [];
      localStorage.setItem("folders", JSON.stringify(state.folders));
    },
    setItems(state, items) {
      state.items = items;
      localStorage.setItem("items", JSON.stringify(items)); // Save items in local storage
    },
    setFolders(state, folders) {
      state.folders = folders;
      localStorage.setItem("folders", JSON.stringify(folders)); // Save folders in local storage
    },
    addItem: (state, payload) => {
      state.items.push(payload);
      // updateLocalStorage(state.items);
      updateLocalStorage(state.items, state.folders); // Save items in local storage
    },
    updateItem: (state, payload) => {
      const index = state.items.findIndex((item) => item.id === payload.id);
      state.items[index].completed = payload.completed;
      state.items[index].title = payload.title;
      state.items[index].folder = payload.folder;
      updateLocalStorage(state.items);
    },
    deleteItem: (state, payload) => {
      const index = state.items.findIndex((item) => item.id === payload.id);
      if (index > -1) state.items.splice(index, 1);
      updateLocalStorage(state.items);
    },
    addItemFolder: (state, payload) => {
      // const { itemId, folderId } = payload;
      const folder = state.folders.find((folder) => folder.id === payload.folderId);
      if (folder) {
        folder.items.push(payload.itemId);
        updateLocalStorage(state.items, state.folders);
      }
      else {
        state.folders.push({
          folderId: payload.folderId,
          itemIds: [payload.itemId],

        })
        updateLocalStorage(state.items, state.folders);

      }

    },
    addFolder(state, payload) {
      const newFolder = {
        folderId: payload.folderId,
        value: payload.value, // Add value property
        label: payload.value, // Add label property
        itemIds: payload.itemIds,
      };
      state.folders.push(newFolder);
      localStorage.setItem("folders", JSON.stringify(state.folders));
    },

  },
});

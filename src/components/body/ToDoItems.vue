<template>
  <div class="container">
    <div id="to-do-items">
      <div v-if="items.length > 0">
        <p v-if="totalItems === 0 || items.length == 0">No items to display.</p>

        <ToDoItem v-for="item in items" :key="item.id" :item="item" />
        <div class="container1">
          <div id="to-do-input">
            <b-button
              id="butDownload"
              v-if="totalItems !== 0"
              v-on:click="downloadData"
            >
              Download
            </b-button>
            &nbsp;
            <b-button
              id="btnDownload"
              class="test"
              v-b-modal.modal-1
              v-if="totalItems !== 0"
              >Save to Folder</b-button
            >
          </div>
          &nbsp;
          <div id="to-do-input">
            <b-input
              class="input"
              v-model="newFolder"
              placeholder="New Folder"
            ></b-input>
            <b-button class="custom-button" @click="addFolder"
              >Add Folder</b-button
            >&nbsp;
          </div>
        </div>
        <b-modal
          id="modal-1"
          title="Select Folder"
          @ok="addFolderItem"
          ok-title="Save"
        >
          <!-- Dynamic Radio Button -->
          <div v-if="dynamicOptions.length > 0">
            <div v-for="option in dynamicOptions" :key="option.id">
              <input
                type="radio"
                :id="option.id"
                :name="'dynamic-group-' + option.id"
                :value="option.value"
                v-model="selectedFolder"
              />
              <label :for="option.id">{{ option.label }}</label>
            </div>
          </div>
          <div v-else>
            <p>No Folder added. Please add folder first.</p>
          </div>
        </b-modal>
        <!-- Display folders -->
        <div class="bcard" v-if="folders.length > 0">
          <h2>Folders:</h2>
          <div v-for="folder in folders" :key="folder.folderId">
            <b-card :title="folder.label" style="max-width: 20rem">
              <b-card-text>
                <!-- <li v-for="item in folders.itemIds" :key="item.id"></li> -->
              </b-card-text>
            </b-card>
            &nbsp;
          </div>
        </div>
      </div>
      <p v-else>No items to display.</p>
    </div>
  </div>
</template>

<script>
import ToDoItem from "./ToDoItem.vue";
import { mapGetters, mapMutations } from "vuex";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { BModal, BButton } from "bootstrap-vue";

export default {
  name: "ToDoItems",
  data() {
    return {
      dynamicOptions: [],
      newFolder: "",
      selectedFolder: null,
    };
  },
  components: { ToDoItem, "b-modal": BModal, "b-button": BButton },
  created() {
    this.$store.dispatch("fetchData");
  },
  computed: {
    ...mapGetters(["items", "totalItems", "folders"]),
    ...mapMutations(["setItems"]),
  },
  methods: {
    addFolderItem() {
      if (this.selectedFolder) {
        const folderId = Date.now();
        const folder = this.folders.find(
          (folder) => folder.folderId === this.selectedFolder
        );
        if (folder) {
          const itemIds = [];

          for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const itemId = item.id;
            const itemName = item.name;

            itemIds.push({ itemId, itemName });
          }

          const payload = {
            folderId: folderId,
            itemIds: itemIds,
          };

          this.$store.commit("addItemFolder", payload);
        }
      }
    },

    addFolder() {
      if (this.newFolder.trim() !== "") {
        const folderId = Date.now();
        const folderValue = this.newFolder.trim();

        const option = {
          folderId: folderId,
          value: folderValue,
          label: folderValue,
        };

        this.dynamicOptions.push(option);
        this.newFolder = "";
        const payload = {
          folderId: folderId,
          value: folderValue,
          itemIds: [],
        };

        this.$store.commit("addFolder", payload);
        console.log("118", this.$store.getters.folders);
      }
    },
    downloadData() {
      const data = this.$store.state.items;
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const fileData = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(fileData, "data.xlsx");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  height: 40px;
  border-radius: 10px 0 0 10px;
  text-align: center;
}
#to-do-input {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bcard {
  display: flex;
  flex-direction: column;
}
.container1 {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.reset-button {
  border-width: 0;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  padding: 0;
}

.custom-button {
  height: 100%;
  font-size: 16px;
  border-radius: 0 10px 10px 0;
  width: 125px;
  background: #d9d9d9;
  color: #555;
  cursor: pointer;
  border: none;
}
.test {
  height: 100%;
  font-size: 16px;
  border-radius: 10px 10px 10px 10px;
  width: 150px;
  background: #d9d9d9;
  color: #555;
  cursor: pointer;
  border: none;
}
#butDownload {
  height: 100%;
  font-size: 16px;
  border-radius: 10px 10px 10px 10px;
  width: 125px;
  background: #d9d9d9;
  color: #555;
  cursor: pointer;
  border: none;
}
#to-do-items {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input {
  padding: 5px 0;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
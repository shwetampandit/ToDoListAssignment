<template>
  <div class="to-do-item">
    <div class="item-left">
      <input
        type="checkbox"
        v-bind:checked="itemCopy.completed"
        v-on:change="changeCheck"
      />
    </div>
    <input
      class="item"
      v-bind:class="{ completed: itemCopy.completed }"
      v-bind:disabled="!isEditing"
      v-model="itemCopy.title"
      v-on:keyup.enter="updateItem"
    />
    <div class="item-right">
      <i class="fas fa-trash red" @click="deleteItem(item.id)"></i>
      <div v-if="showDeleteMessage" class="popup-message">
        Item deleted successfully!
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "ToDoItems",
  props: {
    item: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      itemCopy: { ...this.item },
      isEditing: false,
      showDeleteMessage: false,
    };
  },
  methods: {
    updateItem() {
      this.$store.commit("updateItem", {
        id: this.item.id,
        completed: this.item.completed,
        title: this.item.title,
      });
      this.isEditing = false;
    },
    deleteItem(id) {
      this.$store.commit("deleteItem", { id });
      this.showDeleteMessage = true;
      setTimeout(() => {
        this.showDeleteMessage = false;
      }, 3000);
    },
    changeCheck() {
      this.itemCopy.completed = !this.itemCopy.completed;
      this.$store.commit("updateItem", {
        id: this.item.id,
        completed: this.itemCopy.completed,
        title: this.itemCopy.title,
      });
    },
  },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.to-do-item {
  margin-bottom: 10px;
  position: relative;
  transition: transform 0.5s ease-in-out;
  width: 500px;
}

input.item {
  width: 100%;
  padding: 12px 15px 12px 35px;
  font-size: 20px;
  border: none;
  border-radius: 10px;
  border: 1px solid #80bdab;
  color: black;
  outline: none;
}

input.completed {
  text-decoration: line-through;
  color: #0075ff;
}

.item-right {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translate(-50%, -50%);
}

.item-left {
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(50%, -50%);
}

.item-left input {
  border-radius: 50%;
}

i {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

i.green:hover {
  color: #4caf50;
}

i.red:hover {
  color: #f44336;
}

i {
  margin-right: 2px;
}

i:last-of-type {
  margin-right: 0;
}

@media screen and (max-width: 600px) {
  .to-do-item {
    width: 100%;
  }
}
</style>
    
<template>
  <div class="container">
    <kanban-board :stages="stages" :blocks="exBlocks" @update-block="updateBlock">
      <div v-for="stage in stages" :key="stage" :slot="stage">
        <h2>{{ stage }}</h2>
      </div>

      <div v-for="block in exBlocks" :key="block.status + block.id" :slot="block.id">
        <div>
          <span class="text-info" style="font-size:12px"> {{ block.name }} </span>
        </div>
        <div>
          <span class="text-warning" style="font-size:12px"> {{ block.exNum }} </span><br>
        </div>
        <div v-if="block.change !== ' - ' ">
          <span class="text-secondary" style="font-size:10px"> {{ block.change }} {{ block.agile }} </span>
        </div>

      </div>

    </kanban-board>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stages: ["Not Started", "In Progress", "Completed"],
      exBlocks: []
    };
  },

  created() {
    // Populate Tasks

    let uri = "/task";
    if (process.env.NODE_ENV !== "production") {
      uri = "http://localhost:4000/task";
    }
    this.axios
      .get(uri, { withCredentials: true })
      .then(() => {
        // Populate Exceptions

        uri = "/exception";
        if (process.env.NODE_ENV !== "production") {
          uri = "http://localhost:4000/exception";
        }
        this.axios
          .get(uri, { withCredentials: true })
          .then(() => {
            // Retrieve Agile Change Status

            uri = "/agile";
            if (process.env.NODE_ENV !== "production") {
              uri = "http://localhost:4000/agile";
            }
            this.axios
              .get(uri, { withCredentials: true })
              .then(() => {
                // Summary

                uri = "/summary";
                if (process.env.NODE_ENV !== "production") {
                  uri = "http://localhost:4000/summary";
                }
                this.axios
                  .get(uri, { withCredentials: true })
                  .then(response => {
                    this.exBlocks = response.data.map(summary => ({
                      id: summary.Id,
                      exNum: summary.ExceptionNumber,
                      status: summary.Status,
                      change:
                        summary.Exception_Agile_ECO_MCO__c +
                        " - " +
                        summary.ECO_MCO_status,
                      name: summary.Name
                    }));
                  })
                  .catch(() => {
                    console.log("get summary catch");
                  });
              })
              .catch(() => {
                console.log("get agile catch");
              });
          })
          .catch(() => {
            console.log("get exception catch");
          });
      })
      .catch(() => {
        console.log("get task catch");
      });
  },
  methods: {
    updateBlock(id, status) {
      let bl = this.blocks.find(b => b.id === id);
      console.log(this.blocks.find(b => b.id === id));
      bl.status = status;
      let uri = "";
      if (status === "In Progress") {
        uri = `/task/progress/${bl.exId}`;
        if (process.env.NODE_ENV !== "production") {
          uri = `http://localhost:4000/task/progress/${bl.exId}`;
        }
      } else {
        uri = `/task/complete/${bl.exId}`;
        if (process.env.NODE_ENV !== "production") {
          uri = `http://localhost:4000/task/complete/${bl.exId}`;
        }
      }
      this.axios
        .post(uri, bl.exId, { withCredentials: true })
        .then(() => {
          this.$router.push({ name: "kanban" });
          location.reload();
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss">
@import "../assets/kanban.scss";
</style>

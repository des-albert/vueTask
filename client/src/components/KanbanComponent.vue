<template>
  <div class="container">
    <kanban-board
      :stages="stages"
      :blocks="blocks"
      @update-block="updateBlock"
    >
      <div
        v-for="stage in stages"
        :key="stage"
        :slot="stage"
      >
        <h2>{{ stage }}</h2>
      </div>
      <div
        v-for="block in blocks"
        :key="block.id"
        :slot="block.id"
      >
        <div>
          <span class="text-warning"> {{ block.id }} </span>
        </div>
        <div>
          <span class="text-light"> {{ block.title }} </span>
        </div>
      </div>
    </kanban-board>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stages: ['Not Started', 'In Progress', 'Completed'],
      blocks: []
    };
  },

  created() {

    // Populate Tasks

    let uri = '/task';
    if (process.env.NODE_ENV !== 'production') {
      uri = 'http://localhost:4000/task';
    }
    this.axios.get(uri, {withCredentials: true})
      .then(() => {

        // Populate Exceptions

        uri = '/exception';
        if (process.env.NODE_ENV !== 'production') {
          uri = 'http://localhost:4000/exception';
        }
        this.axios.get(uri, {withCredentials: true})
          .then(() => {

            // Retrieve Agile Change Status

            uri = '/agile';
            if (process.env.NODE_ENV !== 'production') {
              uri = 'http://localhost:4000/agile';
            }
            this.axios.get(uri, {withCredentials: true})
              .then(() => {

                // Summary

                uri = '/summary';
                if (process.env.NODE_ENV !== 'production') {
                  uri = 'http://localhost:4000/summary';
                }
                this.axios.get(uri, {withCredentials: true})
                  .then(response => {
                    this.blocks = response.data.map(summary => ({
                      id: summary.ExceptionNumber,
                      exId: summary.Id,
                      status: summary.Status,
                      title: summary.Exception_Agile_ECO_MCO__c + ' - ' + summary.ECO_MCO_status
                    }));
                  })
                  .catch(() => {
                    console.log('get summary catch');
                  });
              })
              .catch(() => {
                console.log('get agile catch');
              });
          })
          .catch(() => {
            console.log('get exception catch');
          });
      })
      .catch(() => {
        console.log('get task catch');
      });
  },
  methods: {
    updateBlock(id, status) {
      let bl = this.blocks.find(b => b.id === id);
      console.log(this.blocks.find(b => b.id === id));
      bl.status = status;
      let uri = '';
      if (status === 'In Progress') {
        uri = `/task/progress/${bl.exId}`;
        if (process.env.NODE_ENV !== 'production') {
          uri = `http://localhost:4000/task/progress/${bl.exId}`;
        }
      }
      else {
        uri = `/task/complete/${bl.exId}`;
        if (process.env.NODE_ENV !== 'production') {
          uri = `http://localhost:4000/task/complete/${bl.exId}`;
        }
      }
      this.axios.post(uri, bl.exId, {withCredentials: true})
        .then(() => {
          this.$router.push({name: 'kanban'});
          location.reload();
        })
        .catch( () => {
        });
    },
  }
};
</script>
<style lang="scss">
  @import '../assets/kanban.scss';
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { renderProps } from './render'

export default defineComponent({
  name: 'MRender',
  props: renderProps,
  render(props) {
    return props.render
  }
})
</script>

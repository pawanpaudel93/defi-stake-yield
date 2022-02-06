<template>
  <v-container>
    <span class="black--text">{{ label }}</span>
    <span class="black--text font-weight-bold">{{ amount }}</span>
    <div class="d-inline-block" style="vertical-align: middle">
      <v-img :src="tokenImageSrc" width="32" height="32" />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class WalletMessage extends Vue {
  @Prop({ required: true }) label!: string
  @Prop({ required: true }) tokenImageSrc!: string
  @Prop({ required: true }) amount!: number
}
</script>
<template>
  <v-card class="rounded-xl" elevation="12" outlined>
    <v-card-title>
      <span class="headline">Your Stake</span>
    </v-card-title>
    <v-tabs v-model="tab" background-color="primary">
      <v-tab v-for="item in supportedTokens" :key="item.name">
        {{ item.name }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in supportedTokens" :key="item.name">
        <v-card flat>
          <v-card-text v-if="isConnected">
            <div class="text-center"><StakeBalance :token="item" /></div>
            <UnstakeForm :token="item" />
          </v-card-text>
          <v-card-text v-else class="text-center">
            <v-alert dense outlined type="error">
              Please connect your wallet.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
import StakeBalance from '@/components/Contract/StakeBalance.vue'
import UnstakeForm from '@/components/Contract/UnstakeForm.vue'
import { Token } from '~/interfaces/token'

const wallet = namespace('wallet')

@Component({
  components: {
    StakeBalance,
    UnstakeForm,
  },
})
export default class YourStake extends Vue {
  @Prop({ required: true }) supportedTokens!: Array<Token>
  tab = null
  @wallet.State
  public isConnected!: boolean
}
</script>
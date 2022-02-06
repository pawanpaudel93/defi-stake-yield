<template>
  <v-app>
    <Header />
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import { provider } from '~/plugins/provider'
import Header from '@/components/Header.vue'
declare let window: any

const wallet = namespace('wallet')

@Component({
  components: {
    Header,
  },
})
export default class Default extends Vue {
  @wallet.State
  public isConnected!: boolean

  @wallet.State
  public supportedChainIds!: number[]

  @wallet.State
  public connectedAddress!: string

  @wallet.Mutation
  public setConnected!: (isConnected: boolean) => void

  @wallet.Mutation
  public setConnectedAddress!: (address: string) => void

  mounted() {
    window.ethereum.on('accountsChanged', (account: string[]) => {
      if (account) {
        this.setConnectedAddress(account[0])
        this.$nuxt.$emit('fetchBalance')
      } else {
        this.setConnectedAddress('')
        this.setConnected(false)
      }
    })

    window.ethereum.on('chainChanged', async (chainId: string) => {
      if (this.supportedChainIds.includes(parseInt(chainId, 16))) {
        try {
          const signer = this.connectedAddress
            ? await provider.getSigner(this.connectedAddress)
            : await provider.getSigner()
          this.setConnectedAddress(await signer.getAddress())
          this.setConnected(true)
        } catch (e) {
          this.setConnected(false)
        }
        this.$nuxt.$emit('chainSupported', true)
      } else {
        this.$nuxt.$emit('chainSupported', false)
        this.setConnected(false)
      }
      this.$nuxt.$emit('fetchBalance')
    })
  }
}
</script>

<style>
.v-application,
.v-toolbar__content {
  background: linear-gradient(
    135deg,
    hsl(227, 61%, 13%),
    hsl(227, 61%, 26%),
    hsl(227, 61%, 39%)
  ) !important;
}
</style>

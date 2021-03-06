<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        <nuxt-link
          class="white--text"
          to="/"
          tag="span"
          style="cursor: pointer"
        >
          {{ appTitle }}
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn v-if="!isConnected" color="primary" @click="connect"
        >Connect</v-btn
      >
      <v-btn v-if="isConnected" class="mr-2">{{ address }}</v-btn>
      <v-btn v-if="isConnected" color="warning" @click="disconnect"
        >Disconnect</v-btn
      >
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import { provider } from '~/plugins/provider'

const wallet = namespace('wallet')

@Component
export default class Header extends Vue {
  appTitle: string = 'Defi Stake Yield'
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

  async mounted() {
    try {
      const signer = this.connectedAddress
        ? await provider.getSigner(this.connectedAddress)
        : await provider.getSigner()
      const { chainId } = await provider.getNetwork()
      if (chainId && signer && this.supportedChainIds.includes(chainId)) {
        this.setConnectedAddress(await signer.getAddress())
        this.setConnected(true)
      } else {
        this.$nuxt.$emit('chainSupported', false)
        this.setConnected(false)
      }
    } catch (e) {
      this.setConnected(false)
    }
  }

  async connect(): Promise<void> {
    try {
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      this.setConnectedAddress(await signer.getAddress())
      this.setConnected(true)
      this.$nuxt.$emit('fetchBalance')
    } catch (e) {
      console.error('Header', e)
    }
  }

  get address(): string {
    if (this.connectedAddress) {
      const address =
        this.connectedAddress.slice(0, 4) +
        '...' +
        this.connectedAddress.slice(-3)
      return address
    }
    return ''
  }

  disconnect(): void {
    this.setConnected(false)
  }
}
</script>
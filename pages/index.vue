<template>
  <div>
    <YourWallet
      v-if="supportedChain === true"
      class="mt-6"
      :supported-tokens="supportedTokens"
    />
    <YourStake
      v-if="supportedChain"
      class="mt-10"
      :supported-tokens="supportedTokens"
    />
    <v-card
      v-else-if="supportedChain === false"
      class="rounded-xl mt-12"
      elevation="12"
      outlined
    >
      <v-card-title>
        <span class="headline">Your Wallet</span>
      </v-card-title>
      <v-card-text class="text-center">
        <v-alert dense outlined type="error">
          {{ warningText }}
        </v-alert>
      </v-card-text>
    </v-card>
    <div v-else class="text-center mt-12">
      <h1 class="white--text">Welcome to Token Farm Dapp</h1>
      <v-progress-circular
        :size="100"
        color="green"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import { constants } from 'ethers'
import { provider } from '~/plugins/provider'
import networkMapping from '~/chain-info/deployments/map.json'
import brownieConfig from '~/brownie-config.json'
import YourWallet from '~/components/Wallet/YourWallet.vue'
import YourStake from '~/components/Contract/YourStake.vue'
import { Token, networkMap } from '~/interfaces/token'

const wallet = namespace('wallet')

@Component({
  components: {
    YourWallet,
    YourStake,
  },
})
export default class Home extends Vue {
  dappTokenAddress: string = constants.AddressZero
  wethTokenAddress: string = constants.AddressZero
  fauTokenAddress: string = constants.AddressZero

  supportedTokens: Array<Token> = []
  supportedChain: boolean | null = null
  warningText: string = ''

  @wallet.State
  public supportedChainIds!: number[]

  head() {
    return {
      title: 'Home',
    }
  }

  async setupDapp() {
    try {
      const { chainId, name } = await provider.getNetwork()
      this.dappTokenAddress = chainId
        ? (networkMapping as networkMap)[String(chainId)].DappToken[0]
        : constants.AddressZero
      this.wethTokenAddress = chainId
        ? (brownieConfig as any).networks[name].weth_token
        : constants.AddressZero
      this.fauTokenAddress = chainId
        ? (brownieConfig as any).networks[name].fau_token
        : constants.AddressZero
      this.supportedTokens = [
        {
          image: require('@/assets/images/dapp.png'),
          address: this.dappTokenAddress,
          name: 'DAPP',
        },
        {
          image: require('@/assets/images/eth.png'),
          address: this.wethTokenAddress,
          name: 'WETH',
        },
        {
          image: require('@/assets/images/dai.png'),
          address: this.fauTokenAddress,
          name: 'DAI',
        },
      ]
      this.supportedChain = true
    } catch (e) {
      const { chainId, name } = await provider.getNetwork()
      if (!this.supportedChainIds.includes(chainId)) {
        this.supportedChain = false
        this.warningText = `${name} (${chainId}) is not supported. Please use a supported network.`
      }
    }
  }

  async created() {
    await this.setupDapp()
  }

  mounted() {
    this.$nuxt.$on('chainSupported', async (supported: boolean) => {
      this.supportedChain = supported
      if (!supported) {
        try {
          const { chainId, name } = await provider.getNetwork()
          this.warningText = `${name} (${chainId}) is not supported. Please use a supported network.`
        } catch (e) {
          this.warningText = `Current network is not supported. Please use a supported network.`
        }
      } else {
        this.warningText = ''
        this.setupDapp()
      }
    })
  }

  beforeDestroy() {
    this.$nuxt.$off('chainSupported')
  }
}
</script>
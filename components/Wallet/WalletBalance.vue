<template>
  <BalanceMessage
    :label="'Your un-staked ' + token.name + ' balance'"
    :token-image-src="token.image"
    :amount="tokenBalance"
  />
</template>
<script lang="ts">
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
import { ethers } from 'ethers'
import { provider } from '~/plugins/provider'
import ERC20 from '~/chain-info/contracts/MockERC20.json'
import BalanceMessage from '~/components/Wallet/BalanceMessage.vue'
import { Token } from '~/interfaces/token'

const wallet = namespace('wallet')

@Component({
  components: {
    BalanceMessage,
  },
})
export default class WalletBalance extends Vue {
  @Prop({ required: true }) token!: Token

  tokenBalance: number = 0
  @wallet.State
  public isConnected!: boolean

  @wallet.Mutation
  public setConnected!: (isConnected: boolean) => void

  async setTokenBalance() {
    try {
      const contract = new ethers.Contract(
        this.token.address,
        ERC20.abi,
        provider
      )

      const address = await provider.getSigner().getAddress()
      const balance = (await contract.balanceOf(address)).toString()
      this.tokenBalance = parseFloat(ethers.utils.formatEther(balance))
    } catch (e: any) {
      if (e.operation === 'getAddress') {
        this.setConnected(false)
      }
    }
  }

  created() {
    if (this.isConnected) {
      this.setTokenBalance()
    }
  }

  mounted() {
    this.$nuxt.$on('fetchBalance', () => {
      this.setTokenBalance()
    })
  }

  beforeDestroy() {
    this.$nuxt.$off('fetchBalance')
  }
}
</script>
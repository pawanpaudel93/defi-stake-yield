<template>
  <BalanceMessage
    :label="'Your staked ' + token.name + ' balance'"
    :token-image-src="token.image"
    :amount="stakedBalance"
  />
</template>
<script lang="ts">
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
import { utils, constants, Contract } from 'ethers'
import { provider } from '~/plugins/provider'
import BalanceMessage from '~/components/Wallet/BalanceMessage.vue'
import { Token, networkMap } from '~/interfaces/token'
import TokenFarm from '@/chain-info/contracts/TokenFarm.json'
import networkMapping from '~/chain-info/deployments/map.json'

const wallet = namespace('wallet')

@Component({
  components: {
    BalanceMessage,
  },
})
export default class StakeBalance extends Vue {
  @Prop({ required: true }) token!: Token

  stakedBalance: number = 0
  @wallet.State
  public isConnected!: boolean

  @wallet.Mutation
  public setConnected!: (isConnected: boolean) => void

  async setStakeBalance() {
    try {
      const { chainId } = await provider.getNetwork()
      const tokenFarmAddress = chainId
        ? (networkMapping as networkMap)[String(chainId)].TokenFarm[0]
        : constants.AddressZero
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      const tokenFarmContract = new Contract(
        tokenFarmAddress,
        TokenFarm.abi,
        signer
      )
      const stakedBalance = (
        await tokenFarmContract.getUserSingleTokenValue(
          address,
          this.token.address
        )
      ).toString()
      this.stakedBalance = parseFloat(utils.formatEther(stakedBalance))
    } catch (e: any) {
      if (e.operation === 'getAddress') {
        this.setConnected(false)
      }
    }
  }

  created() {
    if (this.isConnected) {
      this.setStakeBalance()
    }
  }

  mounted() {
    this.$nuxt.$on('fetchBalance', () => {
      this.setStakeBalance()
    })
  }

  beforeDestroy() {
    this.$nuxt.$off('fetchBalance')
  }
}
</script>
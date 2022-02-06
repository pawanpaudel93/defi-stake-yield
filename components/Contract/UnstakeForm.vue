<template>
  <div>
    <div class="text-center">
      <v-btn
        :loading="isLoading"
        :disabled="isLoading"
        color="primary"
        @click="unstakeToken"
        >UnStake</v-btn
      >
    </div>
    <v-snackbar v-model="snackbar" timeout="5000" color="success" outlined>
      {{ snackbarText }}

      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator'
import { constants, Contract } from 'ethers'
import { provider } from '~/plugins/provider'
import { Token, networkMap } from '~/interfaces/token'
import TokenFarm from '@/chain-info/contracts/TokenFarm.json'
import networkMapping from '~/chain-info/deployments/map.json'

const wallet = namespace('wallet')

@Component
export default class StakeForm extends Vue {
  @Prop({ required: true }) token!: Token

  isLoading: boolean = false
  snackbar: boolean = false
  snackbarText: string = ''

  @wallet.State
  public connectedAddress!: string

  async unstakeToken() {
    const { chainId } = await provider.getNetwork()
    const tokenFarmAddress = chainId
      ? (networkMapping as networkMap)[String(chainId)].TokenFarm[0]
      : constants.AddressZero
    const signer = this.connectedAddress
      ? await provider.getSigner(this.connectedAddress)
      : await provider.getSigner()
    const tokenFarmContract = new Contract(
      tokenFarmAddress,
      TokenFarm.abi,
      signer
    )
    try {
      this.isLoading = true
      const stakeTransaction = await tokenFarmContract.unstakeTokens(
        this.token.address
      )
      await stakeTransaction.wait()
      this.snackbarText = 'Tokens UnStaked!'
      this.snackbar = true
      this.$nuxt.$emit('fetchBalance')
    } catch (e) {
      console.error('UnStakeForm', e)
    }
    this.isLoading = false
  }
}
</script>
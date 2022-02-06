<template>
  <div>
    <v-text-field
      v-model="amount"
      class="shrink"
      type="number"
      :rules="rules"
    ></v-text-field>

    <div class="text-center">
      <v-btn
        :loading="isLoading"
        :disabled="isLoading"
        color="primary"
        @click="stakeToken"
        >Stake</v-btn
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
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { constants, utils, Contract } from 'ethers'
import { provider } from '~/plugins/provider'
import { Token, networkMap } from '~/interfaces/token'
import TokenFarm from '@/chain-info/contracts/TokenFarm.json'
import networkMapping from '~/chain-info/deployments/map.json'
import ERC20 from '~/chain-info/contracts/MockERC20.json'

@Component
export default class StakeForm extends Vue {
  @Prop({ required: true }) token!: Token

  amount: number | Array<number> = 0
  isLoading: boolean = false
  snackbar: boolean = false
  snackbarText: string = ''
  rules: Array<any> = [
    (v: number) => !!v || 'Amount is required',
    (v: number) => v > 0 || 'Amount must be greater than 0',
  ]

  async stakeToken() {
    const { chainId } = await provider.getNetwork()
    const tokenFarmAddress = chainId
      ? (networkMapping as networkMap)[String(chainId)].TokenFarm[0]
      : constants.AddressZero
    const signer = provider.getSigner()
    const tokenFarmContract = new Contract(
      tokenFarmAddress,
      TokenFarm.abi,
      signer
    )
    const erc20Contract = new Contract(this.token.address, ERC20.abi, signer)
    const amountAsWei = utils.parseEther(this.amount.toString())
    try {
      this.isLoading = true
      const approveTransaction = await erc20Contract.approve(
        tokenFarmAddress,
        amountAsWei
      )
      await approveTransaction.wait()
      this.snackbarText =
        'ERC-20 token transfer approved! Now approve the 2nd transaction.'
      this.snackbar = true
      const stakeTransaction = await tokenFarmContract.stakeTokens(
        amountAsWei,
        this.token.address
      )
      await stakeTransaction.wait()
      this.snackbarText = 'Tokens Staked!'
      this.snackbar = true
      this.$nuxt.$emit('fetchBalance')
    } catch (e) {
      console.log('StakeForm', e)
    }
    this.isLoading = false
  }
}
</script>
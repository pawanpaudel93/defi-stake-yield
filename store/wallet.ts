import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
    name: 'wallet',
    stateFactory: true,
    namespaced: true
})

export default class Wallet extends VuexModule {
    public isConnected: boolean = false
    public supportedChainIds: number[] = [42]
    public connectedAddress: string = ''

    @Mutation
    public setConnected(isConnected: boolean) {
        this.isConnected = isConnected
    }

    @Mutation
    public setConnectedAddress(address: string) {
        this.connectedAddress = address
    }

    // @Action
    // public setConnectedAction(isConnected: boolean) {
    //     this.context.commit('setConnected', isConnected)
    // }
}
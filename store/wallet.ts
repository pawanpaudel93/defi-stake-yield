import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
    name: 'wallet',
    stateFactory: true,
    namespaced: true
})

export default class Wallet extends VuexModule {
    public isConnected: boolean = false
    public supportedChainIds: number[] = [42]

    @Mutation
    public setConnected(isConnected: boolean) {
        this.isConnected = isConnected
    }

    // @Action
    // public setConnectedAction(isConnected: boolean) {
    //     this.context.commit('setConnected', isConnected)
    // }
}
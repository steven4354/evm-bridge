# evm-bridge

## Installation
Copy file .env.sample to .env

```
npm install
npx hardhat compile
```

## Test on main nets with USDC (betwen polygon and bsc)
In `hardhat.config.ts`, main nets are configured with four test accounts, nicknamed `owner`, `relayOwner`, `bob` and `alice`. The preconfigured private keys for these four accounts are read from `.env` file.
`owner` account is one who bridge contract and `relayOwner` is the account invoking the contract from the relayer.
In `cfgs` directory, the addresses of already deoployed contracts are stored.

To see the current status of deoployment,

`npx hardhat stat --chain polygon`, or

`npx hardhat stat --chain bsc`

To run the relayer between `polygon` and `bsc` chains,

In a new shell,

`npx hardhat launchRelay --chain1 polygon --chain2 bsc`,

where you can see logs of the events and which handlers are being invoked.

Note that, with the current implmentation, the relayer should be running for the correct delivery of the events to the other chain. Any missing events for whatever reason are not automatically recovered.

### lock & release
For `lock` operatoin,

`npx hardhat lock --fromchain polygon --tochain bsc --from alice --to bob --amount 0.1`

where `--amount` is denominated in unit. That is, 0.1 mean 10 cents.

when successful, you can get the id of the bridge record. You can plug that in the following command to release the fund from the `bsc` chain.

`npx hardhat release --chain bsc --account bob --id {id}`

### lock & revert succesful
`npx hardhat lock --fromchain bsc --tochain polygon --from alice --to bob --amount 0.5`

`npx hardhat revert --account alice --chain bsc --id {id}`

`npx hardhat redeem --account alice --chain bsc --id {id}`

The follwoing attempt to release the locked fund from `polygon` chain should fail after the above `revert` operation.

`npx hardhat release --account bob --chain polygon --id {id}`

Currently, the revert reason is not retrieved but you can check it from [BSC Testnet explorer](https://testnet.bscscan.com/).
The revert reason should show `bridge: invalid state`.

### lock & revert failure
`npx hardhat lock --fromchain bsc --tochain polygon --from alice --to bob --amount 0.5`

This time `bob` on `polygon` release the fund first.

`npx hardhat release --account bob --chain polygon --id {id}`

When `alice` try to revert the bridge transaction with

`npx hardhat revert --account alice --chain bsc --id {id}`

 and try to redeem the fund with

`npx hardhat redeem --account alice --chain bsc --id {id}`

It should fail.

Before issuing `redeem` command, the status of the bridge record can be checked using

`npx hardhat txStatus --chain mumbai --id {id}`

which should show `RELEASED` state.

## Test
To run local test, two local hardhat nodes need to run,
```
npx hardnat node --port 18545
npx hardnat node --port 28545
npx hardhat test
```

## build test configuration from scratch
## Known issues & TODO
- make relay stateful (events catchup logic?)
  firebase w/ rpc may be a good architecture if we don't care too much about perf/.
- peer balance logic is fragile. additional sync command necessary?
- proper to have handling decimals in relay?
  should it be inside contract?
- gas limit and price hardcoded
- duplicate rpc requests in the scripts (minor)
- withdrawal/kill from bridge
- bridge admin (lifecycle, change relayer, owner, token etc)

## Other notes
- polygon default rpc stucky. alchemy is used.

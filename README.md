# EVM-Translator-Demo

```
gh repo clone the-metagame/evm-translator-demo
```

```
cd evm-translator-demo
```

## Prerequisites

## [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)

To install

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

I know node v16.12.0 works, other versions probably work too

```
nvm install 16.12.0
```

## yarn

```
npm install --global yarn
```

## environment variables

```
cp .env.example .env
```

You'll need 3 API keys in addition to the Mongoose key provided for you:

[Covalent](https://www.covalenthq.com/platform/#/auth/register/)

[Etherscan](https://etherscan.io/register)

<!-- [Alchemy](https://dashboard.alchemyapi.io/) Or  -->

[QuickNode](https://quicknode.com/)

(You'll need a "build" plan to access Parity's trace API on QuickNode's Archive nodes. Or, you can point it directly to a node you have access to)

If you don't have access to an archive node with tracing, please ask for an api key in the ask-for-api-key channel in our [discord](https://discord.gg/eupEsdWA)

## evm-translator package

Most of the dev work we do is in this package, so we need to pull that folder down and `yarn link` it to this package so the changes are propagated live

```
cd ..
```

```
gh repo clone the-metagame/evm-translator
```

```
cd evm-translator
```

```
yarn link
```

```
cd ../evm-translator-demo
```

```
yarn link evm-translator
```

Because evm-translator is typescript, we need to run a watcher so it compiles on save.

In a second terminal window / tab:

```
cd evm-translator
```

```
yarn install
```

```
yarn dev
```

## Running evm-translator demo

Back in your first terminal window

```
yarn install
```

```
yarn dev
```

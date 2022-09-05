# Aspen Publishing SDK

**Aspen Publishing SDK** is a developer-friendly interface where developers/creators/clients can interact with Aspen's Publishing contracts out-of-the-box.

## How it works

Aspen Publishing SDK's has a folder in `pkg/sdk/src/abi` where the `JSON abis` of the contracts are located. Once, the steps of the `Software Build` chapter are done.
Any developer can use these contracts, to show how an app can be builded and how the contracts are used we provided with some examples in `pkg/examples`.

## Software Build

### Step 1: Get sources from Github

```
   $ git clone https://github.com/monax/aspen-publishing-sdk.git
   $ cd aspen-publishing-sdk
```

### Step 2: Install dependencies

After getting the sources, we install the general dependencies and we create the workspaces to allow the interaction between `pkgs`.

```
   $ yarn install
```

### Step 3: Generate Typescript contracts

Once is installed, we should go to the `pkg/sdk` and create the `types` files in `Typescript` from the contracts.
Doing this process, will allow the developers/users to see the flow of generating them.

```
  $ cd sdk
  $ yarn generate
  $ yarn build
  $ yarn prettier
  $ yarn lint
```

Now it's all set to use it in any `Typescript` project. This contracts could work in any other languague using the right libraries.

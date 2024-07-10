<p align="center">
<a href="https://llamaworkspace.ai">
  <img width="90" src="https://assets.llamaworkspace.ai/joia_logo_red.svg" alt="Llama Workspace Logo">
  
</a>
</p>

<h3 align="center"><strong>Host a ChatGPT Teams/Enterprise alternative on your infra</strong></h3>

[Llama Workspace](https://llamaworkspace.ai/) is an open source alternative to ChatGPT for Teams, designed from the ground up for collaboration.

The easiest way to get started with Llama Workspace is by creating a [Llama Workspace Cloud account](https://llamaworkspace.ai/). If you prefer to self-host Llama Workspace, please refer to our documentation below.

## Main features & benefits

- Efortlessly grant **people access** to a user-friendly AI Chat.
- Use any LLM, including the **latest open source LLMs** like Llama 2, Mixtral and others (more coming soon).
- Create **collaborative chatbots** for specific use cases, and share them across your teams.
- **Save between of 50% and 75%** (depends on usage) compared to _ChatGPT for Teams_ and _ChatGPT Enterprise_.
- **Get responses 40% faster** than ChatGPT Plus. The OpenAI API is generally faster.
- **Prevent your prompts from being used for training purposes**. When using ChatGPT Plus, your data might then be used for training purposes. However, when connecting to OpenAI via API keys, you're guaranteed that any inputs provided won't be used.

## Getting started

#### Cloud

The easiest way to get started with Llama Workspace is with [our official managed service in the cloud](https://llamaworkspace.ai/). At the moment it is completely free to use without limits, although we have plans to introduce a pricing model in the future.

In the cloud version you can either use your own API keys for LLM provider, or purchase credits with us.

Our cloud version can save a substantial amount of developer time and resources. We think it's the de-facto solution for most customers and the one which provides most value for mone. Plus, any future revenues will go towards the funding and maintenance of Llama Workspace. You’ll be supporting open source software and getting a great service!

#### Vercel

To deploy on Vercel, follow these steps:

1. Create a project by clicking on **Add New... > Project**.
2. Select **Import Third-Party Git Repository** and enter the URL of this repository.
3. Insert the environment variables. To do so, use `.env.example` as a reference for the variables to fill in. You'll need to set the `DATABASE_URL` variable to point to your Postgres database, which you can provision with Vercel.
4. Deploy the project.
5. Set up your domain to point to the Vercel deployment.

#### Fully self-hosted

To self host a Llama Workspace app you'll need to follow the next steps:

1. Provision a Postgres database. The details may vary based on your stup.
2. Clone or copy this repository.
3. Create an `.env` file based on the `.env.example` file. You'll need to set the `DATABASE_URL` variable to point to your Postgres database.
4. Install the dependencies by running `npm install`.
5. Build the NextJS app by running `npm run production:build`. This will prepare NextJS to be built and run the build itself.
6. Run a post-install script by running `npm run production:postbuild`. This script will run the migrations.
7. Bootstrap the app by running `npm run production:start`.

## Feedback

We are happy to hear your valuable feedback. For this purpose, we have created a [Discord channel](https://discord.com/invite/wTHhNBDKvW) where you can share your thoughts and ideas. [Join the channel here](https://discord.com/invite/wTHhNBDKvW).

## Roadmap

We welcome feedback from our community. To stay up to date with all the latest news and product updates or to reach us, [follow us on X (formerly Twitter)](https://twitter.com/joiahq).

## License & Trademarks

Llama Workspace is open source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version.

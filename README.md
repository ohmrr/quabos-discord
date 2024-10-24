# Quabos

## Project Description

Quabos is a Discord bot designed to enhance your server experience with various commands and features. It includes commands for displaying user avatars, managing server configurations, providing help and information, and more.

## Setup Instructions

### Installing Dependencies

To install the necessary dependencies, run the following command in the root directory of the project:

```bash
pnpm install
```

### Configuring Environment Variables

Create a `.env` file in the `packages/bot` directory and add the following environment variables:

```
DISCORD_TOKEN=your_discord_bot_token
DATABASE_URL=your_database_url
```

Replace `your_discord_bot_token` with your actual Discord bot token and `your_database_url` with your database connection URL.

## Usage Examples

### /avatar

Displays the avatar of the selected server member.

```
/avatar [user]
```

### /config

Manages bot configuration.

#### /config channels add

Adds a new channel for reading messages.

```
/config channels add [channel]
```

#### /config channels list

View the list of channels being read for messages.

```
/config channels list
```

#### /config channels remove

Removes a channel that Quabos reads messages from.

```
/config channels remove [channel]
```

### /help

Shows command information.

```
/help [command]
```

### /info

Information about Quabos and the current guild.

#### /info bot

Shows information about Quabos.

```
/info bot
```

#### /info stats

Shows Quabos's stats for the current server.

```
/info stats
```

## Contributing

We welcome contributions to the Quabos project! Here are some guidelines to help you get started:

### Reporting Issues

If you encounter any issues or bugs, please report them by creating a new issue on the [GitHub repository](https://github.com/ohmrr/quabos/issues). Provide as much detail as possible to help us understand and resolve the issue.

### Submitting Pull Requests

If you would like to contribute code to the project, follow these steps:

1. Fork the repository on GitHub.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and descriptive commit messages.
4. Push your changes to your forked repository.
5. Create a pull request on the main repository, describing your changes and the problem they solve.

We will review your pull request and provide feedback. Once approved, your changes will be merged into the main repository.

Thank you for contributing to Quabos!

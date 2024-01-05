# PokerStars Statistics

This script is designed to track poker game history and uses `console.log` to print statistics to the terminal.

**This script supports only play money**

## Supported Games

* The list of supported games can be found in the [types/general.ts](https://github.com/Jantero93/poker-statistics-script/blob/master/src/types/general.ts) file.

## Features

The script keeps track of the count of played hands for each supported game, including both cash and tournament games. Games with zero counts are not printed (customizable from the .env file).

The script attempts to detect the localization from your system, with a default value of "en-US". You can also set this in the .env file.

**For tournaments and sit & go's, it tracks:**

* Total games played
* Total wins
* Winning percentage
* Tournament earnings
* Paid buy-ins & re-entries
* The difference between wins and buy-ins & re-entries
* Earnings compared to costs (percentage value)


**Example output of script time when readme is updated. (fi-FI) localization, minimun played hands for game is 10 to show in statistics**
```
--- Played hands by game ---
Hold'em No Limit         1 607
Hold'em Limit            488
Omaha Hi/Lo Limit        475
Razz                     467
7 Card Stud              427
7 Card Stud Hi/Lo        418
Triple Draw 2-7 Lowball  389
Omaha Pot Limit          366
------------------------------
All played hands         4 647

--- Tournament, sit & go statistics ---
Total games                   23
Total wins                    7
Winning percentage            30,43 %
Earned money                  943 625
Paid buy-ins (and rebuys)     580 000
Diff on buy-ins and winnings  363 625
Earnings compared to costs    62,69 %
```

## Environment variables and requirements

You need Node 17 (lower versions may be okay, not tested). The script may not work with Node >= 20.0.6 because dotenv is built-in.

If you have PokerStars installed on the default path and only one player account, the script will attempt to automatically detect the necessary environment variables if none are set. Otherwise, you need to set folder paths and player name manually in the .env file on the project root.

Localization and showing a minimum of played hands in statistics are optional.

There is a .env.example with instructions on what it should look like. If you do not provide an .env file, the script will try to detect these values from your operating system.

Example of .env file
```bash
# Name actual env file .env on project root
# You must set these three (HAND_HISTORY_FOLDER_PATH, TOURN_HAND_HISTORY_FOLDER_PATH, PLAYER_NAME)
# If you want try to script may be able to get these values automatically, build project without .env file.
# If build fails, then you need to set .env file
HAND_HISTORY_FOLDER_PATH="C:\Users\Windows_User\AppData\Local\PokerStars\HandHistory\Player_Name"
TOURNAMENT_STATISTICS_FOLDER_PATH="C:\Users\Windows_User\AppData\Local\PokerStars\TournSummary\Player_Name"
# This is needed if you give path but you have multiple accounts/player names in history folder
PLAYER_NAME="Player-name"

# Optional, default value "en-US"
# This can be removed
LOCALIZATION="fi-FI"

# Optional, don't show games played under n hands
# By default show all games which are played even once
# This can be removed
MIN_GAMES_SHOW=10
```
## Building the project
Run the following commands in the root to install dependencies and build the project:

```bash
npm install
npm run build
```
To run the statistics, use the command:

```bash
npm start
```
or
```bash
node dist/index.js
```



I recommend creating for example a bash script for this. I have the following bash script set as an alias
```bash
START_DIR=$(PWD)

cd /C/Users/<some path>/pokerstatistics/dist
clear
node index.js
cd $START_DIR

exit 0
```

## Bugs

Please [open an issue](https://github.com/Jantero93/pokerstars-statistics-script/issues) on GitHub if you find a bug. There may be a few.
Also open an issue if you encounter problems with installation or anything else.

## Feature Suggestions

Please [open an issue](https://github.com/Jantero93/pokerstars-statistics-script/issues) on GitHub. I am open to new suggestions.

**I'm open-minded for all kinds of discussions**
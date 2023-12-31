<h1>PokerStars statistics</h1>
Simple script(s) to track history. This will use console.log to print statistics to terminal
<h2>Supported games</h2>

* The list of supported games can be found in the [types/general.ts](https://github.com/Jantero93/poker-statistics-script/blob/master/src/types/general.ts) file.
<h2>Features</h2>

Keeps track of count of played hands for each game. (list above). This includes cash and tournament games. Doesn't print games which have not been played (count 0). This value can be customized from .env file

Script tries to find localization from your system. Fallback value is "en-US". You can also set this in .env file

**From tournaments and sit & go's this keeps track on:**

* Total games plays
* Total wins
* Winning percentage
* Tournament earnings
* Paid buy-ins & re-entries
* Shows difference between wins and buy-ins & re-entries
* Earnings compared to costs (percentage value)

**Example output of script time when readme is updated. (fi-FI) localization**
```
--- Played hands by game ---
Hold'em No Limit         1 391
Omaha Hi/Lo Limit        413
Razz                     408
Hold'em Limit            399
7 Card Stud Hi/Lo        376
7 Card Stud              373
Triple Draw 2-7 Lowball  343
Omaha Pot Limit          325
------------------------------
All played hands         4 038

--- Tournament, sit & go statistics ---
Total games                   17
Total wins                    6
Winning percentage            35,29 %
Earned money                  684 250
Paid buy-ins (and rebuys)     430 000
Diff on buy-ins and winnings  254 250
Earnings compared to costs    59,13 %

```

<h2>Build project</h2>
You need Node 17 (lower version may be ok, not tested). Im not sure will this work with >= Node 20.0.6 because env is built-in.

If you have installed PokerStars on default path and you have only one player account, script will try to detect automatically needed env variables if you have not set any.
<b>Otherwise you need set folder paths AND player name manually on .env file on project root.</b>

Localization and showing minimun of played hands in statistics are optional.

There is .env.example with instructions to show what it should look like. **If you do not provide .env file, script will try to detect these values from your operation system.**

Run commands on root to install depedencies and build project
First
> npm install

Then

> npm run build

To run statistics run command

> npm start

or

> node dist/index.js

I recommend doing e.g. bash script for this. For example I got this bash script and have set it on alias:
```
START_DIR=$(PWD)

cd /C/Users/<some path>/pokerstatistics/dist
clear
node index.js
cd $START_DIR

exit 0
```
<h2>Bugs</h2>
Please open issue on GitHub if you find bug. There probably are few.
Also do that if you have problems with installation or something like that.
<h2>Feature suggestion</h2>
Please open issue on GitHub. I gladly hear out new suggestions.


<h1>PokerStars statistics</h1>
Simple script(s) to track history. This will use console.log to print statistics to terminal

<b>Supported games:</b>
   * 7 Card Stud Hi/Lo
  * 7 Card Stud
  * Hold'em Limit
  * Hold'em No Limit
  * Omaha Hi/Lo Limit
  * Omaha Hi/Lo Pot Limit
  * Triple Draw 2-7 Lowball
  * Omaha Pot Limit
  * Razz

<h2>Features</h2>

Keeps track of count of played hands for each game. (list above). This includes cash and tournament games. Doesn't print games which have not been played (count 0).

It tryies to find localization from your system. Fallback value is "en-US"
<br/>

**From tournaments and sit & go's this keeps track on:**

* Total games plays
* Total wins
* Winning percentage
* Tournament earnings
* Paid buy-ins & re-entries
* Shows difference between wins and buy-ins & re-entries

**Example output of script time when readme is updated. (fi-FI) localization**
```
--- Played hands by game ---
Hold'em No Limit         1 207
Omaha Hi/Lo Limit        386
Razz                     384
Hold'em Limit            374
7 Card Stud Hi/Lo        357
7 Card Stud              347
Triple Draw 2-7 Lowball  329
Omaha Pot Limit          314
Omaha Hi/Lo Pot Limit    1
-----------------------------
All played hands         3 699

--- Tournament, sit & go statistics ---
Total games                   13
Total wins                    5
Winning percentage            38,46 %
Earned money                  588 625
Paid buy-ins (and rebuys)     330 000
Diff on buy-ins and winnings  258 625
```

<h2>Build project</h2>
You need Node 17 (lower version may be ok, not tested). Im not sure will this work with >= Node 20.0.6 because env is built-in.

If you have installed PokerStars on default path and you have only one player account, script will try to detect automatically needed env variables.
<b>Otherwise you need set folder paths AND player name manually on .env file on project root.</b>

Localization is optional.

There is .env.example with instructions to show what it should look like.

Run commands on root to compile & build project

> npm install

> npm run build

To run statistics run command

> node dist/index.js

or

> npm start

I recommend doing bash script for this. For example I got this bash script and have set it on alias:
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


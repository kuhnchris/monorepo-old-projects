# unity3d-gitcoin-kudoskardgame
This repository contains the source code of the GitCoin "Kudos Card game" - a Unity3D take on a hexagonal card-game.

## Resources used

The Kudos images are copyright by their respective owners. The source SVGs were collected from http://github.com/gitcoinco/web and converted to PNG via the following command line: 
```
find . |grep ".svg$" | while read r; do echo "$r"; convert -density 800 -resize 1108x1280 "${r}" "${r}_svg2png.png"; done
```

This requires "convert" - which is a ImageMagick command line tool.


The kudos 3d model is shared via CC-BY-SA-4.0 license. 
You can use the model in any shape, way or form you like it as long as you credit me and, if you would modify the model itself, publish the model via CC-BY-SA-4.0 license aswell.
If you would use the model, drop me a link, I'd love to check out your creations. :-)

## Rules
The current ruleset is planned as the following:
- There are 2-4 players per match.
- Each player has a set number of kudos (a deck), which can be played with.
- Each Kudos has a representive attack/defense value, which also counts as points. 
- Each player has a set number of HP.
- There is one start kudos in the center of the table. 
- The player can place Kudos around existing kudos. 
- If the placed Kudos has a higher attack value than the defense value of the kudos adjacent to it, the player gets points for the placed kudos and each "dominated" kudos.
- (placed Kudos attack value - dominated kudos defense value) damage will be dealt to the player that played the dominated kudos. 
- Kudos can have special abilities, for example "chaining", as in, if you "dominate" a kudos, you also get points for the adjacent kudos that the dominated one is dominating.
- The game ends if either:
  - all player have played all of their kudos -> the player with the highest number of points wins
  - all but one player have 0 hp -> the player with >0 HP wins
  - all player have 0 hp -> draw, everyone loses
  - all but one player leave the round, but there are more than 4 rounds played -> the player still in the game wins
  - else -> draw, everyone loses

The rule set is not yet implemented (july 2019) so right now this repository poses as tech demo.

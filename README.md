This plugin adds New World of Darkness dice rolling capabilities for a [NodeBB](http://nodebb.org) forum.

It will find the first /roll command that is in the post and roll ten sided dice, counting successes and re-rolling dice in the again limit automatically.

Here's the format:
`/roll P [A]`, where:

* P is the dice pool to roll, and
* A (optional; defaults to 10) is the limit one must meet to re-roll; to make sure there are no re-rolls, you can pass 11 to this

**Examples:**

`/roll 3` will display something like "Rolling: 3; Results: 10, 9, 4, 4; Succeses: 2"

`/roll 5 8` will display something like "Rolling: 5 (8-Again); Results: 1, 7, 7, 8, 3, 2; Succeses: 1"

`/roll 5 11` will display something like "Rolling: 5 (No Rerolls); Results: 3, 1, 10, 8, 2; Succeses: 2"
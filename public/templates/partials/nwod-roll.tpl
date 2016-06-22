<span title='{query}' class='dice-roll'>
  <img src='/plugins/nodebb-plugin-nwod-roller/static/d10.svg' class='dice-icon'></img>[[nwodroll:rolling, {pool}]]
  <!-- IF differentAgain -->
    <!-- IF noRerolling -->
      ([[nwodroll:no_rerolls, {noRerollingPlaceholder}]])
    <!-- ELSE -->
      ([[nwodroll:again, {again}]])
    <!-- ENDIF noRerolling -->
  <!-- ENDIF differentAgain -->
  -- [[nwodroll:results, {results}]] -- [[nwodroll:successes, {successes}]]
</span>
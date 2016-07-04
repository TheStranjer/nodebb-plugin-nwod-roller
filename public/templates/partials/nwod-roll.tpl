<span title='{query}' class='dice-roll'>
  <img src='/plugins/nodebb-plugin-nwod-roller/static/d10.svg' class='dice-icon'></img>[[nwodroll:rolling, {pool}]]
  <!-- IF differentAgain -->
    <!-- IF noRerolling -->
      ([[nwodroll:no_rerolls]])
    <!-- ELSE -->
      ([[nwodroll:again, {again}]])
    <!-- ENDIF noRerolling -->
  <!-- ENDIF differentAgain -->
  -- [[nwodroll:results]]
  <!-- BEGIN results -->
    <!-- IF results.successful -->
      <span class="dice-success">{results.numeric}</span>
    <!-- ELSE -->
      <span class="dice-failure">{results.numeric}</span>
    <!-- ENDIF results.successful -->
  <!-- END results -->
   -- [[nwodroll:successes, {successes}]]
</span>